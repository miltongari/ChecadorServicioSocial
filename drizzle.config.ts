import { defineConfig } from 'drizzle-kit';

/**
 * Configuración de Drizzle Kit para generación de migraciones y Drizzle Studio.
 */
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/checador.db',
  },
  verbose: true,
  strict: true,
});
