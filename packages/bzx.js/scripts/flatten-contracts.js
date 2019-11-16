const fs = require('fs');
const Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);

let contracts = {};


fs.readdirAsync("../src/contracts/mainnet")
    .then(files => {
        files.forEach(file => {
            if (file.indexOf("json") == -1) {
                return;
            }

            //Only need these 3
            /*if (file.indexOf("BZx.json") == -1 && file.indexOf("OracleRegistry.json") == -1 && file.indexOf("OracleInterface.json") == -1 && file.indexOf("BZxVault.json") == -1 && file.indexOf("BZRxToken.json") == -1 && file.indexOf("BZRxTokenConvert.json") == -1) {
                return;
            }*/

            let contract = require("../src/contracts/mainnet/" + file);
//console.log(contract)
            contract["addresses"] = {
                1: contract.address.toLowerCase()
            };

            delete contract.address;

            contracts[file] = contract;
        })
    })
    .then(() => {
        let chain = [];

        [["kovan", 42], ["rinkeby", 4], ["ropsten", 3]].forEach(network => {
            chain.push(
                fs.readdirAsync("../src/contracts/" + network[0])
                    .then(files => {
                        files.forEach(file => {
                            if (file.indexOf("json") == -1) {
                                return;
                            }

                            /*if (file.indexOf("BZx.json") == -1 && file.indexOf("OracleRegistry.json") == -1 && file.indexOf("OracleInterface.json") == -1 && file.indexOf("BZxVault.json") == -1 && file.indexOf("BZRxToken.json") == -1 && file.indexOf("BZRxTokenConvert.json") == -1) {
                                return;
                            }*/

                            let contract = require("../src/contracts/" + network[0] + "/" + file);

                            if (!(file in contracts)) {
                                contract["addresses"] = {
                                    [network[1]]: contract.address.toLowerCase()
                                };


                                delete contract.address;

                                contracts[file] = contract;
                            }
                            else {

                                contracts[file]["addresses"][network[1]] = contract.address.toLowerCase();
                            }
                        })
                    })
            );
        });

        return Promise.all(chain);
    })
    .then(() => 
        // local network
        fs.readdirAsync("../../contracts/test_network/deployed")
            .then(files => {
                files.forEach(file => {
                    if (file.indexOf("json") == -1) {
                        return;
                    }

                    /*if (file.indexOf("BZx.json") == -1 && file.indexOf("OracleRegistry.json") == -1 && file.indexOf("OracleInterface.json") == -1 && file.indexOf("BZxVault.json") == -1 && file.indexOf("BZRxToken.json") == -1 && file.indexOf("BZRxTokenConvert.json") == -1) {
                        return;
                    }*/

                    let contract = require("../../contracts/test_network/deployed/" + file);

                    if (!(file in contracts)) {
                        contract["addresses"] = {
                            50: contract.address.toLowerCase()
                        };


                        delete contract.address;

                        contracts[file] = contract;
                    }
                    else {

                        contracts[file]["addresses"][50] = contract.address.toLowerCase();
                    }
                })
            })
    )
    .then(() => {
        Object.keys(contracts).forEach(file => {

            if (file == "TokenizedRegistry.json") {
                // hard code for now
                contracts[file]["addresses"] = {
                    ...contracts[file]["addresses"],
                    1: "0xd8dc30d298ccf40042991cb4b96a540d8affe73a",
                    3: "0xaa5c713387972841995553c9690459596336800b",
                    42: "0x730df5c1e0a4b6ba7a982a585c1ec55187fbb3ca"
                };
            }

            let data = contracts[file];
            let newData = [];

            for (let i = 0, len = data.abi.length; i < len; i++) {
                if (data.abi[i].type == "event") {
                    continue;
                }

                newData.push(data.abi[i]);
            }

            newData = { ...data, abi: newData };

            // Only need addresses here
            if (file.indexOf("BZxVault.json") > -1 || file.indexOf("BZRxToken.json") > -1 || file.indexOf("BZRxTokenConvert.json") > -1) {
                newData.abi = [];
            }

            let jsonOutput = JSON.stringify(newData);

            /*jsonOutput = jsonOutput.replace(/\"payable\"\:false\,/g, "");
            jsonOutput = jsonOutput.replace(/\"stateMutability\"\:view\,/g, "");
            jsonOutput = jsonOutput.replace(/\"stateMutability\"\:pure\,/g, "");
            jsonOutput = jsonOutput.replace(/\"stateMutability\"\:nonpayable\,/g, "");
            //jsonOutput = jsonOutput.replace(/\:true/g, ":!0");*/

            fs.writeFileSync("../src/contracts/merged/" + file, jsonOutput, 'utf8');
        })
    });