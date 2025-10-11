import React, { useState, useEffect, useCallback } from "react";
import { Camera, Calendar, MessageSquare, Settings, Home } from "lucide-react";

import type { Plant, Task, Weather, Tab } from "./types";
import { floraService } from "./services/floraService";

import Loader from "./components/Loader";
import Garden from "./components/Garden";
import CalendarScreen from "./components/Calendar";
import IdentifyScreen from "./components/Identify";
import ChatScreen from "./components/Chat";
import SettingsScreen from "./components/Settings";

const logoUrl =
  "https://agricultural-jade-xeunoadouy.edgeone.app/create%20an%20logo%20for%20an%20app%20with%20the%20name%20of%20flora%20lenz,%20and%20that%20based%20on%20the%20topic%20of%20identifying%20pla.jpg";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("garden");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // Apply dark/light mode globally
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    const [p, t, w] = await Promise.all([
      floraService.getPlants(),
      floraService.getTasks(),
      floraService.getWeather(),
    ]);
    if (p.success) setPlants(p.data);
    if (t.success) setTasks(t.data);
    if (w.success) setWeather(w.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWaterPlant = async (plantId: number) => {
    const result = await floraService.waterPlant(plantId);
    if (result.success && result.data) {
      setPlants((prev) => prev.map((p) => (p.id === plantId ? result.data : p)));
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    await floraService.completeTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  if (loading) return <Loader />;

  const renderActiveTab = () => {
    switch (activeTab) {
      case "garden":
        return (
          <Garden
            plants={plants}
            tasks={tasks}
            weather={weather}
            onWater={handleWaterPlant}
            onCompleteTask={handleCompleteTask}
          />
        );
      case "calendar":
        return <CalendarScreen plants={plants} tasks={tasks} onCompleteTask={handleCompleteTask} />;
      case "identify":
        return <IdentifyScreen />;
      case "chat":
        return <ChatScreen />;
      case "settings":
        return (
          <SettingsScreen
            onClose={() => setActiveTab("garden")}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        );
      default:
        return (
          <Garden
            plants={plants}
            tasks={tasks}
            weather={weather}
            onWater={handleWaterPlant}
            onCompleteTask={handleCompleteTask}
          />
        );
    }
  };

  const NavButton = ({ tabName, icon: Icon, label }: { tabName: Tab; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      aria-current={activeTab === tabName ? "page" : undefined}
      className="relative flex flex-col items-center justify-center gap-1 w-20 h-16 transition-colors duration-300 group focus:outline-none"
    >
      <Icon
        size={24}
        className={`transition-colors duration-300 ${
          activeTab === tabName
            ? "text-green-600"
            : "text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-200"
        }`}
      />
      <span
        className={`text-xs font-semibold transition-colors duration-300 ${
          activeTab === tabName
            ? "text-green-600"
            : "text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-200"
        }`}
      >
        {label}
      </span>
      <div
        className={`absolute bottom-0 h-1 w-6 rounded-full bg-green-500 transition-all duration-300 ${
          activeTab === tabName ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm shadow-md z-50 dark:bg-gray-800/80 dark:border-b dark:border-gray-700/50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <img src={logoUrl} alt="Flora Lenz Logo" className="w-10 h-10 rounded-lg shadow-sm" />
          <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Flora Lenz
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto relative overflow-hidden mt-24 transition-all duration-500">{renderActiveTab()}</main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto relative px-4">
          <div className="bg-white/80 backdrop-blur-sm shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] rounded-t-3xl overflow-hidden dark:bg-gray-800/80 dark:shadow-slate-900/50">
            <nav className="flex justify-around items-center h-20">
              <NavButton tabName="garden" icon={Home} label="Garden" />
              <NavButton tabName="calendar" icon={Calendar} label="Calendar" />
              <NavButton tabName="identify" icon={Camera} label="Identify" />
              <NavButton tabName="chat" icon={MessageSquare} label="Chat" />
              <NavButton tabName="settings" icon={Settings} label="Settings" />
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
