// Contract addresses sourced from Vite environment variables
export const CONTRACT_ADDRESSES = {
  Profiles: import.meta.env.VITE_BASELINE_PROFILES as string | undefined,
  Posts: import.meta.env.VITE_BASELINE_POSTS as string | undefined,
  Comments: import.meta.env.VITE_BASELINE_COMMENTS as string | undefined,
  Follow: import.meta.env.VITE_BASELINE_FOLLOW as string | undefined,
} as const;

// ABIs provided by the user (full ABIs)
export const POSTS_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "author", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "content", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "PostCreated",
    "type": "event"
  },
  { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "liker", "type": "address" } ], "name": "PostLiked", "type": "event" },
  { "inputs": [ { "internalType": "string", "name": "content", "type": "string" } ], "name": "createPost", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "getPost", "outputs": [ { "components": [ { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "internalType": "struct Posts.Post", "name": "", "type": "tuple" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "likeCounts", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "likePost", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" } ], "name": "liked", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "posts", "outputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }
] as const;

export const PROFILES_ABI = [
  { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "string", "name": "username", "type": "string" }, { "indexed": false, "internalType": "string", "name": "bio", "type": "string" }, { "indexed": false, "internalType": "address", "name": "avatarContract", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "avatarTokenId", "type": "uint256" } ], "name": "ProfileUpdated", "type": "event" },
  { "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ], "name": "getProfile", "outputs": [ { "components": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "string", "name": "username", "type": "string" }, { "internalType": "string", "name": "bio", "type": "string" }, { "internalType": "address", "name": "avatarContract", "type": "address" }, { "internalType": "uint256", "name": "avatarTokenId", "type": "uint256" }, { "internalType": "bool", "name": "exists", "type": "bool" } ], "internalType": "struct Profiles.Profile", "name": "", "type": "tuple" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "string", "name": "username", "type": "string" }, { "internalType": "string", "name": "bio", "type": "string" }, { "internalType": "address", "name": "avatarContract", "type": "address" }, { "internalType": "uint256", "name": "avatarTokenId", "type": "uint256" } ], "name": "updateProfile", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
] as const;

export const COMMENTS_ABI = [
  { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "commentId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "author", "type": "address" }, { "indexed": false, "internalType": "string", "name": "content", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "CommentAdded", "type": "event" },
  { "inputs": [ { "internalType": "uint256", "name": "postId", "type": "uint256" }, { "internalType": "string", "name": "content", "type": "string" } ], "name": "addComment", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "comments", "outputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "postId", "type": "uint256" }, { "internalType": "address", "name": "author", "type": "address" }, { "internalType": "string", "name": "content", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "commentsByPost", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "uint256", "name": "postId", "type": "uint256" } ], "name": "getCommentsForPost", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }
] as const;

export const FOLLOW_ABI = [
  { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "follower", "type": "address" }, { "indexed": true, "internalType": "address", "name": "following", "type": "address" } ], "name": "Followed", "type": "event" },
  { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "follower", "type": "address" }, { "indexed": true, "internalType": "address", "name": "followingEvent", "type": "address" } ], "name": "Unfollowed", "type": "event" },
  { "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ], "name": "followUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "followerCount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" } ], "name": "following", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "followingCount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "follower", "type": "address" }, { "internalType": "address", "name": "user", "type": "address" } ], "name": "isFollowing", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "user", "type": "address" } ], "name": "unfollowUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
] as const;
