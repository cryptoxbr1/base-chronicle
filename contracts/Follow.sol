// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Profiles.sol";

contract Follow is Ownable, ReentrancyGuard {
    Profiles public profilesContract;
    
    mapping(address => mapping(address => bool)) public isFollowing;
    mapping(address => address[]) public followers;
    mapping(address => address[]) public following;
    mapping(address => uint256) public followersCount;
    mapping(address => uint256) public followingCount;

    event Followed(address indexed follower, address indexed followed);
    event Unfollowed(address indexed follower, address indexed unfollowed);

    modifier onlyProfileHolder() {
        require(profilesContract.hasProfile(msg.sender), "Must have profile to follow");
        _;
    }

    modifier validTarget(address _target) {
        require(profilesContract.hasProfile(_target), "Target must have profile");
        require(_target != msg.sender, "Cannot follow yourself");
        _;
    }

    constructor(address _profilesContract) Ownable(msg.sender) {
        profilesContract = Profiles(_profilesContract);
    }

    function followUser(address _target) external onlyProfileHolder validTarget(_target) nonReentrant {
        require(!isFollowing[msg.sender][_target], "Already following this user");

        isFollowing[msg.sender][_target] = true;
        followers[_target].push(msg.sender);
        following[msg.sender].push(_target);
        
        followersCount[_target]++;
        followingCount[msg.sender]++;

        emit Followed(msg.sender, _target);
    }

    function unfollowUser(address _target) external onlyProfileHolder validTarget(_target) nonReentrant {
        require(isFollowing[msg.sender][_target], "Not following this user");

        isFollowing[msg.sender][_target] = false;
        
        // Remove from followers array
        address[] storage targetFollowers = followers[_target];
        for (uint i = 0; i < targetFollowers.length; i++) {
            if (targetFollowers[i] == msg.sender) {
                targetFollowers[i] = targetFollowers[targetFollowers.length - 1];
                targetFollowers.pop();
                break;
            }
        }
        
        // Remove from following array
        address[] storage userFollowing = following[msg.sender];
        for (uint i = 0; i < userFollowing.length; i++) {
            if (userFollowing[i] == _target) {
                userFollowing[i] = userFollowing[userFollowing.length - 1];
                userFollowing.pop();
                break;
            }
        }
        
        followersCount[_target]--;
        followingCount[msg.sender]--;

        emit Unfollowed(msg.sender, _target);
    }

    function getFollowers(address _user) external view returns (address[] memory) {
        return followers[_user];
    }

    function getFollowing(address _user) external view returns (address[] memory) {
        return following[_user];
    }

    function getFollowersCount(address _user) external view returns (uint256) {
        return followersCount[_user];
    }

    function getFollowingCount(address _user) external view returns (uint256) {
        return followingCount[_user];
    }

    function checkIsFollowing(address _follower, address _target) external view returns (bool) {
        return isFollowing[_follower][_target];
    }
}