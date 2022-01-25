import { api } from "./api";

import { Stock } from '../types';

const getStock = async () => {
  return (await api.get('stock')).data as Stock[];
}

const getStockById = async (id: number) => {
  return (await api.get(`stock/${id}`)).data as Stock;
}

export { getStock, getStockById };
