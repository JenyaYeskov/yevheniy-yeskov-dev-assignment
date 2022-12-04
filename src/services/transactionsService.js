import db from "./postgres.js";
import Hstore from "pg-hstore";

let hstore = new Hstore();

class TransactionsService {
    async deposit(data) {
        let {type, party, counterParty, assetType, amount} = data;
        let time = new Date().toLocaleString();

        let partyData = await this.#getAccountData(party);
        let counterPartyData = await this.#getAccountData(counterParty);

        partyData.money = Number(partyData.money) + amount;
        counterPartyData.money = Number(counterPartyData.money) - amount;


        partyData = await postgres.saveToAccounts([partyData.money, partyData.assets, partyData.accId]);
        counterPartyData = await postgres.saveToAccounts([counterPartyData.money, counterPartyData.assets, counterPartyData.accId]);

        let transaction = await postgres.saveToTransactions([type, party, counterParty, assetType, amount, 0, amount, time]);

        await postgres.saveToLogs([party, partyData.money, partyData.assets, transaction.transId, time]);
        await postgres.saveToLogs([counterParty, counterPartyData.money, counterPartyData.assets, transaction.transId, time]);

        return ("done");
    }

    async #saveUpdatesToTransactions(type, party, counterParty, assetType, amount, time) {
        return await db.saveToTransactions([type, party, counterParty, assetType, amount, 0, amount, time]);
    }


    async #saveUpdatesToAccounts(partyData, counterPartyData) {
        await db.saveToAccounts([partyData.money, partyData.assets, partyData.accId]);
        await db.saveToAccounts([counterPartyData.money, counterPartyData.assets, counterPartyData.accId]);
    }

    async #getAccountData(party) {
        let data = await postgres.getAccountData(party);

        if (!data) {
            data = await postgres.createNewAccount([party, 0]);
        }
        return data;
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