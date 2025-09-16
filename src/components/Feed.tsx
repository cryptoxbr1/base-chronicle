import { useState, useEffect } from "react";
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import CreatePost from "./CreatePost";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Hash, Users } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";

interface Post {
  id: string;
  author: string;
  username?: string;
  content: string;
  timestamp: number | Date;
  likes: number;
  comments: number;
  reposts: number;
  isLiked?: boolean;
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
];

interface FeedProps {
  activeTab: string;
}

const Feed = ({ activeTab }: FeedProps) => {
  const { posts: onChainPosts, isLoading, refetch, createPost, likePost, unlikePost } = usePosts();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (onChainPosts && onChainPosts.length > 0) {
      setPosts(onChainPosts.map((p) => ({ ...p, timestamp: new Date(p.timestamp as number) })) as Post[]);
    }
  }, [onChainPosts]);

  const handleNewPost = async (content: string) => {
    if (createPost) {
      await createPost(content);
      await refetch();
    } else {
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
    }
  };

  const handleLike = async (postId: string) => {
    // try to like/unlike via contract
    const found = posts.find(p => p.id === postId);
    if (!found) return;

    if (found.isLiked) {
      await unlikePost(postId).catch(() => {});
    } else {
      await likePost(postId).catch(() => {});
    }

    // optimistic UI update
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
    await refetch();
    setIsRefreshing(false);
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'trending':
        return [...posts].sort((a, b) => b.likes - a.likes);
      case 'explore':
        return [...posts].sort((a, b) => {
          const ta = typeof a.timestamp === 'number' ? a.timestamp : a.timestamp.getTime();
          const tb = typeof b.timestamp === 'number' ? b.timestamp : b.timestamp.getTime();
          return tb - ta;
        });
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
