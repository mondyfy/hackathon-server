import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_NAME'),
      synchronize: this.getValue('DB_SYNCHRONIZE') === 'true' ? true : false,
      autoLoadEntities: this.getValue('DB_AUTOLOADENTITIES') === 'true' ? true : false,
      migrationsTableName: 'migrations',
      migrations: [join(__dirname, '../database/migrations', '*.{ts,js}')],
      subscribers: ['src/database/subscribers/*.ts'],
      entities: [join(__dirname, '../database/models', '*.entity.{ts,js}')],

      cli: {
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'src/database/subscribers',
      },
      ssl: this.isProduction(),
      extra: {
        ssl:  this.isProduction() ? { rejectUnauthorized: false } : null,
      }
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_SYNCHRONIZE',
    'DB_AUTOLOADENTITIES',
  ]);

export { configService };