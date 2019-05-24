import { map, pipe } from "ramda";
import { getContracts } from "../contracts";

export const getAddresses = networkId =>
  pipe(
    getContracts,
    (raw) => pipe(
        map(contract => contract.addresses[networkId]),
        map(address => address ? address.toLowerCase() : "")
    )(raw)
  )(networkId);
