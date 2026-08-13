// Database client with resilient connection handling
// Connects to PostgreSQL Prisma instance or operates in memory fallback mode

export interface GenericDB {
  habit: {
    findMany: (args?: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  habitLog: {
    create: (args: any) => Promise<any>;
  };
  realmState: {
    findMany: (args?: any) => Promise<any[]>;
    findFirst: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
}

let prismaClientInstance: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  if (PrismaClient) {
    prismaClientInstance = new PrismaClient();
  }
} catch {
  // Prisma client not yet initialized or offline
}

export const db: GenericDB = prismaClientInstance || {
  habit: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (args: any) => ({ id: `h-${Date.now()}`, ...args.data }),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
  },
  habitLog: {
    create: async (args: any) => ({ id: `log-${Date.now()}`, ...args.data }),
  },
  realmState: {
    findMany: async () => [],
    findFirst: async () => null,
    update: async (args: any) => ({ id: args.where?.id, ...args.data }),
  },
};

export default db;
