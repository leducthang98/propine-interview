# Propine interview

## 1. Language:
- typescript 

## 2. Main libs:
- fast-csv
- commander
- axios

## 3. Structure:
- constants: this folder contains constant variables and enums.
- datasource: csv file is stored in here.
- services: this folder contains main service functions of command line program.
- utils: this folder contains common functions.
- index.ts: this file is the main function of command line program.
- create-transactions.ts: this file will create an interval to auto-generate dummy transactions.

## 4. Solution:
- Use a stream to read the .csv file, which is faster when the .csv data is large (fast-csv).
- Another idea to improve read performance is to separate the data into multiple .csv files, partitioned by date. This way, when searching by date, the system won't have to search all the transactions (I had implemented this in the commit 2f8c752fa16c4188b1cc48692e7ba9763edf04ca, but I reverted it since the requirement was to store the data in a single CSV file only).

## 5. Reusable:
- Create folders for services, utils, and constants for common usage.
- The getPortfolioTokensUSD function is usable for all cases of input.

## 6. Maintainable:
- Avoid confusing lines of code.
- All functions have comments regarding their input and output.
- All separated business logic has comments to explain it.

## 7. How to start:

### 7.1. Requirement:
- node >=16.16.0

### 7.2. Steps:

```
npm install
npm run build
npm run start 
```

### 7.3. Note:
- The npm run start command can take two optional inputs: token and date. Add the token using -t and the date using -d. For example:
```
npm run start -- -t ADA -d 2023-04-06 
```
