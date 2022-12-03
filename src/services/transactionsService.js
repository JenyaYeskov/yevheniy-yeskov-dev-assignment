import postgres from "./postgres.js";

class TransactionsService {
    async deposit(transaction) {
        let {type, party, counterParty, assetType, amount} = transaction;

        let time = new Date().toLocaleString();

        return (await postgres.saveToTransactions([type, party, counterParty, assetType, amount, 0, amount, time]));
    }

    async withdraw(transaction) {

    }

    async buy(transaction) {
        let {type, party, counterParty, assetType, amount, price} = transaction;

        let total = amount * price;
        let time = new Date().toLocaleString();

        return (await postgres.saveToTransactions([type, party, counterParty, assetType, amount, price, total, time]));
    }

    async sell(transaction) {

    }
}

export default new TransactionsService();