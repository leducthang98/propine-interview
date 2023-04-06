import moment from 'moment';
import fs from 'fs';
import { COMMON_CONSTANT, TransactionType } from './constants/common.constant';

// input: none, output: create an interval to generate random transaction into data.csv
export function createTransactionInterval() {
  const CREATE_TRANSACTION_INTERVAL_SECOND = 1;
  setInterval(createTransaction, CREATE_TRANSACTION_INTERVAL_SECOND * 1000);
}

// input: start and end, output: a random number in range
function getRandomNumber(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

// input: none, output: write a random transaction into data.csv
async function createTransaction() {
  // call to blockchain, generate random transaction
  const tokens = ['ADA', 'BTC', 'ETH', 'CEEK']; // dummy transactions to generate, can use getRandomToken() instead.
  const currentTimestampSecond: number = moment().unix();

  const transactionType: TransactionType = TransactionType.DEPOSIT;
  const amount: number = getRandomNumber(100, 1000);
  const token = tokens[getRandomNumber(0, 3)];

  // write to .csv
  if (!fs.existsSync(COMMON_CONSTANT.DATA_SOURCE_PATH)) {
    fs.writeFileSync(
      COMMON_CONSTANT.DATA_SOURCE_PATH,
      `timestamp,transactionType,token,amount\n`,
    );
  }

  fs.appendFileSync(
    COMMON_CONSTANT.DATA_SOURCE_PATH,
    `${currentTimestampSecond},${transactionType},${token},${amount}\n`,
  );
}

createTransactionInterval();
