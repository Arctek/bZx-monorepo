exports.loanOrderSchema = {
  id: "/loanOrder",
  properties: {
    bZxAddress: { $ref: "/addressSchema" },
    makerAddress: { $ref: "/addressSchema" },
    takerAddress: { $ref: "/addressSchema" },
    loanTokenAddress: { $ref: "/addressSchema" },
    interestTokenAddress: { $ref: "/addressSchema" },
    collateralTokenAddress: { $ref: "/addressSchema" },
    feeRecipientAddress: { $ref: "/addressSchema" },
    tradeTokenToFillAddress: { $ref: "/addressSchema" },
    oracleAddress: { $ref: "/addressSchema" },
    loanTokenAmount: { $ref: "/numberSchema" },
    interestAmount: { $ref: "/numberSchema" },
    initialMarginAmount: { $ref: "/numberSchema" },
    maintenanceMarginAmount: { $ref: "/numberSchema" },
    lenderRelayFee: { $ref: "/numberSchema" },
    traderRelayFee: { $ref: "/numberSchema" },
    maxDurationUnixTimestampSec: { $ref: "/numberSchema" },
    expirationUnixTimestampSec: { $ref: "/numberSchema" },
    makerRole: { $ref: "/numberSchema" },
    withdrawOnOpen: { $ref: "/numberSchema" },
    salt: { $ref: "/numberSchema" }
  },
  required: [
    "bZxAddress",
    "makerAddress",
    "takerAddress",
    "loanTokenAddress",
    "interestTokenAddress",
    "collateralTokenAddress",
    "feeRecipientAddress",
    "tradeTokenToFillAddress",
    "oracleAddress",
    "loanTokenAmount",
    "interestAmount",
    "initialMarginAmount",
    "maintenanceMarginAmount",
    "lenderRelayFee",
    "traderRelayFee",
    "maxDurationUnixTimestampSec",
    "expirationUnixTimestampSec",
    "makerRole",
    "withdrawOnOpen",
    "salt"
  ],
  type: "object"
};
exports.signedLoanOrderSchema = {
  id: "/signedLoanOrder",
  allOf: [
    { $ref: "/loanOrder" },
    {
      properties: {
        ecSignature: { $ref: "/hexSchema" }
      },
      required: ["ecSignature"]
    }
  ]
};
