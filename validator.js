const { Web3 } = require('web3');
const axios = require('axios');

// Replace with your JSON-RPC endpoint
const JSON_RPC_ENDPOINT = 'http://10.102.196.103:8545';

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(JSON_RPC_ENDPOINT));

// Function to add a validator
async function addValidator(address) {
    try {
        const response = await axios.post(JSON_RPC_ENDPOINT, {
            jsonrpc: "2.0",
            method: "ibft_proposeValidatorVote",
            params: [address, true],
            id: 1
        });
        if (response.data && response.data.result) {
            console.log(`Validator ${address} added successfully!`);
        } else {
            console.error("Failed to add validator:", response.data);
        }
    } catch (error) {
        console.error("Error adding validator:", error.message);
    }
}
// Function to remove a validator
async function removeValidator(address) {
    try {
        const response = await axios.post(JSON_RPC_ENDPOINT, {
            jsonrpc: "2.0",
            method: "ibft_proposeValidatorVote",
            params: [address, false],
            id: 1
        });
        if (response.data && response.data.result) {
            console.log(`Validator ${address} removed successfully!`);
        } else {
            console.error("Failed to remove validator:", response.data);
        }
    } catch (error) {
        console.error("Error removing validator:", error.message);
    }
}
// Function to check the current list of validators
async function checkValidators() {
    try {
        const response = await axios.post(JSON_RPC_ENDPOINT, {
            jsonrpc: "2.0",
            method: "ibft_getValidatorsByBlockNumber",
            params: ["latest"],
            id: 1
        });
        if (response.data && response.data.result) {
            console.log("Current Validators:", response.data.result);
        } else {
            console.error("Invalid response from server:", response.data);
        }
    } catch (error) {
        console.error("Error checking validators:", error.message);
    }
}
// Main function to parse arguments and execute the appropriate action
async function main() {
    const args = process.argv.slice(2);
    const method = args[0]; // Method: add, remove, check
    const address = args[1]; // Node address (optional for check)

    if (!method || (method !== 'check' && !address)) {
        console.error("Usage: node script.js <method> [<address>]");
        console.error("Methods: add <address>, remove <address>, check");
        process.exit(1);
    }

    if (method === 'add') {
        await addValidator(address);
    } else if (method === 'remove') {
        await removeValidator(address);
    } else if (method === 'check') {
        await checkValidators();
    } else {
        console.error("Invalid method. Use 'add', 'remove', or 'check'.");
    }
}

main();
