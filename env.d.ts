declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string | undefined;
      BOT_USERNAME: string | undefined;
      CHANNEL_ID: string | undefined;
      DEX_URL: string | undefined;
    }
  }
}

export {};
