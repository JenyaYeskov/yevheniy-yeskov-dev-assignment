import pool from "./connection.js";

class LogsDb {
    async getPersonLogByDate(name, timestamp) {
        let queryString = `SELECT * FROM logs WHERE name = $1 AND timestamp::text LIKE ($2)`;

        let result = await pool.query(queryString, [name, `${timestamp}%`]);

        return result.rows;
    }
}

export default new LogsDb();