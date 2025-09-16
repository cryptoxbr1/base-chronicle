import { useCallback } from 'react';
import { usePublicClient, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, FOLLOW_ABI } from '@/lib/contracts';
import { toast } from 'sonner';

export function useFollow() {
  const publicClient = usePublicClient();
  const { writeContract: writeFollow } = useWriteContract();
  const { writeContract: writeUnfollow } = useWriteContract();

  const followUser = useCallback(async (target: string) => {
    const followAddr = CONTRACT_ADDRESSES.Follow;
    if (!followAddr) {
      toast.error('Follow contract not configured');
      return;
    }

    try {
      await writeFollow({
        address: followAddr as any,
        abi: FOLLOW_ABI as any,
        functionName: 'followUser',
        args: [target],
      });
      toast.success('Follow tx submitted');
    } catch (err) {
      console.error('followUser failed', err);
      toast.error('Failed to follow');
    }
  }, [writeFollow]);

  const unfollowUser = useCallback(async (target: string) => {
    const followAddr = CONTRACT_ADDRESSES.Follow;
    if (!followAddr) {
      toast.error('Follow contract not configured');
      return;
    }

    try {
      await writeUnfollow({
        address: followAddr as any,
        abi: FOLLOW_ABI as any,
        functionName: 'unfollowUser',
        args: [target],
      });
      toast.success('Unfollow tx submitted');
    } catch (err) {
      console.error('unfollowUser failed', err);
      toast.error('Failed to unfollow');
    }
  }, [writeUnfollow]);

  const getFollowers = useCallback(async (user: string) => {
    const followAddr = CONTRACT_ADDRESSES.Follow;
    if (!followAddr) return [];

    try {
      const res: any = await publicClient.readContract({
        address: followAddr as any,
        abi: FOLLOW_ABI as any,
        functionName: 'getFollowers',
        args: [user],
      });
      return Array.isArray(res) ? res : [];
    } catch (err) {
      console.error('getFollowers failed', err);
      return [];
    }
  }, [publicClient]);

  const getFollowing = useCallback(async (user: string) => {
    const followAddr = CONTRACT_ADDRESSES.Follow;
    if (!followAddr) return [];

    try {
      const res: any = await publicClient.readContract({
        address: followAddr as any,
        abi: FOLLOW_ABI as any,
        functionName: 'getFollowing',
        args: [user],
      });
      return Array.isArray(res) ? res : [];
    } catch (err) {
      console.error('getFollowing failed', err);
      return [];
    }
  }, [publicClient]);

  return {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
  };
}
