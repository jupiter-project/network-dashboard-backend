require('dotenv').config();
import axios from 'axios'

import { JUPITER_URL, GATEWAYS } from '~/config'

const apiAxios = axios.create({
  baseURL: JUPITER_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

apiAxios.interceptors.response.use((response) => {
  return response.data;
});

const sendMoney = async (params) => {
  const url = `/nxt?requestType=sendMoney&recipient=${params.receiver}&amountNQT=${params.amount}&message=${params.sender}&secretPhrase=${process.env.JUP_PASSPHRASE}&publicKey=${process.env.JUP_PUBLIC_KEY}&deadline=24&feeNQT=0`;
  return await apiAxios.post(url)
}

const getTransaction = async (transaction) => {
  return await apiAxios.get(`/nxt?requestType=getTransaction&transaction=${transaction}`)
}

export {
  sendMoney,
  getTransaction
};
