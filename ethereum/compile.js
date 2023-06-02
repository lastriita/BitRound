const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "BitRound.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const input = {
    language: "Solidity",
    sources: {
        "BitRound.sol": {
            content: source,
        },
    },
    settings: {
    outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};

console.log(JSON.parse(solc.compile(JSON.stringify(input))))
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['BitRound.sol'];

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        output[contract]
    );
}