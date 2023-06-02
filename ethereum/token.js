import web3 from "./web3";
import token from './artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';

export default (address) => {
    return new web3.eth.Contract(token.abi, address)
}
