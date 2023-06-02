import web3 from "./web3";
import campaignFactory from './artifacts/contracts/BitRound.sol/BitRoundFactory.json';

const instance = new web3.eth.Contract(
    campaignFactory.abi,
    '0xCC3Fb51d32F622F6860fCa8a84e3C305B8eD1fA7'
);

export default instance;