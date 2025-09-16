// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Profiles is Ownable, ReentrancyGuard {
    struct Profile {
        string username;
        string bio;
        address nftContract;
        uint256 nftTokenId;
        uint256 createdAt;
        bool exists;
    }

    mapping(address => Profile) public profiles;
    mapping(string => address) public usernameToAddress;
    mapping(address => bool) public hasProfile;

    event ProfileCreated(address indexed user, string username);
    event ProfileUpdated(address indexed user, string username, string bio);
    event AvatarUpdated(address indexed user, address nftContract, uint256 nftTokenId);

    modifier onlyProfileOwner() {
        require(hasProfile[msg.sender], "Profile does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createProfile(
        string memory _username,
        string memory _bio
    ) external nonReentrant {
        require(!hasProfile[msg.sender], "Profile already exists");
        require(bytes(_username).length > 0 && bytes(_username).length <= 32, "Invalid username length");
        require(bytes(_bio).length <= 280, "Bio too long");
        require(usernameToAddress[_username] == address(0), "Username already taken");

        profiles[msg.sender] = Profile({
            username: _username,
            bio: _bio,
            nftContract: address(0),
            nftTokenId: 0,
            createdAt: block.timestamp,
            exists: true
        });

        hasProfile[msg.sender] = true;
        usernameToAddress[_username] = msg.sender;

        emit ProfileCreated(msg.sender, _username);
    }

    function updateProfile(
        string memory _bio
    ) external onlyProfileOwner nonReentrant {
        require(bytes(_bio).length <= 280, "Bio too long");
        
        profiles[msg.sender].bio = _bio;
        
        emit ProfileUpdated(msg.sender, profiles[msg.sender].username, _bio);
    }

    function setAvatar(
        address _nftContract,
        uint256 _nftTokenId
    ) external onlyProfileOwner nonReentrant {
        require(_nftContract != address(0), "Invalid NFT contract");
        
        profiles[msg.sender].nftContract = _nftContract;
        profiles[msg.sender].nftTokenId = _nftTokenId;
        
        emit AvatarUpdated(msg.sender, _nftContract, _nftTokenId);
    }

    function getProfile(address _user) external view returns (Profile memory) {
        require(hasProfile[_user], "Profile does not exist");
        return profiles[_user];
    }

    function isUsernameAvailable(string memory _username) external view returns (bool) {
        return usernameToAddress[_username] == address(0);
    }
}