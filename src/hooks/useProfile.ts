import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, PROFILES_ABI } from '@/lib/contracts';
import { toast } from 'sonner';

export function useProfile(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  // For now, use mock data since contracts aren't deployed yet
  const mockProfile = {
    username: 'demo_user',
    bio: 'Welcome to BaseLine!',
    nftContract: '0x0000000000000000000000000000000000000000',
    nftTokenId: 0,
    createdAt: Date.now(),
    exists: true
  };

  const hasProfile = !!targetAddress;
  const profile = hasProfile ? mockProfile : null;

  const { writeContract: createProfile, data: createHash } = useWriteContract();
  const { writeContract: updateProfile, data: updateHash } = useWriteContract();
  const { writeContract: setAvatar, data: avatarHash } = useWriteContract();

  const { isLoading: isCreating } = useWaitForTransactionReceipt({
    hash: createHash,
  });

  const { isLoading: isUpdating } = useWaitForTransactionReceipt({
    hash: updateHash,
  });

  const { isLoading: isSettingAvatar } = useWaitForTransactionReceipt({
    hash: avatarHash,
  });

  const handleCreateProfile = (username: string, bio: string) => {
    if (!targetAddress) return;
    
    // Mock implementation for now
    toast.success(`Profile created for ${username}`);
    
    // TODO: Uncomment when contracts are deployed
    /*
    try {
      createProfile({
        address: CONTRACT_ADDRESSES.Profiles as `0x${string}`,
        abi: PROFILES_ABI,
        functionName: 'createProfile',
        args: [username, bio],
      });
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
    */
  };

  const handleUpdateProfile = (bio: string) => {
    if (!targetAddress) return;
    
    // Mock implementation for now
    toast.success('Profile updated');
    
    // TODO: Uncomment when contracts are deployed
    /*
    try {
      updateProfile({
        address: CONTRACT_ADDRESSES.Profiles as `0x${string}`,
        abi: PROFILES_ABI,
        functionName: 'updateProfile',
        args: [bio],
      });
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
    */
  };

  const handleSetAvatar = (nftContract: string, tokenId: string) => {
    if (!targetAddress) return;
    
    // Mock implementation for now
    toast.success('Avatar updated');
    
    // TODO: Uncomment when contracts are deployed
    /*
    try {
      setAvatar({
        address: CONTRACT_ADDRESSES.Profiles as `0x${string}`,
        abi: PROFILES_ABI,
        functionName: 'setAvatar',
        args: [nftContract as `0x${string}`, BigInt(tokenId)],
      });
    } catch (error) {
      toast.error('Failed to set avatar');
      console.error(error);
    }
    */
  };

  return {
    hasProfile,
    profile,
    createProfile: handleCreateProfile,
    updateProfile: handleUpdateProfile,
    setAvatar: handleSetAvatar,
    isCreating,
    isUpdating,
    isSettingAvatar,
    refetch: () => {
      // Mock refetch
      console.log('Refetching profile...');
    },
  };
}