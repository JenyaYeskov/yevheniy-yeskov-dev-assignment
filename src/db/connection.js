import pg from "pg";
import "dotenv/config";

export default new pg.Pool({
    user: process.env.postgresUser,
    host: process.env.postgresHost,
    database: process.env.postgresDatabase,
    password: process.env.postgresPassword,
    port: process.env.postgresPort
})