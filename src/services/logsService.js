import db from "../db/logsDb.js";

class LogsService {
    async getBelongings(data) {
        let personData = await db.getPersonLogByDate(data.name, data.timestamp);

        if (!personData[0]) {
            return;
        }

        let latest = personData[personData.length - 1];

        for (const log of personData) {
            if (log.timestamp > latest.timestamp) {
                latest = log;
            }
        }

        return latest;
    }
}

export default new LogsService();