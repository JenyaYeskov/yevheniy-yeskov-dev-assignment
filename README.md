# Introduction

This assignment has two parts:

* **Part One:** We need you to build a working solution on Node.js
* **Part two:** Please elaborate on some points. We want to know how you think more than getting the "right" answer.

## Why a developer Assignment
Blanco wants to hire experienced, innovative, passionate and creative developers. To keep the quality of our developers at a high level we ask every candidate to execute a developer assignment to test skills, coding quality, creativity, self-starting capabilities and resourcefulness.

## Deadline
Though it would take less time to complete this, considering the fact this would be done across multiple partial days we expect you to provide a working solution in a week's time. We think this is enough time to complete the assignment, but feel free to contact us if you think it's not enough.

## Technical requirements
* Use a relational database for storage (you can choose any Vendor you like).
* We need **node.js** for the runtime.
* You can use AWS Lambda, but it's optional.
* Infrastructure as Code is optional.

## Expected deliverables
* A working solution.
* A Pull request of your implementation.
* A README file describing how to deploy your solution.
* A postman collection to test your solution.

# Dev Assignment

We want to build a simple bookkeeping service. The service will provide functionality to record a list of transactions and then query the recorded data for useful information.

## Part One

### Domain Model

A **Transaction** represents a movement of an **Asset** between two entities on a specific **Transaction Date** (timestamp).

We refer to the first entity as **Party** and to the second entity as **CounterParty**.

An ***Asset*** can be anything of value: a stock, a car, a house etc.

A ***Transaction*** can be one of 4 types:

* **DEPOSIT**: _Party_ deposits a Euro amount to _CounterParty_
* **WITHDRAWAL**: The opposite direction of a **DEPOSIT**.
* **BUY**: _Party_ buys an _Asset_ from _CounterParty_ in exchange for the value of the _Asset_ in Euros.
* **SELL**: Opposite direction of a **BUY**.

**Examples:**

- `Person-A DEPOSIT 200 Person-B`

Person-A Has deposited €200 to Person-B. So Person-A has `+€200` (He lent money to Person-B) and Person-B has `-€200` (He owes Person-A money).

Explanation: “In this example, Person-A has sold a Loan product worth 200 to Person-B. So, Person-B is liable to pay 200 back to Person-A eventually, and the ownership of the said 200 lies with Person-A.
In other words, Person-A is the seller of the Loan Product, while Person-B is the buyer of it. As always, buyer pays the seller”

- `Person-A WITHDRAW 200 Person-B`

Person-A Has withdrew €200 from Person-B. So Person-A has `-€200` (He owes Person-B money) and Person-B has `+€200` (He lent money to Person-A).

- `Person-A BUY 3 APPL 100 Person-B`

Person-A buys 3 shares of stock APPL from Person-B at a price of €100 a share, i.e. €300 in total. Person-A has `-€300` and `+3 APPL` while Person-B has `+€300` and `-3 APPL`.

- `Person-A SELL 2 APPL 120 Person-B`

Person-A sells 2 shares of stock APPL to Person-B at a price of €120 a share, i.e. €240 in total. Person-A has `+€240` and `-2 APPL` while Person-B has `-€240` and `+2 APPL`.

### Desired Functionality via REST API

#### Request-1: Recording New Transactions

To create one or multiple transactions. Data will be passed into the body of the request. 

The transactions contained in the request should be persisted to DB (Use a relational database).

To keep things simple for you, we guarantee you the following:

* The request will never contain a duplicate transaction.
* The request you'll receive will always be valid and contain correct data.
* The request is small. The body has 10 transactions MAX.
* Although the number of records in the input is small, remember that the number in DB might be huge. It will be interesting to see how you keep the functionality of getting the daily positions (mentioned below) scalable.


#### Request-2: Fetch Daily Positions
We want to know what an entity owns (or owes) on a specific date. You will receive 2 inputs: an entity and a date. The output should be the aggregated result of all then entity's transactions leading up to the date received in the input.

For more clarification, consider that these are the only transactions we have recorded in our system:

```
2019-11-01 Person-A Deposits €200 to Person-B
2019-11-02 at 09:00 Person-A Deposits €500 to Person-B
2019-11-02 at 14:00 Person-A Deposits €300 to Person-B
2019-11-04 Person-A Buys 3 shares of APPL at €100 a share from Person-B
2019-11-06 Person-A Buys 1 share of APPL at €150 a share from Person-B
2019-11-07 Person-A Buys 5 share of APPL at €110 a share from Person-B
```

The following table demonstrates the expected outputs for possible input combinations:

| Date ↓  \ entities →| Person-A            | Person-B            |
| ------------------- | -------------------:| -------------------:|
| 2019-10-31 |                     |                     |
| 2019-11-01 | +€200               | -€200               |
| 2019-11-02 | +€1000              | -€1000              |
| 2019-11-03 | +€1000              | -€1000              |
| 2019-11-04 | [ +€700 ❘ +3 APPL ] | [ -€700 ❘ -3 APPL ] |
| 2019-11-05 | [ +€700 ❘ +3 APPL ] | [ -€700 ❘ -3 APPL ] |
| 2019-11-06 | [ +€550 ❘ +4 APPL ] | [ -€550 ❘ -4 APPL ] |
| 2019-11-07 | +9 APPL             | -9 APPL             |
| ...        |                     |                     |
| 2019-11-29 | +9 APPL             | -9 APPL             |

For example, for input `2019-10-31`, `Person-A` the output would be an empty result since there are no transactions recorded for `Person-A` before `2019-11-01`. For input `2019-11-07`, `Person-B` the output would tell us that `Person-B` had `-9` shares of `APPL`.

## Part two

### NoSQL databases
If you are free to choose a NoSQL database instead of a relational one, which would you choose, and which stracture it would look like (keys, indexes etc.)?

### Scalability
You were guaranteed that each request have a small number of transactions. What could be a solution if it need to be able to work with bigger amount? say 50k transactions per time for example.

### Rate your implementation
How satisfied are you with your implementation? Would you change anything if you had extra time? what would you change and why?