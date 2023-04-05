import { existsSync, readdirSync } from 'fs';
import { COMMON_CONSTANT } from '../constants/common.constant';

import { Transaction } from '../models/transaction.model';
import {
  aggregateTokens,
  getCurrentTokensValue,
} from '../utils/blockchain.util';
import { readCsvFile } from '../utils/csv.util';

export async function getPortfolioTokensUSD(
  tokens?: string[],
  date?: string,
): Promise<{
  [key: string]: {
    amount: number;
    value: number;
  };
}> {
  // read csv file and get transactions
  let files = [];

  if (date) {
    if (!existsSync(`${COMMON_CONSTANT.DATA_SOURCE_PATH}/${date}.csv`)) {
      return {};
    }
    files = [`${date}.csv`];
  } else {
    files = readdirSync(COMMON_CONSTANT.DATA_SOURCE_PATH).filter(e =>
      e.includes('.csv'),
    );
  }

  const readFilePromises = files.map(e => {
    const filterCondition = row => {
      if (!tokens) return true;
      return tokens.includes(row.token);
    };
    return readCsvFile(
      `${COMMON_CONSTANT.DATA_SOURCE_PATH}/${e}`,
      filterCondition,
    );
  });

  const csvDatas = await Promise.all(readFilePromises);
  let data: Transaction[] = [];
  for (const csvData of csvDatas) {
    data = [...data, ...(csvData as Transaction[])];
  }

  const tokenAmount = aggregateTokens(data);

  if (!Object.keys(tokenAmount).length) {
    return {};
  }

  // make request and get balance of token
  const getCurrentTokenValueData = await getCurrentTokensValue(
    Object.keys(tokenAmount),
  );

  const returnValue: {
    [key: string]: {
      amount: number;
      value: number;
    };
  } = {};

  for (const key in getCurrentTokenValueData) {
    returnValue[key] = {
      amount: Number(tokenAmount[key]),
      value: Number(
        (
          Number(tokenAmount[key]) *
          Number(getCurrentTokenValueData[key]['USD'])
        ).toFixed(2),
      ),
    };
  }

  return returnValue;
}
