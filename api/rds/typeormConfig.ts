import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { types } from 'pg';
import * as dotenv from 'dotenv';
 
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Addresses https://github.com/typeorm/typeorm/issues/2400
types.setTypeParser(20, function (val: string) {
  return parseInt(val, 10);
});

const ssl =
  process.env.NODE_ENV === 'development'
    ? {}
    : {
        ssl: {
          rejectUnauthorized: false,
        },
      };

export const typeOrmConfig = (__dirname): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.RUN_LOCAL ? 'localhost' : process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/**/*.entity.{js,ts}'],
    migrations: [__dirname + '/**/*.migration.{js,ts}'],
    synchronize: process.env.SYNCHRONIZE == 'true',
    logging: process.env.LOG_TYPEORM_QUERIES?.toLowerCase() == 'true',
    ...ssl,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      // based on  https://node-postgres.com/api/pool
      // max connection pool size
      max: 10,
      // connection timeout
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 0,
    },
  };
};
