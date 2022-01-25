import { api } from "./api";

import { Product } from '../types';

const getProducts = async () => {
  return (await api.get('products')).data as Product[];
}

const getProductById = async (id: number) => {
  return (await api.get(`products/${id}`)).data as Product;
}

export { getProducts, getProductById };
