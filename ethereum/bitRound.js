import web3 from "./web3";
import bitRound from './artifacts/contracts/BitRound.sol/BitRound.json';

export default (address) => {
    return new web3.eth.Contract(bitRound.abi, address)
}
