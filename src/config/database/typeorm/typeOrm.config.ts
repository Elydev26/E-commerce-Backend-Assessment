import { config } from 'dotenv';
import { resolve } from 'path';
import { pathFromSrc } from 'src/config/helpers/general';
import { getEnvPath } from 'src/helper/env.helper';
import { DataSourceOptions } from 'typeorm';

const envFilePath: string = getEnvPath(
  resolve(__dirname, '../..', 'common/envs'),
);
config({ path: envFilePath });
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  // host: process.env.DATABASE_HOST,
  // port: parseInt(process.env.DATABASE_PORT, 10),
  // database: process.env.DATABASE_NAME,
  // username: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASSWORD,
  url: process.env.POSTGRES_URL,
  entities: [pathFromSrc('/**/*.entity.{js,ts}')],
  migrations: [pathFromSrc('config/migrations/**/*.{js,ts}')],
  logger: 'simple-console',
  synchronize: false, // never use TRUE in production!
  logging: true, // for debugging in dev Area only
};
