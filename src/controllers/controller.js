import transactionsService from "../services/transactionsService.js";

class Controller {
    async handleTransaction(req, res) {
        res.send(await transactionsService.deposit());
    }
}
export default new Controller();