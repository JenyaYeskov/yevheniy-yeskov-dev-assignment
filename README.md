This is a web app, and starts with "npm start" script.

It runs on a 8888 port, and handles 2 endpoints: "/transactions", and "/logs", 
for transactions operations, and to show account state at some point of time.

It is based on 3 tables in the database (postgreSQL): 
"Transactions" - to store information about transactions.
"Accounts" - to store information about accounts
"logs" - to store information about accounts state at the time of any action with them (transaction).

The transactions have 2 types of an asset: money, and everything else. 
If an asset is money, the money amount adds or withdraws from the account. 
If anything else - assets amount multiplies at assets price, 
and total amount of money and assets adds or withdraws from the account.

The logic of the fetching daily position relies on the "logs" table. 
The app finds the last "log" to inputted timestamp, if there's any. 
This log has info about accounts belongings.