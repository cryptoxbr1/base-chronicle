import { useState } from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import RightPanel from "./RightPanel";

interface DashboardProps {
  onDisconnect: () => void;
}

const Dashboard = ({ onDisconnect }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onDisconnect={onDisconnect}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Feed */}
        <div className="flex-1 overflow-y-auto border-r border-border">
          <div className="p-6">
            <Feed activeTab={activeTab} />
          </div>
        </div>

        {/* Right Panel */}
        <RightPanel />
      </div>
    </div>
  );
};

export default Dashboard;