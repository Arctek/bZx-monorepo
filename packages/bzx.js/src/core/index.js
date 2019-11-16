import * as constants from "./constants";
import { schemas } from "../schemas/bZx_json_schemas";
import * as utils from "./utils";
import * as oracles from "../oracles";
import * as fill from "../fill";
import * as Addresses from "../addresses";
import * as orderHistory from "../orderHistory";
import * as signature from "../signature";
import * as Errors from "./constants/errors";
import * as trade from "../trade";
import * as loanHealth from "../loanHealth";
import * as bounty from "../bounty";

export class BZxJS {
  static generatePseudoRandomSalt = utils.generatePseudoRandomSalt;
  static noop = utils.noop;
  static toChecksumAddress = utils.toChecksumAddress;

  /* On Metamask, provider.host is undefined
  Force users to provide host url */
  constructor(web3, { networkId, addresses = Addresses.getAddresses(networkId) } = {}) {
    if (!networkId) throw new Error(Errors.NoNetworkId);

    this.web3 = web3;
    this.addresses = addresses;
    this.networkId = networkId;
    switch (networkId) {
      case 1:
        this.networkName = "mainnet";
        this.etherscanURL = "https://etherscan.io/";
        break;
      case 3:
        this.networkName = "ropsten";
        this.etherscanURL = "https://ropsten.etherscan.io/";
        break;
      case 4:
        this.networkName = "rinkeby";
        this.etherscanURL = "https://rinkeby.etherscan.io/";
        break;
      case 42:
        this.networkName = "kovan";
        this.etherscanURL = "https://kovan.etherscan.io/";
        break;
      default:
        this.networkName = "local";
        this.etherscanURL = "";
        break;
    }
  }

  static getLoanOrderHashHex(order) {
    utils.doesConformToSchema("loanOrder", order, schemas.loanOrderSchema);
    const orderHashHex = utils.getLoanOrderHashHex(order);
    return orderHashHex;
  }
  getLoanOrderHashAsync = async props =>
    utils.getLoanOrderHashAsync(this, props);

  static isValidSignature = props => signature.isValidSignature(props);

  isValidSignatureAsync = async props =>
    signature.isValidSignatureAsync(this, props);

  signOrderHashAsync = async (...props) =>
    signature.signOrderHashAsync(this, ...props);

  getOracleList = async () => oracles.getOracleList(this);
  getConversionData = async (...props) =>
    oracles.getConversionData(this, ...props);

  takeLoanOrderAsLender = (...props) =>
    fill.takeLoanOrderAsLender(this, ...props);

  takeLoanOrderAsTrader = (...props) =>
    fill.takeLoanOrderAsTrader(this, ...props);

  getInitialCollateralRequired = async (...props) =>
    fill.getInitialCollateralRequired(this, ...props);

  getSingleOrder = async (...props) =>
    orderHistory.getSingleOrder(this, ...props);
  getOrdersForUser = async (...props) =>
    orderHistory.getOrdersForUser(this, ...props);
  getSingleLoan = async (...props) =>
    orderHistory.getSingleLoan(this, ...props);
  getLoansForLender = async (...props) =>
    orderHistory.getLoansForLender(this, ...props);
  getLoansForTrader = async (...props) =>
    orderHistory.getLoansForTrader(this, ...props);

  tradePositionWith0xV2 = (...props) => trade.tradePositionWith0xV2(this, ...props);
  tradePositionWithOracle = (...props) =>
    trade.tradePositionWithOracle(this, ...props);

  depositCollateral = (...props) => loanHealth.depositCollateral(this, ...props);
  withdrawCollateral = (...props) => loanHealth.withdrawCollateral(this, ...props);
  changeCollateral = (...props) => loanHealth.changeCollateral(this, ...props);
  withdrawPosition = (...props) => loanHealth.withdrawPosition(this, ...props);
  depositPosition = (...props) => loanHealth.depositPosition(this, ...props);
  getPositionOffset = (...props) => loanHealth.getPositionOffset(this, ...props);

  closeLoan = (...props) => loanHealth.closeLoan(this, ...props);

  getLenderInterestForOrder = (...props) => loanHealth.getLenderInterestForOrder(this, ...props);
  payInterestForOracle = (...props) => loanHealth.payInterestForOracle(this, ...props);
  getLenderInterestForOracle = (...props) => loanHealth.getLenderInterestForOracle(this, ...props);
  getTraderInterestForLoan = (...props) => loanHealth.getTraderInterestForLoan(this, ...props);

  payInterestForOrder = (...props) => loanHealth.payInterestForOrder(this, ...props);
  getMarginLevels = (...props) => bounty.getMarginLevels(this, ...props);
  liquidateLoan = (...props) => bounty.liquidateLoan(this, ...props);
}

export default BZxJS;
