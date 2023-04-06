import { existsSync, readFileSync, readdirSync } from 'fs';
import { COMMON_CONSTANT, TransactionType } from '../constants/common.constant';

import { Transaction } from '../models/transaction.model';
import { getCurrentTokensValue } from '../utils/blockchain.util';
import { readCsvFile } from '../utils/csv.util';
import moment from 'moment';

type PortfolioTokenDto = {
  [key: string]: {
    balance: number;
    exchangeRate?: number;
  };
};

export async function getPortfolioTokensUSD(
  token?: string,
  date?: string,
): Promise<PortfolioTokenDto> {
  // read csv file
  const csvData: Transaction[] = (await readCsvFile(
    COMMON_CONSTANT.DATA_SOURCE_PATH,
    row => {
      if (token && row.token !== token) {
        return false;
      }
      if (date) {
        const rowDate = moment(Number(row.timestamp) * 1000).format(
          COMMON_CONSTANT.DATE_FORMAT,
        );
        if (rowDate !== date) {
          return false;
        }
      }
      return true;
    },
  )) as Transaction[];

  // convert into map
  let transactionMap: PortfolioTokenDto = {};
  csvData.forEach(async e => {
    if (!transactionMap[e.token]) {
      transactionMap[e.token] = {
        balance: 0,
      };
    }

    transactionMap[e.token].balance =
      e.transactionType === TransactionType.DEPOSIT
        ? transactionMap[e.token].balance + Number(e.amount)
        : transactionMap[e.token].balance - Number(e.amount);
  });

  if (!Object.keys(transactionMap).length) {
    return transactionMap;
  }

  // get exchange rate
  const exchangeRateData = await getCurrentTokensValue(
    Object.keys(transactionMap),
  );

  for (const key in exchangeRateData) {
    transactionMap[key].exchangeRate = exchangeRateData[key]['USD'];
  }

  return transactionMap;
}
