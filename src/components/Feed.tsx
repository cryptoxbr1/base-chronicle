import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Hash, Users } from "lucide-react";

interface Post {
  id: string;
  author: string;
  username: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  avatarUrl?: string;
  txHash?: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "0x1234...5678",
    username: "crypto_builder",
    content: "Just deployed my first smart contract on @base! The gas fees are incredibly low compared to mainnet. Web3 social media is the future! 🚀 #Base #Web3 #BaseLine",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    likes: 42,
    comments: 8,
    reposts: 12,
    isLiked: false,
    txHash: "0xabc123..."
  },
  {
    id: "2",
    author: "0x9876...5432",
    username: "nft_collector",
    content: "Love how I can use my @BoredApeYC as my profile picture here! Finally, true NFT utility in social media. This is what we've been waiting for.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    likes: 128,
    comments: 23,
    reposts: 45,
    isLiked: true,
    txHash: "0xdef456..."
  },
  {
    id: "3",
    author: "0x5555...7777",
    username: "defi_degen",
    content: "GM Web3! 🌅 The future of social media is decentralized. No more censorship, no more data harvesting. Just pure, on-chain expression. #DecentralizedSocial",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    likes: 89,
    comments: 15,
    reposts: 28,
    isLiked: false,
    txHash: "0x789abc..."
  },
  {
    id: "4",
    author: "0x8888...9999",
    username: "base_maxi",
    content: "Building on Base feels like magic ✨ Fast, cheap, and secure. BaseLine is going to change how we think about social networks forever!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 156,
    comments: 34,
    reposts: 67,
    isLiked: true,
    txHash: "0x456def..."
  }
];

interface FeedProps {
  activeTab: string;
}

const Feed = ({ activeTab }: FeedProps) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNewPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: "0x1234...5678",
      username: "baseline_user",
      content,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      reposts: 0,
      isLiked: false,
      txHash: `0x${Math.random().toString(16).substr(2, 8)}...`
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId);
    // TODO: Implement comment functionality
  };

  const handleRepost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, reposts: post.reposts + 1 }
        : post
    ));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'trending':
        return [...posts].sort((a, b) => b.likes - a.likes);
      case 'explore':
        return [...posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      default:
        return posts;
    }
  };

  if (activeTab === 'profile' || activeTab === 'notifications' || activeTab === 'messages') {
    return (
      <div className="space-y-4">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            This section is under development. Stay tuned for updates!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {activeTab === 'home' && 'Home Feed'}
            {activeTab === 'explore' && 'Explore'}
            {activeTab === 'trending' && 'Trending'}
          </h2>
          <p className="text-muted-foreground">
            {activeTab === 'home' && 'Posts from people you follow'}
            {activeTab === 'explore' && 'Discover new voices on BaseLine'}
            {activeTab === 'trending' && 'Most liked posts today'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 card-hover">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">1.2K</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-hover">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-success" />
            <div>
              <div className="font-semibold">5.6K</div>
              <div className="text-sm text-muted-foreground">Posts Today</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 card-hover">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-warning" />
            <div>
              <div className="font-semibold">892</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Post - Only on Home */}
      {activeTab === 'home' && (
        <CreatePost onPost={handleNewPost} />
      )}

      {/* Feed */}
      <div className="space-y-4">
        {getFilteredPosts().map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onRepost={handleRepost}
          />
        ))}
      </div>

      {/* Load More */}
      <Card className="p-4 text-center">
        <Button variant="outline" className="w-full">
          Load More Posts
        </Button>
      </Card>
    </div>
  );
};

export default Feed;