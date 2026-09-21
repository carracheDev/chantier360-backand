import {
  AttendanceStatus,
  ChantierStatus,
  ExpenseStatus,
  IncidentSeverity,
  IncidentStatus,
  JournalStatus,
  MaterialMovementType,
  PermissionLevel,
  PrismaClient,
  ReportType,
  TaskStatus,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
const day = (value: string) => new Date(`${value}T00:00:00.000Z`);
// Mot de passe de démonstration, surchargeable via SEED_DEMO_PASSWORD.
const demoPassword = process.env.SEED_DEMO_PASSWORD ?? 'Chantier360!2026';

const permissionDefinitions = [
  ['chantier.read', 'Consulter les chantiers', PermissionLevel.LECTURE],
  ['chantier.create', 'Créer un chantier', PermissionLevel.ADMINISTRATION],
  ['chantier.update', 'Modifier un chantier', PermissionLevel.SAISIE],
  ['chantier.validate', 'Valider les données chantier', PermissionLevel.VALIDATION],
  ['expense.read', 'Consulter les dépenses', PermissionLevel.LECTURE],
  ['expense.create', 'Créer une dépense', PermissionLevel.SAISIE],
  ['expense.update', 'Modifier une dépense', PermissionLevel.SAISIE],
  ['expense.validate', 'Valider une dépense', PermissionLevel.VALIDATION],
  ['material.read', 'Consulter les matériaux', PermissionLevel.LECTURE],
  ['material.create', 'Créer un mouvement de matériau', PermissionLevel.SAISIE],
  ['material.update', 'Modifier un mouvement de matériau', PermissionLevel.SAISIE],
  ['material.validate', 'Valider un mouvement de matériau', PermissionLevel.VALIDATION],
  ['journal.read', 'Consulter le journal', PermissionLevel.LECTURE],
  ['journal.create', 'Créer une entrée de journal', PermissionLevel.SAISIE],
  ['journal.update', 'Modifier une entrée de journal', PermissionLevel.SAISIE],
  ['journal.validate', 'Valider une entrée de journal', PermissionLevel.VALIDATION],
  ['report.read', 'Consulter les rapports', PermissionLevel.LECTURE],
  ['report.create', 'Créer un rapport', PermissionLevel.SAISIE],
  ['user.manage', 'Gérer les utilisateurs', PermissionLevel.ADMINISTRATION],
  ['role.manage', 'Gérer les rôles', PermissionLevel.ADMINISTRATION],
  ['permission.manage', 'Gérer les permissions', PermissionLevel.ADMINISTRATION],
  ['project_member.manage', 'Gérer les affectations chantier', PermissionLevel.ADMINISTRATION],
] as const;

const roleDefinitions = {
  DIRECTEUR: 'Pilotage global des chantiers et de la performance.',
  CONDUCTEUR_TRAVAUX: 'Supervision opérationnelle et validation terrain.',
  CHEF_CHANTIER: 'Collecte et suivi des informations terrain.',
  MAGASINIER: 'Gestion des matériaux et des mouvements de stock.',
  COMPTABLE: 'Gestion et validation des dépenses et rapports.',
  ADMIN: 'Gestion des utilisateurs, rôles, permissions et affectations.',
} as const;

const rolePermissionCodes: Record<keyof typeof roleDefinitions, string[]> = {
  DIRECTEUR: permissionDefinitions.map(([code]) => code),
  // Matrice de référence (cahier des charges, §5) : sur le module Dépenses, le conducteur
  // est en saisie (✏️) ; la validation (✅) est réservée au comptable et au directeur.
  CONDUCTEUR_TRAVAUX: [
    'chantier.read', 'chantier.update', 'chantier.validate', 'expense.read',
    'expense.create', 'expense.update', 'material.read',
    'material.create', 'material.update', 'material.validate', 'journal.read',
    'journal.create', 'journal.update', 'journal.validate', 'report.read',
    'report.create',
  ],
  CHEF_CHANTIER: [
    'chantier.read', 'expense.read', 'expense.create', 'expense.update',
    'material.read', 'material.create', 'journal.read', 'journal.create',
    'journal.update',
  ],
  MAGASINIER: ['chantier.read', 'material.read', 'material.create', 'material.update', 'material.validate'],
  COMPTABLE: ['chantier.read', 'expense.read', 'expense.create', 'expense.update', 'expense.validate', 'report.read', 'report.create'],
  ADMIN: ['user.manage', 'role.manage', 'permission.manage', 'project_member.manage'],
};

async function main(): Promise<void> {
  // Un hash argon2 réel est indispensable : le placeholder précédent rendait toute connexion impossible.
  const demoPasswordHash = await argon2.hash(demoPassword);

  const company = await prisma.company.upsert({
    where: { name: 'CHANTIER360 DEMO' },
    update: {},
    create: {
      name: 'CHANTIER360 DEMO',
      address: 'Adresse de démonstration',
      phone: '+0000000000',
    },
  });

  const permissions = new Map<string, { id: string }>();
  for (const [code, description, level] of permissionDefinitions) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: { description, level },
      create: { code, description, level },
      select: { id: true },
    });
    permissions.set(code, permission);
  }

  const roles = new Map<string, { id: string }>();
  for (const [name, description] of Object.entries(roleDefinitions)) {
    const role = await prisma.role.upsert({
      where: { companyId_name: { companyId: company.id, name } },
      update: { description },
      create: { companyId: company.id, name, description },
      select: { id: true },
    });
    roles.set(name, role);

    for (const code of rolePermissionCodes[name as keyof typeof roleDefinitions]) {
      const permission = permissions.get(code);
      if (!permission) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }

    // Le seed est la source de vérité de la matrice : une permission retirée de la définition
    // doit être révoquée en base, sinon l'upsert ci-dessus ne ferait qu'ajouter des droits
    // et une correction de matrice (ex. retrait de expense.validate au conducteur) resterait sans effet.
    const grantedIds = rolePermissionCodes[name as keyof typeof roleDefinitions]
      .map((code) => permissions.get(code)?.id)
      .filter((id): id is string => Boolean(id));
    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id, permissionId: { notIn: grantedIds } },
    });
  }

  const userDefinitions = [
    ['Awa Directeur', 'directeur.demo@chantier360.local', 'DIRECTEUR'],
    ['Basile Conducteur', 'conducteur.demo@chantier360.local', 'CONDUCTEUR_TRAVAUX'],
    ['Chantal Chef', 'chef.demo@chantier360.local', 'CHEF_CHANTIER'],
    ['David Magasinier', 'magasinier.demo@chantier360.local', 'MAGASINIER'],
    ['Estelle Comptable', 'comptable.demo@chantier360.local', 'COMPTABLE'],
    ['Admin Démo', 'admin.demo@chantier360.local', 'ADMIN'],
  ] as const;

  const users = new Map<string, { id: string }>();
  for (const [name, email, roleName] of userDefinitions) {
    const user = await prisma.user.upsert({
      where: { companyId_email: { companyId: company.id, email } },
      update: { name, active: true, passwordHash: demoPasswordHash },
      create: {
        companyId: company.id,
        name,
        email,
        phone: '+0000000000',
        passwordHash: demoPasswordHash,
      },
      select: { id: true },
    });
    users.set(roleName, user);

    const role = roles.get(roleName);
    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }
  }

  const director = users.get('DIRECTEUR');
  const conductor = users.get('CONDUCTEUR_TRAVAUX');
  const siteManager = users.get('CHEF_CHANTIER');
  const accountant = users.get('COMPTABLE');
  const storekeeper = users.get('MAGASINIER');
  if (!director || !conductor || !siteManager || !accountant || !storekeeper) {
    throw new Error('Les utilisateurs de démonstration n’ont pas pu être créés.');
  }

  const chantier = await prisma.chantier.findFirst({ where: { companyId: company.id, name: 'École Tokpa' } })
    ?? await prisma.chantier.create({
      data: {
        companyId: company.id,
        name: 'École Tokpa',
        description: 'Chantier de démonstration CHANTIER360.',
        location: 'Tokpa',
        budget: '125000000',
        progress: '58',
        startDate: day('2026-06-01'),
        endDate: day('2026-12-31'),
        status: ChantierStatus.EN_COURS,
      },
    });

  const secondChantier = await prisma.chantier.findFirst({ where: { companyId: company.id, name: 'Bâtiment Démo' } })
    ?? await prisma.chantier.create({
      data: {
        companyId: company.id,
        name: 'Bâtiment Démo',
        description: 'Second chantier de test.',
        location: 'Zone industrielle',
        budget: '80000000',
        progress: '24',
        startDate: day('2026-08-15'),
        endDate: day('2027-02-28'),
        status: ChantierStatus.PLANIFIE,
      },
    });

  // Tous les profils de démonstration sont affectés aux deux chantiers pour permettre
  // de parcourir l'ensemble du back-office (les permissions, elles, restent inchangées).
  for (const user of [director, conductor, siteManager, storekeeper, accountant]) {
    for (const target of [chantier, secondChantier]) {
      await prisma.projectMember.upsert({
        where: { userId_chantierId: { userId: user.id, chantierId: target.id } },
        update: {},
        create: { companyId: company.id, userId: user.id, chantierId: target.id },
      });
    }
  }

  const cement = await prisma.material.findFirst({ where: { companyId: company.id, name: 'Ciment 50 kg' } })
    ?? await prisma.material.create({ data: { companyId: company.id, name: 'Ciment 50 kg', unit: 'sac', minimumStock: '20' } });
  const steel = await prisma.material.findFirst({ where: { companyId: company.id, name: 'Fer à béton 12 mm' } })
    ?? await prisma.material.create({ data: { companyId: company.id, name: 'Fer à béton 12 mm', unit: 'barre', minimumStock: '50' } });

  const movementCount = await prisma.materialMovement.count({ where: { companyId: company.id } });
  if (movementCount === 0) {
    await prisma.materialMovement.createMany({
      data: [
        { companyId: company.id, chantierId: chantier.id, materialId: cement.id, userId: storekeeper.id, type: MaterialMovementType.ENTREE, quantity: '100', unitCost: '4500', reference: 'RECEPT-DEMO' },
        { companyId: company.id, chantierId: chantier.id, materialId: cement.id, userId: siteManager.id, type: MaterialMovementType.SORTIE, quantity: '20', unitCost: '4500', reference: 'SORTIE-DEMO' },
        { companyId: company.id, chantierId: chantier.id, materialId: steel.id, userId: storekeeper.id, type: MaterialMovementType.ENTREE, quantity: '200', unitCost: '6500', reference: 'RECEPT-DEMO-2' },
      ],
    });
  }

  const worker = await prisma.worker.findFirst({ where: { companyId: company.id, name: 'Jean Démonstration' } })
    ?? await prisma.worker.create({ data: { companyId: company.id, chantierId: chantier.id, name: 'Jean Démonstration', function: 'Maçon', phone: '+0000000000', dailyRate: '12000' } });
  await prisma.attendance.upsert({
    where: { workerId_date: { workerId: worker.id, date: day('2026-09-18') } },
    update: {},
    create: { companyId: company.id, chantierId: chantier.id, workerId: worker.id, date: day('2026-09-18'), status: AttendanceStatus.PRESENT, hours: '8' },
  });

  const journal = await prisma.journalEntry.upsert({
    where: { chantierId_date: { chantierId: chantier.id, date: day('2026-09-18') } },
    update: {},
    create: { companyId: company.id, chantierId: chantier.id, userId: siteManager.id, date: day('2026-09-18'), progress: '58', description: 'Coulage de la dalle principale.', weather: 'Ensoleillé', observations: 'Avancement conforme.', status: JournalStatus.SOUMIS },
  });
  await prisma.photo.createMany({
    data: [{ journalEntryId: journal.id, url: '/uploads/demo/journal-dalle.jpg', caption: 'Dalle principale' }],
    skipDuplicates: true,
  });

  const expenseCount = await prisma.expense.count({ where: { companyId: company.id } });
  if (expenseCount === 0) {
    await prisma.expense.create({ data: { companyId: company.id, chantierId: chantier.id, userId: siteManager.id, category: 'Matériaux', amount: '350000', description: 'Achat de ciment', status: ExpenseStatus.SOUMISE, date: day('2026-09-18') } });
  }

  const taskCount = await prisma.task.count({ where: { companyId: company.id } });
  if (taskCount === 0) {
    await prisma.task.create({ data: { companyId: company.id, chantierId: chantier.id, title: 'Terminer la dalle principale', description: 'Finaliser le coulage et le contrôle.', startDate: day('2026-09-15'), dueDate: day('2026-09-25'), progress: '70', status: TaskStatus.EN_COURS } });
  }

  const incidentCount = await prisma.incident.count({ where: { companyId: company.id } });
  if (incidentCount === 0) {
    await prisma.incident.create({ data: { companyId: company.id, chantierId: chantier.id, userId: siteManager.id, title: 'Retard de livraison', description: 'Une livraison de matériaux est décalée.', severity: IncidentSeverity.MOYENNE, status: IncidentStatus.OUVERT } });
  }

  const reportCount = await prisma.report.count({ where: { companyId: company.id } });
  if (reportCount === 0) {
    await prisma.report.create({ data: { companyId: company.id, chantierId: chantier.id, userId: accountant.id, type: ReportType.HEBDOMADAIRE, periodStart: day('2026-09-14'), periodEnd: day('2026-09-20') } });
  }

  console.log(`Seed terminé pour ${company.name}.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
