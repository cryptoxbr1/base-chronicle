import { useEffect, useState, useCallback } from 'react';
import { usePublicClient, useAccount, useWriteContract, useWaitForTransactionReceipt, useConnect } from 'wagmi';
import type { Abi } from 'abitype';
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

const MOCK_POSTS: Post[] = [
  {
    id: 'mock-1',
    author: '0xmock...1',
    content: 'Welcome to BaseLine! This is a demo post.',
    timestamp: Date.now() - 1000 * 60 * 5,
    likes: 5,
    comments: 1,
    reposts: 0,
  },
  {
    id: 'mock-2',
    author: '0xmock...2',
    content: 'This platform is running in demo mode — on-chain contract calls failed.',
    timestamp: Date.now() - 1000 * 60 * 60,
    likes: 12,
    comments: 3,
    reposts: 1,
  },
];

export function usePosts() {
  const publicClient = usePublicClient();
  const { address: connected } = useAccount();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  const { writeContract: writeCreatePost, data: createHash } = useWriteContract();
  const { writeContract: writeLikePost, data: likeHash } = useWriteContract();
  const { writeContract: writeUnlikePost, data: unlikeHash } = useWriteContract();

  const { connectors, connect } = useConnect();

  const { isLoading: isCreating } = useWaitForTransactionReceipt({ hash: createHash });
  const { isLoading: isLiking } = useWaitForTransactionReceipt({ hash: likeHash });
  const { isLoading: isUnliking } = useWaitForTransactionReceipt({ hash: unlikeHash });

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const postsAddr = CONTRACT_ADDRESSES.Posts;
    if (!postsAddr) {
      // Posts contract not configured — switch to demo/mock mode so users can still create posts locally
      setUseMock(true);
      setPosts(MOCK_POSTS);
      setError('Posts contract not configured — running in demo mode');
      setIsLoading(false);
      return;
    }

    try {
      // Try to use getAllPosts if available
      let items: Post[] = [];
      try {
        const ids: unknown = await publicClient.readContract({
          address: postsAddr as `0x${string}`,
          abi: POSTS_ABI as unknown as Abi,
          functionName: 'getAllPosts',
        });

        const idsArr: unknown[] = Array.isArray(ids) ? (ids as unknown[]) : [];

        items = await Promise.all(
          idsArr.map(async (id: unknown) => {
            const raw: unknown = await publicClient.readContract({
              address: postsAddr as `0x${string}`,
              abi: POSTS_ABI as unknown as Abi,
              functionName: 'getPost',
              args: [id as unknown],
            });

            const arr = raw as unknown as [
              bigint | number | string,
              string,
              string,
              bigint | number
            ];

            const parsed: Post = {
              id: arr[0]?.toString?.() ?? String(id),
              author: arr[1] ?? '0x0',
              content: arr[2] ?? '',
              timestamp: Number(arr[3] ?? Date.now()),
              likes: 0,
              comments: 0,
              reposts: 0,
            };

            // try to read likeCounts if available
            try {
              const likeRes: unknown = await publicClient.readContract({
                address: postsAddr as `0x${string}`,
                abi: POSTS_ABI as unknown as Abi,
                functionName: 'likeCounts',
                args: [BigInt(parsed.id)],
              });
              parsed.likes = Number(likeRes ?? 0);
            } catch {
              // ignore
            }

            return parsed;
          })
        );
      } catch (errGetAll) {
        // getAllPosts not available — fallback to sequential posts(index)
        const collected: Post[] = [];
        const maxScan = 200; // limit
        for (let i = 0; i < maxScan; i++) {
          try {
            const raw: unknown = await publicClient.readContract({
              address: postsAddr as `0x${string}`,
              abi: POSTS_ABI as unknown as Abi,
              functionName: 'posts',
              args: [BigInt(i)],
            });

            const arr = raw as unknown as [
              bigint | number | string,
              string,
              string,
              bigint | number
            ];

            // if id is falsy and i>0 assume end
            const idVal = Number(arr[0] ?? 0);
            if (!idVal) break;

            const parsed: Post = {
              id: arr[0]?.toString?.() ?? String(i),
              author: arr[1] ?? '0x0',
              content: arr[2] ?? '',
              timestamp: Number(arr[3] ?? Date.now()),
              likes: 0,
              comments: 0,
              reposts: 0,
            };

            try {
              const likeRes: unknown = await publicClient.readContract({
                address: postsAddr as `0x${string}`,
                abi: POSTS_ABI as unknown as Abi,
                functionName: 'likeCounts',
                args: [BigInt(i)],
              });
              parsed.likes = Number(likeRes ?? 0);
            } catch {
              // ignore
            }

            collected.push(parsed);
          } catch (innerErr) {
            // stop scanning on errors
            break;
          }
        }
        items = collected;
      }

      // sort by timestamp desc
      items.sort((a, b) => b.timestamp - a.timestamp);
      setPosts(items);
    } catch (err: unknown) {
      console.error('Failed to fetch posts', err);
      setError((err as { message?: string })?.message ?? 'Failed to fetch posts');
      // fallback to local mock data so UI remains functional
      setUseMock(true);
      setPosts(MOCK_POSTS);
    } finally {
      setIsLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (content: string) => {
    // If user not connected, trigger wallet popup
    if (!connected) {
      try {
        const preferred = ["MetaMask","Coinbase Wallet"];
        const findPreferred = connectors.find((c) => preferred.some((p) => c.name.toLowerCase().includes(p.toLowerCase())));
        const fallback = connectors.find((c) => c.ready) || connectors[0];
        const target = findPreferred || fallback;
        if (target && connect) {
          await connect({ connector: target });
          try { toast('Please approve the connection in your wallet'); } catch { /* ignore */ }
          return;
        }
      } catch (err) {
        console.error('connect trigger failed', err);
      }

      try { toast('Please connect your wallet to post'); } catch { /* ignore */ }
      return;
    }

    const postsAddr = CONTRACT_ADDRESSES.Posts;
    if (!postsAddr) {
      toast.error('Posts contract not configured');
      return;
    }

    try {
      if (useMock) {
        // simulate tx in mock mode
        const newPost: Post = {
          id: Date.now().toString(),
          author: connected ?? '0xdemo',
          content,
          timestamp: Date.now(),
          likes: 0,
          comments: 0,
          reposts: 0,
        };
        setPosts((p) => [newPost, ...p]);
        toast.success('Post created (demo)');
        return;
      }

      await writeCreatePost({
        address: postsAddr as `0x${string}`,
        abi: POSTS_ABI as unknown as Abi,
        functionName: 'createPost',
        args: [content],
      });
      toast.success('Transaction submitted');
      // wait a bit and refetch when confirmed by hook
      const wait = new Promise((res) => setTimeout(res, 1200));
      await wait;
      await fetchPosts();
    } catch (err: unknown) {
      console.error('createPost failed', err);
      toast.error('Failed to create post, switched to demo mode');
      setUseMock(true);
      // fallback to local mock post
      const newPost: Post = {
        id: Date.now().toString(),
        author: connected ?? '0xdemo',
        content,
        timestamp: Date.now(),
        likes: 0,
        comments: 0,
        reposts: 0,
      };
      setPosts((p) => [newPost, ...p]);
      return;
    }
  }, [writeCreatePost, fetchPosts, connected, useMock, connectors, connect]);

  const likePost = useCallback(async (postId: string) => {
    const postsAddr = CONTRACT_ADDRESSES.Posts;
    if (!postsAddr) {
      toast.error('Posts contract not configured');
      return;
    }

    try {
      if (useMock) {
        setPosts((p) => p.map((post) => post.id === postId ? { ...post, isLiked: true, likes: post.likes + 1 } : post));
        toast.success('Liked (demo)');
        return;
      }

      await writeLikePost({
        address: postsAddr as `0x${string}`,
        abi: POSTS_ABI as unknown as Abi,
        functionName: 'likePost',
        args: [BigInt(postId)],
      });
      toast.success('Like tx submitted');
      await new Promise((res) => setTimeout(res, 800));
      await fetchPosts();
    } catch (err: unknown) {
      console.error('like failed', err);
      toast.error('Failed to like');
    }
  }, [writeLikePost, fetchPosts, useMock]);

  const unlikePost = useCallback(async (postId: string) => {
    const postsAddr = CONTRACT_ADDRESSES.Posts;
    if (!postsAddr) {
      toast.error('Posts contract not configured');
      return;
    }

    try {
      if (useMock) {
        setPosts((p) => p.map((post) => post.id === postId ? { ...post, isLiked: false, likes: Math.max(0, post.likes - 1) } : post));
        toast.success('Unliked (demo)');
        return;
      }

      await writeUnlikePost({
        address: postsAddr as `0x${string}`,
        abi: POSTS_ABI as unknown as Abi,
        functionName: 'unlikePost',
        args: [BigInt(postId)],
      });
      toast.success('Unlike tx submitted');
      await new Promise((res) => setTimeout(res, 800));
      await fetchPosts();
    } catch (err: unknown) {
      console.error('unlike failed', err);
      toast.error('Failed to unlike');
    }
  }, [writeUnlikePost, fetchPosts, useMock]);

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
