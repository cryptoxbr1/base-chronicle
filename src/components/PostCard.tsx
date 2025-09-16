import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share, 
  MoreHorizontal,
  Clock,
  ExternalLink
} from "lucide-react";

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

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onRepost: (postId: string) => void;
}

const PostCard = ({ post, onLike, onComment, onRepost }: PostCardProps) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate blockchain tx
    onLike(post.id);
    setIsLiking(false);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <Card className="p-4 post-card animate-fade-in">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="nft-avatar w-12 h-12">
          <AvatarImage src={post.avatarUrl || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-secondary text-secondary-foreground">
            {post.author.slice(2, 4).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="font-semibold truncate">{post.author}</div>
            <div className="text-sm text-muted-foreground">@{post.username}</div>
            <div className="text-sm text-muted-foreground">·</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimestamp(post.timestamp)}
            </div>
            {post.txHash && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0 hover:bg-accent"
                title="View on Base Scanner"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="text-foreground mb-3 leading-relaxed">
            {post.content}
          </div>

          {/* On-Chain Badge */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              <div className="w-2 h-2 bg-success rounded-full mr-1 animate-pulse-glow" />
              On-Chain Verified
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.id)}
              className="flex items-center gap-2 hover:bg-accent group"
            >
              <MessageCircle className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="text-sm">{post.comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRepost(post.id)}
              className="flex items-center gap-2 hover:bg-accent group"
            >
              <Repeat2 className="w-4 h-4 group-hover:text-success transition-colors" />
              <span className="text-sm">{post.reposts}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 hover:bg-accent group ${
                post.isLiked ? 'text-destructive' : ''
              }`}
            >
              <Heart 
                className={`w-4 h-4 transition-all ${
                  post.isLiked 
                    ? 'fill-current text-destructive' 
                    : 'group-hover:text-destructive'
                } ${isLiking ? 'animate-bounce' : ''}`}
              />
              <span className="text-sm">{post.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-accent group"
            >
              <Share className="w-4 h-4 group-hover:text-primary transition-colors" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto hover:bg-accent"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
