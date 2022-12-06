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

        let previous = [];

        for (const log of personData) {
            if (timestampTo >= log.timestamp) {
                previous.push(log);
            }
        }

        let latestToDate = previous[previous.length - 1];

        for (const log of previous) {
            if (log.timestamp > latestToDate.timestamp) {
                latestToDate = log;
            }
        }

        return latestToDate;
    }
}

export default new LogsService();