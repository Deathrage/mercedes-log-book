declare namespace NodeJS {
  interface ProcessEnv {
    COSMOS_DB_CONNECTION_STRING: string;
    COSMOS_DB_DATABASE: string;
    MERCEDES_BENZ_ISSUER_URL: string;
    MERCEDES_BENZ_CLIENT_ID: string;
    MERCEDES_BENZ_CLIENT_SECRET: string;
    MERCEDES_BENZ_REDIRECT_URL: string;
  }
}
