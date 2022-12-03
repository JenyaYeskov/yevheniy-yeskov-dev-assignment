class TransactionsService {
    async deposit(transaction) {
        let {type, party, counterParty, assetType, amount} = transaction;

        let time = new Date().toLocaleString();

        return (await postgres.saveToTransactions([type, party, counterParty, assetType, amount, 0, amount, time]));
    }

    async withdraw() {

    }

    async buy() {

    }

    async sell() {

    }
}

export default new TransactionsService();