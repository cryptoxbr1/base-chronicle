# BaseLine Smart Contracts

This directory contains the smart contracts for BaseLine, a Web3 microblogging platform on Base Mainnet.

## Contracts Overview

### 1. Profiles.sol
- Manages user profiles with username, bio, and NFT avatars
- Functions: `createProfile`, `updateProfile`, `setAvatar`
- Events: `ProfileCreated`, `ProfileUpdated`, `AvatarUpdated`

### 2. Posts.sol
- Handles post creation, likes, and comment counting
- Functions: `createPost`, `likePost`, `unlikePost`
- Events: `PostCreated`, `PostLiked`, `PostUnliked`

### 3. Comments.sol
- Manages comments on posts with likes
- Functions: `createComment`, `likeComment`, `unlikeComment`
- Events: `CommentCreated`, `CommentLiked`, `CommentUnliked`

### 4. Follow.sol
- Implements follow/unfollow functionality
- Functions: `followUser`, `unfollowUser`
- Events: `Followed`, `Unfollowed`

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Compile Contracts**
   ```bash
   npm run compile
   ```

3. **Run Tests**
   ```bash
   npm run test
   ```

4. **Deploy to Local Network**
   ```bash
   # Start local node
   npm run node
   
   # In another terminal, deploy
   npm run deploy:local
   ```

5. **Deploy to Base Sepolia (Testnet)**
   ```bash
   npm run deploy:base-sepolia
   ```

6. **Deploy to Base Mainnet**
   ```bash
   npm run deploy:base
   ```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your private key and API keys
3. Never commit the `.env` file

## Contract Addresses

After deployment, update the contract addresses in:
- `src/lib/contracts.ts`

## Security Features

- ReentrancyGuard on all state-changing functions
- Profile ownership validation
- Input validation (username length, content limits)
- Access control (only profile holders can post/comment)

## Gas Optimization

- Efficient storage patterns
- Minimal on-chain data
- Event-driven architecture for frontend updates
- Short content limits (280 chars) to reduce gas costs

## Next Steps

1. Deploy contracts to Base Sepolia testnet
2. Update frontend contract addresses
3. Test full functionality
4. Deploy to Base mainnet
5. Verify contracts on BaseScan