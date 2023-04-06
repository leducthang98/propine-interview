import axios from 'axios';
import { CRYPTOCOMPARE_APIS } from '../constants/api.constant';

// input: none, output: a random token
export async function getRandomToken(): Promise<string> {
  const response = await axios.get(CRYPTOCOMPARE_APIS.GET_ALL_TOKEN);

  const tokens = Object.keys(response.data.Data);
  const randomIndex = Math.floor(Math.random() * tokens.length);
  const randomToken = tokens[randomIndex];
  return randomToken;
}

// input: an array of tokens, output: current values of tokens
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

    return res.data;
  } catch (error) {
    console.error('error getCurrentTokenValue', error);
    return null;
  }
}
