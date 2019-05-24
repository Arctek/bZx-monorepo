import { map } from "ramda";
import merged from "./merged";

const networksRaw = {
  local: merged,
  mainnet: merged,
  ropsten: merged,
  kovan: merged,
  rinkeby: merged
};

export const { local, mainnet, ropsten, kovan, rinkeby } = networksRaw;

const networksById = {
  1: mainnet,
  3: ropsten,
  4: rinkeby,
  42: kovan
};


export const getContracts = (networkId = null) => merged;

export const tokenList = (networkId = null) => undefined;

export const oracleList = (networkId = null) => undefined;
