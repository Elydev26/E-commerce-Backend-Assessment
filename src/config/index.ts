import { config } from 'dotenv';
import { resolve } from 'path';
import { getEnvPath } from 'src/helper/env.helper';
import { pathFromSrc } from './helpers/general';

const envFilePath: string = getEnvPath(resolve(__dirname, '..', 'common/envs'));

config({ path: envFilePath });

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  // baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  database: {
    // host: process.env.DATABASE_HOST || 'localhost',
    // port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    // name: process.env.DATABASE_NAME || 'ecommercedb',
    // user: process.env.DATABASE_USER || 'hassan',
    // password: process.env.DATABASE_PASSWORD || 'password',
    url: process.env.POSTGRES_URL,
     entities: [pathFromSrc('/**/*.entity.{js,ts}')],
     migrations: [pathFromSrc('config/migrations/**/*.{js,ts}')],
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
  },
  adminUser: {
    email: process.env.ADMIN_EMAIL || 'admin@admin.com',
    password: process.env.ADMIN_PASSWORD || '12345678',
  },
});
