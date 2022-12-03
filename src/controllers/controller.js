import transactionsService from "../services/transactionsService.js";

class Controller {
    async handleTransaction(req, res) {
        for (const transaction of req.body) {
            let type = transaction.type.toLowerCase().trim()

            if (type === "deposit") {
                res.send(await transactionsService.deposit())
            }

            if (type === "withdraw") {
                res.send(await transactionsService.withdraw())
            }

            if (type === "buy") {
                res.send(await transactionsService.buy())
            }

            if (type === "sell") {
                res.send(await transactionsService.sell())
            }

            res.send("error")
        }
    }
}

export default new Controller();