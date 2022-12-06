import Hstore from "pg-hstore";

class DisplayData {
    displayTransactions(data) {
        let result = [];

        for (const transaction of data) {
            let {party, type, amount, assetType, price, counterParty} = transaction;

            if (type.toLowerCase().trim() === "deposit" || type.toLowerCase().trim() === "withdraw") {
                result.push(`${party} ${type} ${amount} ${counterParty} - DONE`);
            } else {
                result.push(`${party} ${type} ${amount} ${assetType} ${price} ${counterParty} - DONE`);
            }
        }
        return result;
    }

    displayLog(data) {
        if (!data) {
            return ;
        }

        let assets = "";
        let hstore = new Hstore();

        if (data.assets) {
            data.assets = hstore.parse(data.assets);

            for (let [key, value] of Object.entries(data.assets)) {
                if (value > 0) {
                    value = "+" + value;
                }
                assets += `${value} ${key}, `;
            }

            assets = " | " + assets;
            assets = assets.slice(0, -2);
        }

        return `${data.money} €${assets}`;
    }
}

export default new DisplayData();