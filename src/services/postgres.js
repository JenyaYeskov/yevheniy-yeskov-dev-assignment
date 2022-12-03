import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
    user: process.env.postgresUser,
    host: process.env.postgresHost,
    database: process.env.postgresDatabase,
    password: process.env.postgresPassword,
    port: process.env.postgresPort
})

class Postgres {
    async saveToTransactions(data) {
        let queryString = `insert into transactions (type, party, "counterParty", "assetType", amount, price, total, timestamp) 
                            values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

        let result = await pool.query(queryString, data);

        return result.rows[0];
    }

    async saveToLogs(data) {

    }

    async saveToAccounts(data) {

    }
}

export default new Postgres();