import { useState } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  MapPin, 
  Hash, 
  Sparkles,
  X,
  Globe
} from "lucide-react";

interface CreatePostProps {
  onPost: (content: string) => void;
}

const CreatePost = ({ onPost }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 280;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setContent(text);
      setCharCount(text.length);
    }
  };

  const handlePost = async () => {
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const res = onPost ? onPost(content) : null;
      if (res && typeof (res as { then?: unknown }).then === 'function') {
        await res as Promise<unknown>;
      } else {
        // fallback simulated tx
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setContent("");
      setCharCount(0);
    } catch (err) {
      console.error('Post failed', err);
    } finally {
      setIsPosting(false);
    }
  };

  const getCharCountColor = () => {
    const percentage = charCount / maxChars;
    if (percentage > 0.9) return "text-destructive";
    if (percentage > 0.7) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <Card className="p-4 card-glow animate-fade-in">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="nft-avatar">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
            0x
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Text Input */}
          <div className="relative">
            <Textarea
              placeholder="What's happening on-chain?"
              value={content}
              onChange={handleContentChange}
              className="min-h-[100px] resize-none border-0 text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 bg-transparent"
            />
            
            {/* Character Count */}
            <div className={`absolute bottom-2 right-2 text-sm ${getCharCountColor()}`}>
              {charCount}/{maxChars}
            </div>
          </div>

          {/* Post Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-accent">
                <Image className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-accent">
                <Hash className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-accent">
                <MapPin className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                On-Chain
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {content.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setContent("");
                    setCharCount(0);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={handlePost}
                disabled={!content.trim() || isPosting}
                className="btn-gradient px-6"
              >
                {isPosting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Post
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreatePost;
