// Contract addresses sourced from Vite environment variables
export const CONTRACT_ADDRESSES = {
  Profiles: import.meta.env.VITE_BASELINE_PROFILES as string | undefined,
  Posts: import.meta.env.VITE_BASELINE_POSTS as string | undefined,
  Comments: import.meta.env.VITE_BASELINE_COMMENTS as string | undefined,
  Follow: import.meta.env.VITE_BASELINE_FOLLOW as string | undefined,
} as const;

// Contract ABIs (simplified for key functions)
export const PROFILES_ABI = [
  'function createProfile(string username, string bio) external',
  'function updateProfile(string bio) external',
  'function setAvatar(address nftContract, uint256 nftTokenId) external',
  'function getProfile(address user) external view returns (tuple(string username, string bio, address nftContract, uint256 nftTokenId, uint256 createdAt, bool exists))',
  'function hasProfile(address user) external view returns (bool)',
  'function isUsernameAvailable(string username) external view returns (bool)',
  'event ProfileCreated(address indexed user, string username)',
  'event ProfileUpdated(address indexed user, string username, string bio)',
  'event AvatarUpdated(address indexed user, address nftContract, uint256 nftTokenId)'
] as const;

export const POSTS_ABI = [
  'function createPost(string content) external',
  'function likePost(uint256 postId) external',
  'function unlikePost(uint256 postId) external',
  'function getPost(uint256 postId) external view returns (tuple(uint256 id, address author, string content, uint256 timestamp, uint256 likesCount, uint256 commentsCount, bool exists))',
  'function getUserPosts(address user) external view returns (uint256[])',
  'function getAllPosts() external view returns (uint256[])',
  'function hasUserLiked(uint256 postId, address user) external view returns (bool)',
  'event PostCreated(uint256 indexed postId, address indexed author, string content, uint256 timestamp)',
  'event PostLiked(uint256 indexed postId, address indexed liker, uint256 newLikesCount)',
  'event PostUnliked(uint256 indexed postId, address indexed unliker, uint256 newLikesCount)'
] as const;

export const COMMENTS_ABI = [
  'function createComment(uint256 postId, string content) external',
  'function likeComment(uint256 commentId) external',
  'function unlikeComment(uint256 commentId) external',
  'function getComment(uint256 commentId) external view returns (tuple(uint256 id, uint256 postId, address author, string content, uint256 timestamp, uint256 likesCount, bool exists))',
  'function getPostComments(uint256 postId) external view returns (uint256[])',
  'function hasUserLikedComment(uint256 commentId, address user) external view returns (bool)',
  'event CommentCreated(uint256 indexed commentId, uint256 indexed postId, address indexed author, string content, uint256 timestamp)'
] as const;

export const FOLLOW_ABI = [
  'function followUser(address target) external',
  'function unfollowUser(address target) external',
  'function getFollowers(address user) external view returns (address[])',
  'function getFollowing(address user) external view returns (address[])',
  'function getFollowersCount(address user) external view returns (uint256)',
  'function getFollowingCount(address user) external view returns (uint256)',
  'function checkIsFollowing(address follower, address target) external view returns (bool)',
  'event Followed(address indexed follower, address indexed followed)',
  'event Unfollowed(address indexed follower, address indexed unfollowed)'
] as const;
