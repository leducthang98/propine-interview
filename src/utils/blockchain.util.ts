import axios from 'axios';
import { CRYPTOCOMPARE_APIS } from '../constants/api.constant';
import { Transaction } from '../models/transaction.model';
import { TransactionType } from '../constants/common.constant';

export async function getRandomToken(): Promise<string> {
    const response = await axios.get(CRYPTOCOMPARE_APIS.GET_ALL_TOKEN);

    const tokens = Object.keys(response.data.Data);
    const randomIndex = Math.floor(Math.random() * tokens.length);
    const randomToken = tokens[randomIndex];
    return randomToken;
}

export async function getCurrentTokensValue(tokens: string[]) {
    try {
        const res = await axios({
            url: CRYPTOCOMPARE_APIS.GET_PRICE_TOKEN,
            method: 'GET',
            params: {
                fsyms: tokens.join(','),
                tsyms: 'USD',
            },
        });
        
        return res.data

    } catch (error) {
        console.error('error getCurrentTokenValue', error);
        return null;
    }
}

export function aggregateTokens(transactions: Transaction[]): {
    [key: string]: number;
} {
    const returnValue = {};
    transactions.forEach(e => {
        if (e.transactionType === TransactionType.DEPOSIT) {
            returnValue[e.token] = (returnValue[e.token] || 0) + Number(e.amount);
        } else {
            returnValue[e.token] = (returnValue[e.token] || 0) - Number(e.amount);
        }
    });
    return returnValue;
}
