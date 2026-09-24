import { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { ValidateExpenseDto } from './dto/validate-expense.dto.js';
export declare class ExpensesService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    findAll(companyId: string, userId: string, chantierId?: string): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        companyId: string;
        userId: string | null;
        updatedAt: Date;
        chantierId: string;
        category: string;
        amount: Prisma.Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    }[]>;
    create(companyId: string, userId: string, input: CreateExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        companyId: string;
        userId: string | null;
        updatedAt: Date;
        chantierId: string;
        category: string;
        amount: Prisma.Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    }>;
    update(companyId: string, userId: string, expenseId: string, input: UpdateExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        companyId: string;
        userId: string | null;
        updatedAt: Date;
        chantierId: string;
        category: string;
        amount: Prisma.Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    }>;
    submit(companyId: string, userId: string, expenseId: string): Promise<{
        id: string;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        companyId: string;
        userId: string | null;
        updatedAt: Date;
        chantierId: string;
        category: string;
        amount: Prisma.Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    } | null>;
    validate(companyId: string, userId: string, expenseId: string, input: ValidateExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
        companyId: string;
        userId: string | null;
        updatedAt: Date;
        chantierId: string;
        category: string;
        amount: Prisma.Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    } | null>;
    getBudget(companyId: string, userId: string, chantierId: string): Promise<{
        budget: Prisma.Decimal;
        validatedExpenses: Prisma.Decimal;
        remainingBudget: Prisma.Decimal;
        consumedPercent: Prisma.Decimal;
        progress: Prisma.Decimal;
        variance: Prisma.Decimal;
    }>;
    private assertChantierMembership;
    private findAccessibleExpense;
    private describeBlockedValidation;
}
