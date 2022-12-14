import db from "../db/transactionsDb.js";
import Hstore from "pg-hstore";

let hstore = new Hstore();

class TransactionsService {
    // Processes deposit and withdraw operations.
    // Withdraw is the opposite direction of a deposit,
    // so both of them can be handled the same way,
    // and the direction defines according to the type of the transaction.
    async depositOrWithdraw(data) {
        let {type, party, counterParty, assetType, amount} = data;
        let time = new Date().toLocaleString();

        let partyData = await this.#getAccountData(party);
        let counterPartyData = await this.#getAccountData(counterParty);

        // Defining direction of the operation, and calculating changes of money amount of the account.
        if (type.toLowerCase().trim() === "deposit") {
            partyData.money = Number(partyData.money) + Number(amount);
            counterPartyData.money = Number(counterPartyData.money) - Number(amount);
        } else {
            partyData.money = Number(partyData.money) - Number(amount);
            counterPartyData.money = Number(counterPartyData.money) + Number(amount);
        }

        await this.#saveUpdatesToDb(type, party, counterParty, assetType, amount, time, partyData, counterPartyData);

        return (data);
    }

    // Updating 3 db tables (accounts, transactions, logs).
    async #saveUpdatesToDb(type, party, counterParty, assetType, amount, time, partyData, counterPartyData, price = 0, total = amount) {
        await this.#saveUpdatesToTransactions(type, party, counterParty, assetType, amount, time, price, total);
        await this.#saveUpdatesToAccounts(partyData, counterPartyData);
        await this.#saveUpdatesToLogs(party, partyData, time, counterParty, counterPartyData);
    }

    // Retrieving of the account information, or creating new account if account does not exist.
    async #getAccountData(party) {
        let data = await db.getAccountData(party);

        if (!data) {
            data = await db.createNewAccount([party, 0]);
        }
        return data;
    }

    async #saveUpdatesToTransactions(type, party, counterParty, assetType, amount, time, price, total) {
        return await db.saveToTransactions([type, party, counterParty, assetType, amount, price, total, time]);
    }

    async #saveUpdatesToLogs(party, partyData, time, counterParty, counterPartyData) {
        await db.saveToLogs([party, partyData.money, partyData.assets, time]);
        await db.saveToLogs([counterParty, counterPartyData.money, counterPartyData.assets, time]);
    }

    async #saveUpdatesToAccounts(partyData, counterPartyData) {
        await db.saveToAccounts([partyData.money, partyData.assets, partyData.accId]);
        await db.saveToAccounts([counterPartyData.money, counterPartyData.assets, counterPartyData.accId]);
    }


    //Processes buy and sell operations.
    // Buy is the opposite direction of a sell,
    // so both of them can be handled the same way,
    // and the direction defines according to the type of the transaction.
    async buyOrSell(data) {
        let {type, party, counterParty, assetType, amount, price} = data;
        let time = new Date().toLocaleString();
        let total = amount * price;

        let partyData = await this.#getAccountData(party);
        let counterPartyData = await this.#getAccountData(counterParty);

        // Defining direction of the operation, and calculating changes of money amount of the account.
        if (type.toLowerCase().trim() === "buy") {
            partyData.money = Number(partyData.money) - total;
            counterPartyData.money = Number(counterPartyData.money) + total;
        } else {
            partyData.money = Number(partyData.money) + total;
            counterPartyData.money = Number(counterPartyData.money) - total;
        }

        [partyData.assets, counterPartyData.assets] = this.#processAssetsUpdate(partyData, counterPartyData, assetType, amount, type);

        await this.#saveUpdatesToDb(type, party, counterParty, assetType, amount, time, partyData, counterPartyData, price, total);

        return (data);
    }

    // Calculation of changes in assets, that are stored in hstore format.
    #processAssetsUpdate(partyData, counterPartyData, assetType, amount, type) {
        let partyAssets = this.#getAssetsObject(partyData, assetType);
        let counterPartyAssets = this.#getAssetsObject(counterPartyData, assetType);

        // Defining direction of the operation, and calculating changes of the assets of the account.
        if (type.toLowerCase().trim() === "buy") {
            partyAssets[assetType] = Number(partyAssets[assetType]) + Number(amount);
            counterPartyAssets[assetType] = Number(counterPartyAssets[assetType]) - Number(amount);
        } else {
            partyAssets[assetType] = Number(partyAssets[assetType]) - Number(amount);
            counterPartyAssets[assetType] = Number(counterPartyAssets[assetType]) + Number(amount);
        }

        partyAssets = hstore.stringify(partyAssets);
        counterPartyAssets = hstore.stringify(counterPartyAssets);

        return [partyAssets, counterPartyAssets];
    }

    #getAssetsObject(partyData, assetType) {
        let assetsObj = {};

        if (partyData.assets) {
            assetsObj = hstore.parse(partyData.assets);
        }

        if (!assetsObj[assetType]) {
            assetsObj[assetType] = 0;
        }

        return assetsObj;
    }
}

export default new TransactionsService();