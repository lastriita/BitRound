// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyTestToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("LastraCoin", "LSTC") {
        _mint(msg.sender, initialSupply * 10 ** 18);
    }
}

contract BitRoundFactory {

    event BitRoundCreated(address indexed creator, address indexed bitRound, string name);
 
    function createBitRound(
        address tokenAddress,
        uint256 _minimumContribution,
        string memory name
    ) public {
        address newBitRound = address(new BitRound(tokenAddress, msg.sender, _minimumContribution));
        emit BitRoundCreated(msg.sender, newBitRound, name);
     }

    function withdrawTokens(address BitRoundAddress, uint256 index) public {
        IBitRound token = IBitRound(BitRoundAddress);
        token.finalizeRequest(index);
    }
 }

interface IBitRound {
    function startNewRound(uint256 _roundDuration) external;
    function withdrawTokens(uint256 amount) external;
    function balance() external view returns(uint256);
    function finalizeRequest(uint index) external;
}

contract BitRound is Ownable {
    IERC20 public token;
    uint256 public roundNumber;
    uint256 public roundEndTime;
    uint256 public roundDuration;
    address public manager;
    uint256 public minimumContribution;
    uint256 public totalInvestment;
    Request[] public requests;
    string public BitInfo;

    struct Request {
         string description;
         uint value;
         address recipient;
         bool complete;
         uint approvalCount;
         uint refuseCount;
         uint256 roundEndTime;
         mapping(address => bool) approvals;
     }

    struct Round {
        uint256 totalContribution;
        uint256 totalParticipants;
    }

    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => uint256)) public participants;
    mapping(address => uint256) public shareholders;

    event RoundStarted(uint256 roundNumber, uint256 startTime, uint256 endTime);
    event InvestedInBitRound(address indexed investor, address indexed bitRound, uint256 amount);

    modifier restricted() {
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    constructor(
        address tokenAddress,
        address creator,
        uint256 _minimumContribution
    ) {
        token = IERC20(tokenAddress);
        manager = creator;
        minimumContribution = _minimumContribution;
    }

    function startNewRound(uint256 _roundDuration) public restricted {
        require(roundEndTime < block.timestamp, "Previous round still ongoing");
        roundNumber++;
        roundDuration = _roundDuration;
        roundEndTime = block.timestamp + roundDuration * 1 days;
        emit RoundStarted(roundNumber, block.timestamp, roundEndTime);
    }

    function contribute(uint256 amount) public {
        require(block.timestamp < roundEndTime, "No ongoing funding round");
        require(amount >= minimumContribution, "Amount below minimum contribution");

        token.transferFrom(msg.sender, address(this), amount);
        if (participants[roundNumber][msg.sender] == 0) {
            rounds[roundNumber].totalParticipants++;
        }
        shareholders[msg.sender] += amount;
        participants[roundNumber][msg.sender] += amount;
        totalInvestment += amount;
        rounds[roundNumber].totalContribution += amount;
        emit InvestedInBitRound(msg.sender, address(this), amount);
    }

    function balance() public view returns(uint256) {
        return (token.balanceOf(address(this)));
    }

    function createRequest(string memory description, uint value, address recipient, uint256 requestDuration) public restricted {
        Request storage newRequest = requests.push(); 
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.refuseCount = 0;
        newRequest.approvalCount = 0;
        newRequest.roundEndTime = block.timestamp + requestDuration * 1 days;
    }
  
    function approveRequest(uint index, bool approve) public {
        Request storage request = requests[index];

        require(request.roundEndTime > block.timestamp, "Request has finished");
        require(shareholders[msg.sender]>0, "You are not a shareholder");
        require(!request.approvals[msg.sender], "You already vote!");

        request.approvals[msg.sender] = true;

        if(approve) {
            request.approvalCount += shareholders[msg.sender];
        } else {
            request.refuseCount += shareholders[msg.sender];
        }
    }

    function finalizeRequest(uint index) public onlyOwner {
        Request storage request = requests[index];

        require(!request.complete, "Request is already finalized");
        require(request.approvalCount > (totalInvestment / 2) ||

                (request.approvalCount > request.refuseCount) && 
                ((request.approvalCount + request.refuseCount) > (totalInvestment * 70 / 100)),
                "You need more votes!");
        
        token.transfer(request.recipient, request.value);
        request.complete = true;
    }

    function setInfo(string memory info) public restricted {
        BitInfo = info;
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, uint, address, IERC20, string memory
        ) {
        return (
            totalInvestment,
            minimumContribution,
            requests.length,
            roundEndTime,
            roundNumber,
            manager,
            token,
            BitInfo
        );
    }
}