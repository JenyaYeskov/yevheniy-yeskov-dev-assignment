import pool from "./connection.js";

class TransactionsDb {
    async saveToTransactions(data) {
        let queryString = `insert into transactions (type, party, "counterParty", "assetType", amount, price, total, timestamp) 
                            values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

        let result = await pool.query(queryString, data);

        return result.rows[0];
    }

    async saveToLogs(data) {
        let queryString = `insert into logs (name, money, assets, timestamp) 
                            values ($1, $2, $3, $4) RETURNING *`;

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
}

export default new TransactionsDb();