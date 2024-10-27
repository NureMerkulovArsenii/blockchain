const fs = require('fs');
const solc = require('solc');

const source = fs.readFileSync('./../contracts/UserImageStore.sol', 'utf8');
const input = {
    language: 'Solidity',
    sources: {
        'UserImageStore.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const contractName = 'UserImageStore';
const abi = output.contracts['UserImageStore.sol'][contractName].abi;
const bytecode = output.contracts['UserImageStore.sol'][contractName].evm.bytecode.object;

module.exports = { abi, bytecode };
