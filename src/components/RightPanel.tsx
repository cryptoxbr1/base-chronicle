import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Hash, 
  ExternalLink,
  Zap,
  Shield,
  Globe
} from "lucide-react";

const RightPanel = () => {
  const trendingTopics = [
    { tag: "#BaseLine", posts: "2.1K posts", growth: "+12%" },
    { tag: "#Web3Social", posts: "892 posts", growth: "+8%" },
    { tag: "#BaseMainnet", posts: "1.5K posts", growth: "+15%" },
    { tag: "#DeFi", posts: "3.2K posts", growth: "+5%" },
    { tag: "#NFTs", posts: "1.8K posts", growth: "+22%" }
  ];

  const suggestedUsers = [
    {
      address: "0xabcd...1234",
      username: "vitalik_base",
      bio: "Ethereum co-founder exploring Base",
      followers: "125K",
      verified: true
    },
    {
      address: "0xefgh...5678",
      username: "base_official",
      bio: "Official Base account",
      followers: "89K",
      verified: true
    },
    {
      address: "0xijkl...9012",
      username: "defi_researcher",
      bio: "Analyzing DeFi protocols on L2s",
      followers: "42K",
      verified: false
    }
  ];

  const networkStats = {
    blockNumber: "12,345,678",
    gasPrice: "0.001 ETH",
    tps: "2,847",
    tvl: "$1.2B"
  };

  return (
    <div className="w-80 p-6 space-y-6 overflow-y-auto">
      {/* Network Status */}
      <Card className="p-4 card-glow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Base Network</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <div className="connection-dot"></div>
              Online
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Block</div>
            <div className="font-mono">{networkStats.blockNumber}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Gas</div>
            <div className="font-mono">{networkStats.gasPrice}</div>
          </div>
          <div>
            <div className="text-muted-foreground">TPS</div>
            <div className="font-mono">{networkStats.tps}</div>
          </div>
          <div>
            <div className="text-muted-foreground">TVL</div>
            <div className="font-mono">{networkStats.tvl}</div>
          </div>
        </div>
      </Card>

      {/* Trending Topics */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Trending Topics</h3>
        </div>

        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-accent/50 p-2 rounded-lg -mx-2 transition-colors">
              <div className="flex-1">
                <div className="font-semibold text-primary group-hover:underline">
                  {topic.tag}
                </div>
                <div className="text-sm text-muted-foreground">
                  {topic.posts}
                </div>
              </div>
              <Badge variant="outline" className="text-success border-success/20">
                {topic.growth}
              </Badge>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-3 text-primary">
          Show more
        </Button>
      </Card>

      {/* Suggested Users */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Who to Follow</h3>
        </div>

        <div className="space-y-4">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="nft-avatar w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-secondary text-secondary-foreground text-xs">
                  {user.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm truncate">
                    {user.username}
                  </span>
                  {user.verified && (
                    <Shield className="w-3 h-3 text-primary" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate mb-1">
                  {user.address}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {user.bio}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user.followers} followers
                </div>
              </div>

              <Button size="sm" variant="outline" className="text-xs h-8">
                Follow
              </Button>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-3 text-primary">
          Show more
        </Button>
      </Card>

      {/* BaseLine Info */}
      <Card className="p-4 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">About BaseLine</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          The first fully on-chain social network built on Base. No servers, no censorship, just pure Web3 social interaction.
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Hash className="w-3 h-3 text-muted-foreground" />
            <span>Chain ID: 8453</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span>Fully Decentralized</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-muted-foreground" />
            <span>Lightning Fast</span>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4 text-sm">
          <ExternalLink className="w-3 h-3 mr-2" />
          Learn More
        </Button>
      </Card>
    </div>
  );
};

export default RightPanel;