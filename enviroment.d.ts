export interface Env {
		APP_PORT : string
		NODE_ENV: string
		POSTGRES_USER: string
		POSTGRES_PASSWORD: string
		POSTGRES_PORT: string
		POSTGRES_HOST: string
		POSTGRES_DB: string
		JWT_SECRET: string
		ADMIN_USERNAME: string
		ADMIN_PASSWORD: string
		JWT_EXPIRE_TIME: string
		SECRET_KEY: string
		IV: string
		DOCKER_EXPORT_APP_PORT: string
		DOCKER_CONTAINER_NAME: string
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

export { }

