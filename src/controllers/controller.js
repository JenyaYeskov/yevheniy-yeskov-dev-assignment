import transactionsService from "../services/transactionsService.js";
import logsService from "../services/logsService.js";

class Controller {
    async handleTransaction(req, res) {
        let results = [];

            for (const transaction of req.body) {
                let type = transaction.type.toLowerCase().trim();

                if (type === "deposit" || type === "withdraw") {
                    results.push(await transactionsService.depositOrWithdraw(transaction));
                }

            if (type === "sell") {
                results.push(await transactionsService.sell(transaction));
            }
        }

        res.send(results);
    }

    async handleLog(req, res) {
        res.send(await logsService.getBelongings(req.body));
    }
}

export default new Controller();