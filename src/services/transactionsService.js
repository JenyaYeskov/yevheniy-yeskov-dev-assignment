import postgres from "./postgres.js";

class TransactionsService {
    async deposit(transaction) {
        let {type, party, counterParty, assetType, amount} = transaction;

        let time = new Date().toLocaleString();

        let partyData = await postgres.getAccountData(party);
        let counterPartyData = await postgres.getAccountData(counterParty);

        if (!partyData){
            partyData = await postgres.createNewAccount([party, 0]);
        }

        if (!counterPartyData){
            counterPartyData = await postgres.createNewAccount([counterParty, 0]);
        }


        return ("done");
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