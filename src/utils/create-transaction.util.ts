import moment from 'moment';
import fs from 'fs';
import { COMMON_CONSTANT, TransactionType } from '../constants/common.constant';

export function createTransactionInterval() {
  const CREATE_TRANSACTION_INTERVAL_SECOND = 10;
  setInterval(createTransaction, CREATE_TRANSACTION_INTERVAL_SECOND * 1000);
}

function getRandomNumber(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

async function createTransaction() {
  // call to blockchain, generate random transaction
  const tokens = ['ADA', 'BTC', 'ETH', 'CEEK']; // dummy transactions to generate, can use getRandomToken instead.
  const currentTimestampSecond: number = moment().unix();
  const currentDate: string = moment(currentTimestampSecond * 1000).format(
    COMMON_CONSTANT.DATE_FORMAT,
  );
  const filePath = `${COMMON_CONSTANT.DATA_SOURCE_PATH}/${currentDate}.csv`;
  const transactionType: TransactionType = TransactionType.DEPOSIT;
  const amount: number = getRandomNumber(100, 1000);
  const token = tokens[getRandomNumber(0, 3)];

  // write to .csv
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `timestamp,transactionType,token,amount\n`);
  }

  fs.appendFileSync(
    filePath,
    `${currentTimestampSecond},${transactionType},${token},${amount}\n`,
  );
}
