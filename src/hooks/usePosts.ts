import { useEffect, useState, useCallback } from 'react';
import { usePublicClient, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, POSTS_ABI } from '@/lib/contracts';
import { toast } from 'sonner';

export interface Post {
  id: string;
  author: string;
  username?: string;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
  reposts: number;
  isLiked?: boolean;
  avatarUrl?: string;
  txHash?: string;
}

export function usePosts() {
  const publicClient = usePublicClient();
  const { address: connected } = useAccount();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContract: writeCreatePost, data: createHash } = useWriteContract();
  const { writeContract: writeLikePost, data: likeHash } = useWriteContract();
  const { writeContract: writeUnlikePost, data: unlikeHash } = useWriteContract();

  const { isLoading: isCreating } = useWaitForTransactionReceipt({ hash: createHash });
  const { isLoading: isLiking } = useWaitForTransactionReceipt({ hash: likeHash });
  const { isLoading: isUnliking } = useWaitForTransactionReceipt({ hash: unlikeHash });

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const postsAddr = CONTRACT_ADDRESSES.Posts;
    if (!postsAddr) {
      setError('Posts contract not configured');
      setIsLoading(false);
      return;
    }

    try {
      const ids: unknown = await publicClient.readContract({
        address: postsAddr as `0x${string}`,
        abi: POSTS_ABI as unknown as any,
        functionName: 'getAllPosts',
      });

      const idsArr: unknown[] = Array.isArray(ids) ? (ids as unknown[]) : [];

      const items = await Promise.all(
        idsArr.map(async (id: unknown) => {
          const raw: unknown = await publicClient.readContract({
            address: postsAddr as `0x${string}`,
            abi: POSTS_ABI as unknown as any,
            functionName: 'getPost',
            args: [id as any],
          });

          // raw expected: [id, author, content, timestamp, likesCount, commentsCount, exists]
          const parsed: Post = {
            id: raw[0]?.toString() ?? id?.toString?.() ?? String(id),
            author: raw[1] ?? '0x0',
            content: raw[2] ?? '',
            timestamp: Number(raw[3] ?? Date.now()),
            likes: Number(raw[4] ?? 0),
            comments: Number(raw[5] ?? 0),
            reposts: 0,
          };

          // try to compute txHash if available (not always provided)
          return parsed;
        })
      );

      // sort by timestamp desc
      items.sort((a, b) => b.timestamp - a.timestamp);
      setPosts(items);
    } catch (err: any) {
      console.error('Failed to fetch posts', err);
      setError((err && err.message) || 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (content: string) => {
    const postsAddr = CONTRACT_ADDRESSES.Posts;
    if (!postsAddr) {
      toast.error('Posts contract not configured');
      return;
    }

    try {
      await writeCreatePost({
        address: postsAddr as any,
        abi: POSTS_ABI as any,
        functionName: 'createPost',
        args: [content],
      });
      toast.success('Transaction submitted');
      // wait a bit and refetch when confirmed by hook
      const wait = new Promise((res) => setTimeout(res, 1200));
      await wait;
      await fetchPosts();
    } catch (err: any) {
      console.error('createPost failed', err);
      toast.error('Failed to create post');
      throw err;
    }
  }, [writeCreatePost, fetchPosts]);

  const likePost = useCallback(async (postId: string) => {
    const postsAddr = CONTRACT_ADDRESSES.Posts;
    if (!postsAddr) {
      toast.error('Posts contract not configured');
      return;
    }

    try {
      await writeLikePost({
        address: postsAddr as any,
        abi: POSTS_ABI as any,
        functionName: 'likePost',
        args: [BigInt(postId)],
      });
      toast.success('Like tx submitted');
      await new Promise((res) => setTimeout(res, 800));
      await fetchPosts();
    } catch (err) {
      console.error('like failed', err);
      toast.error('Failed to like');
    }
  }, [writeLikePost, fetchPosts]);

  const unlikePost = useCallback(async (postId: string) => {
    const postsAddr = CONTRACT_ADDRESSES.Posts;
    if (!postsAddr) {
      toast.error('Posts contract not configured');
      return;
    }

    try {
      await writeUnlikePost({
        address: postsAddr as any,
        abi: POSTS_ABI as any,
        functionName: 'unlikePost',
        args: [BigInt(postId)],
      });
      toast.success('Unlike tx submitted');
      await new Promise((res) => setTimeout(res, 800));
      await fetchPosts();
    } catch (err) {
      console.error('unlike failed', err);
      toast.error('Failed to unlike');
    }
  }, [writeUnlikePost, fetchPosts]);

  return {
    posts,
    isLoading,
    error,
    refetch: fetchPosts,
    createPost,
    likePost,
    unlikePost,
    isCreating,
    isLiking,
    isUnliking,
  };
}
