#!/usr/bin/env node
import { ethers } from 'ethers';

async function main() {
  const rpc = process.env.VITE_BASE_RPC || process.env.BASE_RPC || 'https://mainnet.base.org';
  const postsAddr = process.env.VITE_BASELINE_POSTS || process.env.BASELINE_POSTS;

  console.log('Using RPC:', rpc);
  console.log('Posts contract address:', postsAddr);

  if (!postsAddr) {
    console.error('No Posts contract address provided in env VITE_BASELINE_POSTS');
    process.exit(2);
  }

  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const POSTS_ABI = [
    'function getAllPosts() view returns (uint256[])',
    'function getPost(uint256) view returns (uint256 id, address author, string content, uint256 timestamp, uint256 likesCount, uint256 commentsCount, bool exists)'
  ];

  try {
    const contract = new ethers.Contract(postsAddr, POSTS_ABI, provider);
    console.log('Calling getAllPosts...');
    const ids = await contract.getAllPosts();
    console.log('Received ids length:', ids.length);
    if (ids.length > 0) {
      const first = ids[0];
      console.log('Fetching first post id:', first.toString());
      const post = await contract.getPost(first);
      console.log('Post:', {
        id: post.id.toString(),
        author: post.author,
        content: (post.content || '').slice(0, 120),
        timestamp: post.timestamp.toString(),
        likes: (post.likesCount?.toString?.() || post[4]?.toString?.())
      });
    } else {
      console.log('No posts found on-chain (getAllPosts returned empty array).');
    }
  } catch (err) {
    console.error('On-chain checks failed:', (err && err.message) || err);
    process.exit(1);
  }
}

main();
