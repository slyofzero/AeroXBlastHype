export interface PairData {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteTokenSymbol: string;
  price: string;
  priceUsd: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  buyers: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  sellers: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  makers: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  volumeBuy: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  volumeSell: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  marketCap: number;
  pairCreatedAt: number;
  c: string;
  a: string;
}
