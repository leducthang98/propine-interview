import { readdirSync } from 'fs';
import { COMMON_CONSTANT } from '../constants/common.constant';

import { Transaction } from '../models/transaction.model';
import {
  aggregateTokens,
  getCurrentTokenValue,
} from '../utils/blockchain.util';
import { readCsvFile } from '../utils/csv.util';

export async function getPortfolioTokensUSD(): Promise<{
  [key: string]: number;
}> {
  // read all csv files and get token
  const files = readdirSync(COMMON_CONSTANT.DATA_SOURCE_PATH).filter(e =>
    e.includes('.csv'),
  );
  const readFilePromises = files.map(e => {
    return readCsvFile(`${COMMON_CONSTANT.DATA_SOURCE_PATH}/${e}`);
  });

  const csvDatas = await Promise.all(readFilePromises);

  let data: Transaction[] = [];
  for (const csvData of csvDatas) {
    data = [...data, ...(csvData as Transaction[])];
  }

  const tokenAmount = aggregateTokens(data);

  // make request and get balance of token
  let getBalanceTokenPromises = [];
  for (const key in tokenAmount) {
    getBalanceTokenPromises.push(getCurrentTokenValue(key));
  }

  const getBalanceTokenDatas = await Promise.all(getBalanceTokenPromises);

  const returnValue: {
    [key: string]: number;
  } = {};

  getBalanceTokenDatas.forEach(e => {
    returnValue[e.token] = Number(
      (Number(tokenAmount[e.token]) * e.data['USD']).toFixed(2),
    );
  });

  return returnValue;
}
