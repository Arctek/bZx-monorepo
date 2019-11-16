

const doDeploy = true;

const fs = require('fs').promises;
const path = require("path");

let TokenizedRegistry = artifacts.require("TokenizedRegistry");

module.exports = function(deployer, network, accounts) {

  if (!doDeploy)
    return;

  network = network.replace("-fork", "");
  if (network == "development" || network == "develop" || network == "testnet" || network == "coverage") {
    network = "development";
  }

  deployer.then(async function() {

    let types = [];
    let tokens = [];
    let assets = [];
    let names = [];
    let symbols = [];

    let tokenizedRegistry = await TokenizedRegistry.deployed();

    const file = await fs.readFile("TokenizedLoans_"+network+".log");
    let lines = file.toString().split("\n");
    for(i in lines) {
      let items = lines[i].replace(/\r?\n|\r/g,"").split("\t");

      if (items.length < 5) {
        continue;
      }

      let type;
      
      if (items[0] == "LoanToken") {
        types.push("1");
        type = "1";
      }
      else if (items[0] == "PositionToken") {
        types.push("2");
        type = "2";
      }
      else {
        types.push("0");
        type = "0";
      }

      tokens.push(items[1]);
      assets.push(items[2]);
      names.push(items[3]);
      symbols.push(items[4]);

      // do sequentially instead
      try {
        await tokenizedRegistry.addTokens(
          [items[1]],
          [items[2]],
          [items[3]],
          [items[4]],
          [type]
        );
      } catch (err) {
        console.log(items[0] + ": " + items[3] + " error");
        console.log(err);
      }
    }

    
    

    console.log(`   > [${parseInt(path.basename(__filename))}] TokenizedLoans deploy: #done`);
  });
};

