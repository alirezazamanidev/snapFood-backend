namespace NodeJS {
  interface ProcessEnv {
    // Application
    NODE_ENV: string;
    PORT: number;
    // Db
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_USERNAME: string;
    DB_PORT: number;
    DB_TYPE: string;
  }
}
