import { useCallback } from 'react';
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
        address: followAddr as `0x${string}`,
        abi: FOLLOW_ABI as unknown as import('abitype').Abi,
        functionName: 'followUser',
        args: [target],
      });
      toast.success('Follow tx submitted');
    } catch (err: unknown) {
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
        address: followAddr as `0x${string}`,
        abi: FOLLOW_ABI as unknown as import('abitype').Abi,
        functionName: 'unfollowUser',
        args: [target],
      });
      toast.success('Unfollow tx submitted');
    } catch (err: unknown) {
      console.error('unfollowUser failed', err);
      toast.error('Failed to unfollow');
    }
  }, [writeUnfollow]);

  const getFollowerCount = useCallback(async (user: string) => {
    const followAddr = CONTRACT_ADDRESSES.Follow;
    if (!followAddr) return 0n;

    try {
      const res: unknown = await publicClient.readContract({
        address: followAddr as `0x${string}`,
        abi: FOLLOW_ABI as unknown as import('abitype').Abi,
        functionName: 'followerCount',
        args: [user],
      });
      return BigInt(String(res ?? '0')) ;
    } catch (err: unknown) {
      console.error('getFollowerCount failed', err);
      return 0n;
    }
  }, [publicClient]);

  const getFollowingCount = useCallback(async (user: string) => {
    const followAddr = CONTRACT_ADDRESSES.Follow;
    if (!followAddr) return 0n;

    try {
      const res: unknown = await publicClient.readContract({
        address: followAddr as `0x${string}`,
        abi: FOLLOW_ABI as unknown as import('abitype').Abi,
        functionName: 'followingCount',
        args: [user],
      });
      return BigInt(String(res ?? '0')) ;
    } catch (err: unknown) {
      console.error('getFollowingCount failed', err);
      return 0n;
    }
  }, [publicClient]);

  const isFollowing = useCallback(async (follower: string, user: string) => {
    const followAddr = CONTRACT_ADDRESSES.Follow;
    if (!followAddr) return false;

    try {
      const res: unknown = await publicClient.readContract({
        address: followAddr as `0x${string}`,
        abi: FOLLOW_ABI as unknown as import('abitype').Abi,
        functionName: 'isFollowing',
        args: [follower, user],
      });
      return Boolean(res as boolean);
    } catch (err: unknown) {
      console.error('isFollowing failed', err);
      return false;
    }
  }, [publicClient]);

  return {
    followUser,
    unfollowUser,
    getFollowerCount,
    getFollowingCount,
    isFollowing,
  };
}
