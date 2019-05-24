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
            fs.writeFileSync("../src/contracts/merged/" + file, JSON.stringify(contracts[file]), 'utf8');
        })
    });