import postgres from "./postgres.js";

class TransactionsService {
    async deposit(data) {
        let {type, party, counterParty, assetType, amount} = data;
        let time = new Date().toLocaleString();

        let partyData = await postgres.getAccountData(party);
        let counterPartyData = await postgres.getAccountData(counterParty);

        if (!partyData){
            partyData = await postgres.createNewAccount([party, 0]);
        }

        if (!counterPartyData){
            counterPartyData = await postgres.createNewAccount([counterParty, 0]);
        }

        partyData.money = Number(partyData.money) + amount;
        counterPartyData.money = Number(counterPartyData.money) - amount;


        partyData = await postgres.saveToAccounts([partyData.money, partyData.assets, partyData.accId]);
        counterPartyData = await postgres.saveToAccounts([counterPartyData.money, counterPartyData.assets, counterPartyData.accId]);

        let transaction = await postgres.saveToTransactions([type, party, counterParty, assetType, amount, 0, amount, time]);


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