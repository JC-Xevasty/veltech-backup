declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
      PORT: number
      CLIENT_BASE_URI: string
      SESSION_SECRET: string
      DATABASE_URL: string
      GMAIL_ADDRESS: string
      GMAIL_PASSWORD: string
    }
  }
}