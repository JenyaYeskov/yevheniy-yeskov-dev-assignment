import db from "./postgres.js";
import Hstore from "pg-hstore";

let hstore = new Hstore();

class LogsService {
    async getBelongings(data) {
        let result = await db.getPersonLogByDate(data.name, data.timestamp);

        if (!result[0]) {
            return;
        }

        let latest = result[result.length - 1];

        for (const log of result) {
            if (log.timestamp > latest.timestamp) {
                latest = log.timestamp;
            }
        }

        let assets = "";

        if (latest.assets) {
            latest.assets = hstore.parse(latest.assets);

            for (let [key, value] of Object.entries(latest.assets)) {
                if (value > 0) {
                    value = "+" + value;
                }
                assets += `${value} ${key}, `;
            }

            assets = " | " + assets;
            assets = assets.slice(0, -2);
        }


        return `${latest.money} €${assets}`;
    }
}

export default new LogsService();