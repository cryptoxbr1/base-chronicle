import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  User, 
  Settings, 
  TrendingUp,
  Hash,
  Moon,
  Sun,
  LogOut
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onDisconnect: () => void;
}

const Sidebar = ({ activeTab, onTabChange, darkMode, toggleDarkMode, onDisconnect }: SidebarProps) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home, badge: null },
    { id: "explore", label: "Explore", icon: Hash, badge: null },
    { id: "trending", label: "Trending", icon: TrendingUp, badge: "Hot" },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "3" },
    { id: "messages", label: "Messages", icon: Mail, badge: null, disabled: true },
    { id: "profile", label: "Profile", icon: User, badge: null },
  ];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-xl font-bold gradient-text">BaseLine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            size="lg"
            className={`w-full justify-start gap-3 ${
              activeTab === item.id ? 'bg-gradient-primary text-primary-foreground' : ''
            } ${item.disabled ? 'blur-development' : ''}`}
            onClick={() => !item.disabled && onTabChange(item.id)}
            disabled={item.disabled}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      {/* User Profile */}
      <Card className="m-4 p-4 card-hover">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="nft-avatar">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
              0x
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">0x1234...5678</div>
            <div className="text-sm text-muted-foreground">@baseline_user</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="flex-1 mr-1"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 mx-1"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDisconnect}
            className="flex-1 ml-1 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Sidebar;