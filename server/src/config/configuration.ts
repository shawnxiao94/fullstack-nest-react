import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'

export const getConfiguration = () =>
  ({
    rootRoleId: parseInt(process.env.ROOT_ROLE_ID || '1'),
    // nodemailer config
    mailer: {
      host: 'xxx',
      port: 80,
      auth: {
        user: 'xxx',
        pass: 'xxx'
      },
      secure: false // or true using 443
    },
    // amap config
    amap: {
      key: 'xxx'
    },
    // jwt sign secret
    jwt: {
      secret: process.env.JWT_SECRET || 'secretKey', // jwt 秘钥
      expiresIn: process.env.JWT_EXPIRES_IN || '4h' // jwt 时效时间
    },
    // 守卫策略名称
    guardStrategy: {
      userAuth: process.env.USER_EXISTS_STRATEGY || 'local',
      jwtAuth: process.env.JWT_STRATEGY || 'jwt'
    },
    // typeorm config
    database: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number.parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
      database: process.env.MYSQL_DATABASE,
      migrations: ['dist/src/migrations/**/*.js'],
      autoLoadEntities: true, // 自动执行引入实体
      /** https://typeorm.io/migrations */
      synchronize: true,
      logging: ['error'],
      timezone: '+08:00', // 东八区
      cli: {
        // migrationsDir: 'src/migrations'
      }
    } as MysqlConnectionOptions,
    redis: {
      host: process.env.REDIS_HOST, // 域名
      port: parseInt(process.env.REDIS_PORT, 10), // default value
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB, 10), // //目标库
      cache_ttl: parseInt(process.env.REDIS_TTL, 10) // 过期时间
    },
    // logger config
    logger: {
      timestamp: false,
      dir: process.env.LOGGER_DIR,
      maxFileSize: process.env.LOGGER_MAX_SIZE,
      maxFiles: process.env.LOGGER_MAX_FILES,
      errorLogName: process.env.LOGGER_ERROR_FILENAME,
      appLogName: process.env.LOGGER_APP_FILENAME
    },
    // swagger
    swagger: {
      enable: process.env.SWAGGER_ENABLE === 'true',
      path: process.env.SWAGGER_PATH,
      title: process.env.SWAGGER_TITLE,
      desc: process.env.SWAGGER_DESC,
      version: process.env.SWAGGER_VERSION
    }
  } as const)

export type ConfigurationType = ReturnType<typeof getConfiguration>

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type ConfigurationKeyPaths = Record<NestedKeyOf<ConfigurationType>, any>
