import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { ValidateExpenseDto } from './dto/validate-expense.dto.js';
export declare class ExpensesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string, userId: string, chantierId?: string): Prisma.PrismaPromise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string | null;
        chantierId: string;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        category: string;
        amount: Prisma.Decimal;
        date: Date;
        receiptUrl: string | null;
    }[]>;
    create(companyId: string, userId: string, input: CreateExpenseDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string | null;
        chantierId: string;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        category: string;
        amount: Prisma.Decimal;
        date: Date;
        receiptUrl: string | null;
    }>;
    update(companyId: string, userId: string, expenseId: string, input: UpdateExpenseDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string | null;
        chantierId: string;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        category: string;
        amount: Prisma.Decimal;
        date: Date;
        receiptUrl: string | null;
    }>;
    submit(companyId: string, userId: string, expenseId: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string | null;
        chantierId: string;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        category: string;
        amount: Prisma.Decimal;
        date: Date;
        receiptUrl: string | null;
    } | null>;
    validate(companyId: string, userId: string, expenseId: string, input: ValidateExpenseDto): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        } | null;
        companyId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        description: string | null;
        chantierId: string;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        category: string;
        amount: Prisma.Decimal;
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
}
