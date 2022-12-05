import transactionsService from "../services/transactionsService.js";
import logsService from "../services/logsService.js";
import ApiError from "../Errors/apiError.js";

class Controller {
    async handleTransaction(req, res, next) {
        try {
            let results = [];

            for (const transaction of req.body) {
                let type = transaction.type.toLowerCase().trim();

                if (type === "deposit" || type === "withdraw") {
                    results.push(await transactionsService.depositOrWithdraw(transaction));
                    continue;
                }

                if (type === "buy" || type === "sell") {
                    results.push(await transactionsService.buyOrSell(transaction));
                    continue;
                }

                throw new ApiError(400, `Wrong input. There is no ${type} transaction`);
            }

            res.send(results);
        } catch (err) {
            next(err);
        }
    }

    async handleLog(req, res, next) {
        try {
            res.send(await logsService.getBelongings(req.body));
        } catch (err) {
            next(err);
        }
    }
}

export default new Controller();