import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import React, { useState, useEffect, useCallback } from 'react';
import { CONTRACT_ADDRESSES, PROFILES_ABI } from '@/lib/contracts';
import { toast } from 'sonner';

export function useProfile(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const [profile, setProfile] = useState<{
    user: string;
    username: string;
    bio: string;
    avatarContract: string;
    avatarTokenId: number;
    exists: boolean;
  } | null>(null);

  const { writeContract: writeUpdateProfile } = useWriteContract();
  const { writeContract: writeUpdateProfileWithAvatar } = useWriteContract();

  const { isLoading: isUpdating } = useWaitForTransactionReceipt({ hash: undefined });

  const fetchProfile = useCallback(async () => {
    const profilesAddr = CONTRACT_ADDRESSES.Profiles;
    if (!profilesAddr || !targetAddress) return;

    try {
      const res: unknown = await (await import('wagmi')).publicClient.readContract({
        address: profilesAddr as `0x${string}`,
        abi: PROFILES_ABI as unknown as import('abitype').Abi,
        functionName: 'getProfile',
        args: [targetAddress as `0x${string}`],
      });

      // res may be a tuple
      const tup = res as unknown as [string, string, string, string, bigint | number, boolean];
      const parsed = {
        user: tup[0],
        username: tup[1],
        bio: tup[2],
        avatarContract: tup[3],
        avatarTokenId: Number(tup[4] ?? 0),
        exists: Boolean(tup[5]),
      };
      setProfile(parsed);
    } catch (err: unknown) {
      console.error('fetchProfile failed', err);
    }
  }, [targetAddress]);

  useEffect(() => {
    if (targetAddress) fetchProfile();
  }, [targetAddress, fetchProfile]);

  const handleUpdateProfile = useCallback(async (username: string, bio: string, avatarContract?: string, avatarTokenId?: number) => {
    const profilesAddr = CONTRACT_ADDRESSES.Profiles;
    if (!profilesAddr || !targetAddress) return;

    try {
      if (avatarContract) {
        await writeUpdateProfileWithAvatar({
          address: profilesAddr as `0x${string}`,
          abi: PROFILES_ABI as unknown as import('abitype').Abi,
          functionName: 'updateProfile',
          args: [username, bio, avatarContract, BigInt(avatarTokenId ?? 0)],
        });
      } else {
        await writeUpdateProfile({
          address: profilesAddr as `0x${string}`,
          abi: PROFILES_ABI as unknown as import('abitype').Abi,
          functionName: 'updateProfile',
          args: [username, bio, '0x0000000000000000000000000000000000000000', BigInt(0)],
        });
      }
      toast.success('Profile update submitted');
      // refetch
      setTimeout(() => fetchProfile(), 1200);
    } catch (err: unknown) {
      console.error('updateProfile failed', err);
      toast.error('Failed to update profile');
    }
  }, [writeUpdateProfile, writeUpdateProfileWithAvatar, fetchProfile, targetAddress]);

  return {
    hasProfile: Boolean(targetAddress),
    profile,
    createProfile: async (username: string, bio: string) => {
      // For this contract we use updateProfile to create/update
      await handleUpdateProfile(username, bio);
    },
    updateProfile: handleUpdateProfile,
    setAvatar: async (nftContract: string, tokenId: string) => {
      await handleUpdateProfile(profile?.username ?? '', profile?.bio ?? '', nftContract, Number(tokenId));
    },
    isCreating: false,
    isUpdating,
    isSettingAvatar: false,
    refetch: fetchProfile,
  };
}
