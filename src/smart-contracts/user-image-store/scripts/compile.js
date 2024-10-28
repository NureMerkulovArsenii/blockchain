const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Read the Solidity contract
const contractPath = path.resolve(__dirname, '../contracts/UserImageStore.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// Define the input for the compiler
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

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for compilation errors
if (output.errors) {
    output.errors.forEach((err) => {
        console.error(err.formattedMessage); // Log each error
    });
    throw new Error('Compilation failed');
}

// Access the compiled contract
const contractName = 'UserImageStore';
const abi = output.contracts['UserImageStore.sol'][contractName].abi;
const bytecode = output.contracts['UserImageStore.sol'][contractName].evm.bytecode.object;

module.exports = { abi, bytecode };
