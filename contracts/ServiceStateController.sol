// solium-disable linebreak-style
pragma solidity ^0.4.23;

import "./IServiceStateController.sol";
import "./RewardCalculator.sol";

contract ReviewsController is IServiceStateController, RewardCalculator {

    constructor(address RewardCalculatorAddressParam) public {
        RewardCalculatorAddress = RewardCalculatorAddressParam;
    }

    address RewardCalculatorAddress;

    function requestServices(uint32 reviewId, uint32 requestTimestamp, uint32[] serviceIdArray)  
    external returns (bool) {
        if(is_reviewId_active[reviewId] == false) {
            is_reviewId_active[reviewId] = true;
            get_serviceIdArray_from_reviewId[reviewId] = serviceIdArray;
            emit ServiceRequested(reviewId, requestTimestamp, serviceIdArray, msg.sender);
            return true;
        }
        return false;
    }

    mapping(uint32 => bool) is_reviewId_active;
    mapping(uint32 => uint32[]) get_serviceIdArray_from_reviewId;

    modifier validate_reviewId(uint32 reviewId) {
        require(is_reviewId_active[reviewId] == true);
        _;
    }

    function offerServices(uint32 reviewId, uint32 offerTimestamp, uint16 price) 
    external returns (bool){
        return;
    }

    function acceptOffer(uint32 reviewId, uint32 acceptanceTimestamp, address offererEthAddress)
    external returns (bool){
        return;
    }

    event ServiceAccepted(
        bytes32    indexed serviceRequestId,
        address indexed offeredBy,
        address indexed acceptedBy,
        string  serviceName
    );

    function claimCompletion(uint32 reviewId, uint32 claimTimestamp)
    external returns (bool){

    }

    event CompletionClaimed(
        bytes32    indexed serviceRequestId,
        address indexed claimedCompleteBy,
        string  serviceName
    );

    RewardCalculator rewardCalculator = RewardCalculator(RewardCalculatorAddress);

    function approveCompletion(uint32 reviewId, uint32 approvalTimestamp, uint8 rating, uint64 price)
    external validate_reviewId(reviewId) returns (uint RewardAmount) {
        RewardAmount = rewardCalculator.calculateRewardAmount(rating, price);        
    }

    event CompletionApproved(
        bytes32 indexed serviceRequestId,
        address indexed approvedAsCompleteBy,
        string  serviceName
    );

    function rejectCompletion(uint32 reviewId, uint32 callTimestamp)
    external returns (bool){

    }

    event CompletionRejected(
        bytes32 indexed serviceRequestId,
        address indexed rejectedAsCompleteBy,
        string  serviceName
    );
}