import transactionsService from "../services/transactionsService.js";

class Controller {
    async handleTransaction(req, res) {
        let results = [];

        for (const transaction of req.body) {
            let type = transaction.type.toLowerCase().trim();

            if (type === "deposit") {
                results.push(await transactionsService.deposit(transaction));
            }

            if (type === "withdraw") {
                results.push(await transactionsService.withdraw(transaction));
            }

            if (type === "buy") {
                results.push(await transactionsService.buy(transaction));
            }

            if (type === "sell") {
                results.push(await transactionsService.sell(transaction));
            }
        }

        res.send(results);
    }
}

export default new Controller();