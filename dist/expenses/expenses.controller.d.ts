import type { AuthenticatedRequestUser } from '../auth/auth.types.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { ValidateExpenseDto } from './dto/validate-expense.dto.js';
import { ExpensesService } from './expenses.service.js';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(user: AuthenticatedRequestUser, chantierId?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    }[]>;
    getBudget(user: AuthenticatedRequestUser, chantierId: string): Promise<{
        budget: import("@prisma/client/runtime/library").Decimal;
        validatedExpenses: import("@prisma/client/runtime/library").Decimal;
        remainingBudget: import("@prisma/client/runtime/library").Decimal;
        consumedPercent: import("@prisma/client/runtime/library").Decimal;
        progress: import("@prisma/client/runtime/library").Decimal;
        variance: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(user: AuthenticatedRequestUser, input: CreateExpenseDto): Promise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    }>;
    update(user: AuthenticatedRequestUser, expenseId: string, input: UpdateExpenseDto): Promise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    }>;
    submit(user: AuthenticatedRequestUser, expenseId: string): Promise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    } | null>;
    validate(user: AuthenticatedRequestUser, expenseId: string, input: ValidateExpenseDto): Promise<{
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
        amount: import("@prisma/client/runtime/library").Decimal;
        description: string | null;
        status: import("@prisma/client").$Enums.ExpenseStatus;
        date: Date;
        receiptUrl: string | null;
    } | null>;
}
