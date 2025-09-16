// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Profiles.sol";

contract Posts is Ownable, ReentrancyGuard {
    struct Post {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likesCount;
        uint256 commentsCount;
        bool exists;
    }

    Profiles public profilesContract;
    
    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    mapping(address => uint256[]) public userPosts;
    
    uint256 public nextPostId = 1;
    uint256[] public allPostIds;

    event PostCreated(uint256 indexed postId, address indexed author, string content, uint256 timestamp);
    event PostLiked(uint256 indexed postId, address indexed liker, uint256 newLikesCount);
    event PostUnliked(uint256 indexed postId, address indexed unliker, uint256 newLikesCount);

    modifier onlyProfileHolder() {
        require(profilesContract.hasProfile(msg.sender), "Must have profile to post");
        _;
    }

    modifier validPost(uint256 _postId) {
        require(posts[_postId].exists, "Post does not exist");
        _;
    }

    constructor(address _profilesContract) Ownable(msg.sender) {
        profilesContract = Profiles(_profilesContract);
    }

    function createPost(string memory _content) external onlyProfileHolder nonReentrant {
        require(bytes(_content).length > 0 && bytes(_content).length <= 280, "Invalid content length");

        uint256 postId = nextPostId;
        
        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            likesCount: 0,
            commentsCount: 0,
            exists: true
        });

        userPosts[msg.sender].push(postId);
        allPostIds.push(postId);
        nextPostId++;

        emit PostCreated(postId, msg.sender, _content, block.timestamp);
    }

    function likePost(uint256 _postId) external validPost(_postId) onlyProfileHolder nonReentrant {
        require(!hasLiked[_postId][msg.sender], "Already liked this post");

        hasLiked[_postId][msg.sender] = true;
        posts[_postId].likesCount++;

        emit PostLiked(_postId, msg.sender, posts[_postId].likesCount);
    }

    function unlikePost(uint256 _postId) external validPost(_postId) onlyProfileHolder nonReentrant {
        require(hasLiked[_postId][msg.sender], "Haven't liked this post");

        hasLiked[_postId][msg.sender] = false;
        posts[_postId].likesCount--;

        emit PostUnliked(_postId, msg.sender, posts[_postId].likesCount);
    }

    function incrementCommentCount(uint256 _postId) external validPost(_postId) {
        posts[_postId].commentsCount++;
    }

    function getPost(uint256 _postId) external view validPost(_postId) returns (Post memory) {
        return posts[_postId];
    }

    function getUserPosts(address _user) external view returns (uint256[] memory) {
        return userPosts[_user];
    }

    function getAllPosts() external view returns (uint256[] memory) {
        return allPostIds;
    }

    function getPostsCount() external view returns (uint256) {
        return allPostIds.length;
    }

    function hasUserLiked(uint256 _postId, address _user) external view returns (bool) {
        return hasLiked[_postId][_user];
    }
}