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
        let queryString = `insert into logs (name, money, assets, "transId", timestamp) 
                            values ($1, $2, $3, $4, $5) RETURNING *`;

        let result = await pool.query(queryString, data);

        return result.rows[0];
    }

    async saveToAccounts(data) {
        let queryString = `UPDATE accounts SET money = $1, assets = $2 WHERE "accId" = $3 RETURNING *`;

        let result = await pool.query(queryString, data);

        return result.rows[0];
    }

    async getAccountData(data) {
        let queryString = `select * from accounts where name = $1`;

        let result = await pool.query(queryString, [data]);

        return result.rows[0];
    }

    async createNewAccount(data) {
        let queryString = `insert into accounts (name,money) values ($1, $2) RETURNING *`;

        let result = await pool.query(queryString, data);

        return result.rows[0];
    }

    async getPersonLogByDate(name, timestamp) {
        let queryString = `SELECT * FROM logs WHERE name = $1 AND timestamp::text LIKE ($2)`;

        let result = await pool.query(queryString, [name, `${timestamp}%`]);

        return result.rows;
    }
}

export default new Postgres();