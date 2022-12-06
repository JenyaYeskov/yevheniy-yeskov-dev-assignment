import db from "../db/logsDb.js";

class LogsService {
    async getBelongings(data) {
        let personData = await db.getPersonLogByDate(data.name, data.timestamp);

        if (!personData[0]) {
            personData = await db.getPersonLog(data.name);
        }

        if (!personData[0]) {
            return;
        }

        let latest = personData[personData.length - 1];

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