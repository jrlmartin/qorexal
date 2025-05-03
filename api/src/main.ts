import { restBootstrap } from './core/server';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
 
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const SERVICE_NAME = 'Qorexal API';
const VERSION = '1.11';

restBootstrap({
  module: AppModule, // <-- Updated to root module
  globalPrefix: process.env.GLOBAL_PREFIX,
  apiName: SERVICE_NAME,
  apiVersion: VERSION,
  host: process.env.SERVICE_HOST,
  port: parseInt(process.env.SERVICE_PORT, 10),
});
