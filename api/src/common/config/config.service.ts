import { parse, DotenvParseOutput } from 'dotenv';
import { readFileSync } from 'fs';
import * as Joi from 'joi';

export class ConfigService {
  private readonly envConfig: DotenvParseOutput;

  constructor(filePath: string) {
    const parsedConfig = parse(readFileSync(filePath));
    this.envConfig = this.validateInput(parsedConfig);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(parsedConfig: DotenvParseOutput) {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      DATABASE_TYPE: Joi.string().valid(
        'cockroachdb',
        'cordova',
        'mariadb',
        'mongodb',
        'mssql',
        'mysql',
        'nativescript',
        'oracle',
        'postgres',
        'react-native',
        'sqlite',
        'sqljs',
      ),
      GOOGLE_CLIENT_ID: Joi.string().required(),
      GOOGLE_SECRET: Joi.string().required(),
      MAILER_EMAIL: Joi.string().email().required(),
      MAILER_HOST: Joi.string().required().default('smtp.gmail.com'),
      MAILER_PORT: Joi.string().required().default('smtp.gmail.com'),
      PORT: Joi.number().default(465),
      REDIS_URI: Joi.string().required().default('redis://127.0.0.1:6379'),
      // API_AUTH_ENABLED: Joi.boolean()
      //   .required()
      //   .default(true),
      // add more validation rules ...
    });

    const validationOptions: Joi.ValidationOptions = { allowUnknown: true };

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      parsedConfig,
      validationOptions,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  /**
   * Generic getter
   */
  get(key: string) {
    return this.envConfig[key];
  }

  /**
   * Getters for each environment variable
   */
  public get isDev() {
    return this.envConfig.NODE_ENV === 'development';
  }

  public get isProd() {
    return this.envConfig.NODE_ENV === 'production';
  }

  public get isTest() {
    return this.envConfig.NODE_ENV === 'test';
  }

  public get databaseType() {
    return this.envConfig.DATABASE_TYPE;
  }

  public get databaseHost() {
    return this.envConfig.DATABASE_HOST;
  }

  public get databasePort() {
    return Number(this.envConfig.DATABASE_PORT);
  }

  public get databaseUsername() {
    return this.envConfig.DATABASE_USERNAME;
  }

  public get databasePassword() {
    return this.envConfig.DATABASE_PASSWORD;
  }

  public get databaseName() {
    return this.envConfig.DATABASE_NAME;
  }

  public get jwtAccessTokenSecret() {
    return this.envConfig.JWT_ATOKEN_SECRET;
  }

  public get jwtRefreshTokenSecret() {
    return this.envConfig.JWT_RTOKEN_SECRET;
  }

  public get jwtAccessTokenExpiration() {
    return this.envConfig.JWT_ATOKEN_EXPIRATION_TIME;
  }

  public get jwtRefreshTokenExpiration() {
    return this.envConfig.JWT_RTOKEN_EXPIRATION_TIME;
  }

  public get mailerEmail() {
    return this.envConfig.MAILER_EMAIL;
  }

  public get mailerPassword() {
    return this.envConfig.MAILER_PASSWORD;
  }

  public get mailerHost() {
    return this.envConfig.MAILER_HOST;
  }

  public get mailerPort() {
    return this.envConfig.MAILER_PORT;
  }

  public get googleauthClientId() {
    return this.envConfig.GOOGLEAUTH_CLIENT_ID;
  }

  public get googleauthClientSecret() {
    return this.envConfig.GOOGLEAUTH_CLIENT_SECRET;
  }

  public get googleauthRedirectUri() {
    return this.envConfig.GOOGLEAUTH_REDIRECT_URI;
  }
}
