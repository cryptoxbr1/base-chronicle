import { useCallback } from 'react';
import { usePublicClient, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, COMMENTS_ABI } from '@/lib/contracts';
import { toast } from 'sonner';

export function useComments() {
  const publicClient = usePublicClient();
  const { writeContract: writeAddComment } = useWriteContract();

  const addComment = useCallback(async (postId: string, content: string) => {
    const commentsAddr = CONTRACT_ADDRESSES.Comments;
    if (!commentsAddr) {
      toast.error('Comments contract not configured');
      return;
    }

    try {
      await writeAddComment({
        address: commentsAddr as `0x${string}`,
        abi: COMMENTS_ABI as unknown as import('abitype').Abi,
        functionName: 'addComment',
        args: [BigInt(postId), content],
      });
      toast.success('Comment tx submitted');
    } catch (err: unknown) {
      console.error('addComment failed', err);
      toast.error('Failed to create comment');
    }
  }, [writeAddComment]);

  const getCommentsForPost = useCallback(async (postId: string) => {
    const commentsAddr = CONTRACT_ADDRESSES.Comments;
    if (!commentsAddr) return [];
    try {
      const ids: unknown = await publicClient.readContract({
        address: commentsAddr as `0x${string}`,
        abi: COMMENTS_ABI as unknown as import('abitype').Abi,
        functionName: 'getCommentsForPost',
        args: [BigInt(postId)],
      });

      if (!Array.isArray(ids)) return [];

      const items = await Promise.all(
        (ids as unknown[]).map(async (id: unknown) => {
          const raw: unknown = await publicClient.readContract({
            address: commentsAddr as `0x${string}`,
            abi: COMMENTS_ABI as unknown as import('abitype').Abi,
            functionName: 'comments',
            args: [id as unknown],
          });

          const arr = raw as unknown as [
            bigint | number | string,
            bigint | number | string,
            string,
            string,
            bigint | number
          ];

          return {
            id: arr[0]?.toString(),
            postId: arr[1]?.toString(),
            author: arr[2],
            content: arr[3],
            timestamp: Number(arr[4] ?? Date.now()),
            likes: 0,
          };
        })
      );

      return items;
    } catch (err: unknown) {
      console.error('getCommentsForPost failed', err);
      return [];
    }
  }, [publicClient]);

  return {
    addComment,
    getCommentsForPost,
  };
}
