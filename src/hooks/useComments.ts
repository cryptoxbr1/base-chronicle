import { useCallback } from 'react';
import { usePublicClient, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, COMMENTS_ABI } from '@/lib/contracts';
import { toast } from 'sonner';

export function useComments() {
  const publicClient = usePublicClient();
  const { writeContract: writeCreateComment } = useWriteContract();

  const createComment = useCallback(async (postId: string, content: string) => {
    const commentsAddr = CONTRACT_ADDRESSES.Comments;
    if (!commentsAddr) {
      toast.error('Comments contract not configured');
      return;
    }

    try {
      await writeCreateComment({
        address: commentsAddr as `0x${string}`,
        abi: COMMENTS_ABI as unknown as import('abitype').Abi,
        functionName: 'createComment',
        args: [BigInt(postId), content],
      });
      toast.success('Comment tx submitted');
    } catch (err) {
      console.error('createComment failed', err);
      toast.error('Failed to create comment');
    }
  }, [writeCreateComment]);

  const getPostComments = useCallback(async (postId: string) => {
    const commentsAddr = CONTRACT_ADDRESSES.Comments;
    if (!commentsAddr) return [];
    try {
      const ids: unknown = await publicClient.readContract({
        address: commentsAddr as `0x${string}`,
        abi: COMMENTS_ABI as unknown as import('abitype').Abi,
        functionName: 'getPostComments',
        args: [BigInt(postId)],
      });

      if (!Array.isArray(ids)) return [];

      const items = await Promise.all(
        (ids as unknown[]).map(async (id: unknown) => {
          const raw: unknown = await publicClient.readContract({
            address: commentsAddr as `0x${string}`,
            abi: COMMENTS_ABI as unknown as import('abitype').Abi,
            functionName: 'getComment',
            args: [id as unknown],
          });

          const arr = raw as unknown as [
            bigint | number | string,
            bigint | number | string,
            string,
            string,
            bigint | number,
            bigint | number
          ];

          return {
            id: arr[0]?.toString(),
            postId: arr[1]?.toString(),
            author: arr[2],
            content: arr[3],
            timestamp: Number(arr[4] ?? Date.now()),
            likes: Number(arr[5] ?? 0),
          };
        })
      );

      return items;
    } catch (err: unknown) {
      console.error('getPostComments failed', err);
      return [];
    }
  }, [publicClient]);

  return {
    createComment,
    getPostComments,
  };
}
