// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Profiles.sol";
import "./Posts.sol";

contract Comments is Ownable, ReentrancyGuard {
    struct Comment {
        uint256 id;
        uint256 postId;
        address author;
        string content;
        uint256 timestamp;
        uint256 likesCount;
        bool exists;
    }

    Profiles public profilesContract;
    Posts public postsContract;
    
    mapping(uint256 => Comment) public comments;
    mapping(uint256 => uint256[]) public postComments;
    mapping(uint256 => mapping(address => bool)) public hasLikedComment;
    
    uint256 public nextCommentId = 1;

    event CommentCreated(uint256 indexed commentId, uint256 indexed postId, address indexed author, string content, uint256 timestamp);
    event CommentLiked(uint256 indexed commentId, address indexed liker, uint256 newLikesCount);
    event CommentUnliked(uint256 indexed commentId, address indexed unliker, uint256 newLikesCount);

    modifier onlyProfileHolder() {
        require(profilesContract.hasProfile(msg.sender), "Must have profile to comment");
        _;
    }

    modifier validComment(uint256 _commentId) {
        require(comments[_commentId].exists, "Comment does not exist");
        _;
    }

    constructor(address _profilesContract, address _postsContract) Ownable(msg.sender) {
        profilesContract = Profiles(_profilesContract);
        postsContract = Posts(_postsContract);
    }

    function createComment(
        uint256 _postId,
        string memory _content
    ) external onlyProfileHolder nonReentrant {
        require(bytes(_content).length > 0 && bytes(_content).length <= 280, "Invalid content length");
        
        // Verify post exists by trying to get it
        postsContract.getPost(_postId);

        uint256 commentId = nextCommentId;
        
        comments[commentId] = Comment({
            id: commentId,
            postId: _postId,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            likesCount: 0,
            exists: true
        });

        postComments[_postId].push(commentId);
        nextCommentId++;

        // Increment comment count in Posts contract
        postsContract.incrementCommentCount(_postId);

        emit CommentCreated(commentId, _postId, msg.sender, _content, block.timestamp);
    }

    function likeComment(uint256 _commentId) external validComment(_commentId) onlyProfileHolder nonReentrant {
        require(!hasLikedComment[_commentId][msg.sender], "Already liked this comment");

        hasLikedComment[_commentId][msg.sender] = true;
        comments[_commentId].likesCount++;

        emit CommentLiked(_commentId, msg.sender, comments[_commentId].likesCount);
    }

    function unlikeComment(uint256 _commentId) external validComment(_commentId) onlyProfileHolder nonReentrant {
        require(hasLikedComment[_commentId][msg.sender], "Haven't liked this comment");

        hasLikedComment[_commentId][msg.sender] = false;
        comments[_commentId].likesCount--;

        emit CommentUnliked(_commentId, msg.sender, comments[_commentId].likesCount);
    }

    function getComment(uint256 _commentId) external view validComment(_commentId) returns (Comment memory) {
        return comments[_commentId];
    }

    function getPostComments(uint256 _postId) external view returns (uint256[] memory) {
        return postComments[_postId];
    }

    function hasUserLikedComment(uint256 _commentId, address _user) external view returns (bool) {
        return hasLikedComment[_commentId][_user];
    }
}