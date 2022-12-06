import db from "../db/logsDb.js";

class LogsService {
    // It finds account transactions made on a given date, in the logs table
    // (where stored an information about transactions, and account state that moment),
    // and returns the most recent one.
    // If there are no transactions, it searches for all account transactions, and returns the most recent one.
    async getBelongings(data) {
        let personData = await db.getPersonLogByDate(data.name, data.timestamp);

        if (!personData[0]) {
            personData = await db.getPersonLog(data.name);
        }

        if (!personData[0]) {
            return;
        }

        let timestampTo = new Date(data.timestamp);

        // For handling both "yyyy-MM-dd" and "yyyy-MM-dd HH:mm:ss" input formats.
        if (!(data.timestamp.length > 10)) {
            timestampTo.setDate(timestampTo.getDate() + 1);
            timestampTo.setMilliseconds(timestampTo.getMilliseconds() - 1);
        }

        let latest = personData[0];

        // Log id check is required because there are can be multiple transactions made at the same second.
        // "logId" field has "serial" type, so bigger id means the latest log.
        for (const log of personData) {
            if (log.timestamp <= timestampTo) {
                if (log.timestamp >= latest.timestamp && log.logId > latest.logId)
                    latest = log;
            }
        }

        return latest;
    }
}

export default new LogsService();