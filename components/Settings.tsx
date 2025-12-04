import React, { useState } from 'react';
import { Bell, Database, HelpCircle, Sun, ChevronLeft, ChevronRight } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
  >
    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

type ScreenType =
  | 'main'
  | 'language'
  | 'notifications'
  | 'data'
  | 'support';

const SettingsScreen: React.FC<SettingsProps> = ({ onClose, isDarkMode, setIsDarkMode }) => {
  const [notifications, setNotifications] = useState({
    water: true,
    fertilize: true,
    updates: false,
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-black dark:text-white font-display">

      {/* Header */}
      <header className="fixed top-0 w-full bg-primary/10 dark:bg-gray-800 backdrop-blur-sm z-50 p-4 flex items-center gap-3 text-black dark:text-white">
        {currentScreen !== 'main' && (
          <button onClick={() => setCurrentScreen('main')} className="p-2 hover:bg-primary/20 rounded-full transition">
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="flex-1 text-xl font-bold text-center text-black dark:text-white">
          {currentScreen === 'main'
            ? 'Settings'
            : currentScreen === 'language'
            ? 'Language & Units'
            : currentScreen === 'notifications'
            ? 'Notifications'
            : currentScreen === 'data'
            ? 'Data & Privacy'
            : 'Support'}
        </h1>
      </header>

      <main className="pt-24 px-4 pb-24 space-y-6 max-w-md mx-auto text-black dark:text-white">

        {/* MAIN SCREEN */}
        {currentScreen === 'main' && (
          <>
            {/* Account Section */}
            <section>
              <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wider">Account</h2>

              <div className="bg-white rounded-xl shadow-sm dark:bg-gray-800">
                <div className="p-4 flex items-center gap-4 border-b border-background dark:border-gray-700">
                  <img
                    src="https://agricultural-jade-xeunoadouy.edgeone.app/create%20an%20logo%20for%20an%20app%20with%20the%20name%20of%20flora%20lenz,%20and%20that%20based%20on%20the%20topic%20of%20identifying%20pla.jpg"
                    alt="User"
                    className="w-16 h-16 rounded-full border-4 border-secondary shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">Mohammed Ibrahim</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">mohammedibbu41@gmail.com</p>
                  </div>
                </div>

                {/* Subscription */}
                <a className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 transition text-black dark:text-white">
                  <div className="flex items-center gap-3">
                    <Sun size={22} className="text-yellow-500" />
                    <span className="font-bold text-primary">Flora Lenz+</span>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase rounded-full bg-primary">Manage</span>
                </a>

                {/* Language */}
                <button
                  onClick={() => setCurrentScreen('language')}
                  className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 w-full text-left border-t border-background dark:border-gray-700 text-black dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <Sun size={22} className="text-blue-500" />
                    <span className="font-medium">Language & Units</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
                </button>

                {/* Notifications */}
                <button
                  onClick={() => setCurrentScreen('notifications')}
                  className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 w-full text-left border-t border-background dark:border-gray-700 text-black dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <Bell size={22} className="text-blue-500" />
                    <span className="font-medium">Notifications</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
                </button>

                {/* Data */}
                <button
                  onClick={() => setCurrentScreen('data')}
                  className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 w-full text-left border-t border-background dark:border-gray-700 text-black dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <Database size={22} className="text-gray-500" />
                    <span className="font-medium">Data & Privacy</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
                </button>

                {/* Support */}
                <button
                  onClick={() => setCurrentScreen('support')}
                  className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 w-full text-left border-t border-background dark:border-gray-700 text-black dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={22} className="text-gray-500" />
                    <span className="font-medium">Support</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
                </button>
              </div>
            </section>

            {/* Preferences */}
            <section>
              <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wider">Preferences</h2>

              <div className="bg-white rounded-xl shadow-sm dark:bg-gray-800 text-black dark:text-white">
                <div className="flex items-center justify-between p-4 hover:bg-primary/10 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center gap-3">
                    <Sun size={22} className="text-orange-500" />
                    <span className="font-medium">Dark Mode</span>
                  </div>
                  <ToggleSwitch checked={isDarkMode} onChange={setIsDarkMode} />
                </div>
              </div>
            </section>
          </>
        )}

        {/* LANGUAGE PAGE */}
        {currentScreen === 'language' && (
          <section className="bg-white rounded-xl shadow-sm dark:bg-gray-800 p-4 text-black dark:text-white">
            <h2 className="font-bold mb-4">Select Language</h2>
            <ul className="space-y-2">
              <li className="p-2 rounded hover:bg-primary/10 cursor-pointer">English</li>
              <li className="p-2 rounded hover:bg-primary/10 cursor-pointer">Hindi</li>
              <li className="p-2 rounded hover:bg-primary/10 cursor-pointer">Spanish</li>
            </ul>

            <h2 className="font-bold mt-6 mb-4">Units</h2>
            <ul className="space-y-2">
              <li className="p-2 rounded hover:bg-primary/10 cursor-pointer">Metric (cm, liters)</li>
              <li className="p-2 rounded hover:bg-primary/10 cursor-pointer">Imperial (inch, gallons)</li>
            </ul>
          </section>
        )}

        {/* NOTIFICATIONS PAGE */}
        {currentScreen === 'notifications' && (
          <section className="bg-white rounded-xl shadow-sm dark:bg-gray-800 p-4 space-y-2 text-black dark:text-white">
            <div className="flex items-center justify-between p-4 border-b border-background dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Bell size={22} className="text-blue-500" />
                <span className="font-medium">Watering Reminders</span>
              </div>
              <ToggleSwitch checked={notifications.water} onChange={(val) => setNotifications(p => ({ ...p, water: val }))} />
            </div>
            <div className="flex items-center justify-between p-4 border-b border-background dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Bell size={22} className="text-green-500" />
                <span className="font-medium">Fertilizer Alerts</span>
              </div>
              <ToggleSwitch checked={notifications.fertilize} onChange={(val) => setNotifications(p => ({ ...p, fertilize: val }))} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell size={22} className="text-purple-500" />
                <span className="font-medium">App Updates</span>
              </div>
              <ToggleSwitch checked={notifications.updates} onChange={(val) => setNotifications(p => ({ ...p, updates: val }))} />
            </div>
          </section>
        )}

        {/* DATA PAGE */}
        {currentScreen === 'data' && (
          <section className="bg-white rounded-xl shadow-sm dark:bg-gray-800 p-4 space-y-2 text-black dark:text-white">
            <a className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 transition rounded">
              <div className="flex items-center gap-3">
                <Database size={22} className="text-gray-500" />
                <span className="font-medium">Export Data</span>
              </div>
              <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
            </a>
            <a className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 transition rounded">
              <div className="flex items-center gap-3">
                <Database size={22} className="text-red-500" />
                <span className="font-medium">Clear Cache</span>
              </div>
              <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
            </a>
          </section>
        )}

        {/* SUPPORT PAGE */}
        {currentScreen === 'support' && (
          <section className="bg-white rounded-xl shadow-sm dark:bg-gray-800 p-4 space-y-2 text-black dark:text-white">
            <a className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 transition rounded">
              <span>FAQs / Common Questions</span>
              <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
            </a>
            <a className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 transition rounded">
              <span>Contact Support</span>
              <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
            </a>
            <a className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 transition rounded">
              <span>Send Feedback</span>
              <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
            </a>
            <a className="flex items-center p-4 justify-between hover:bg-primary/10 dark:hover:bg-gray-700 transition rounded">
              <span>Privacy Policy</span>
              <ChevronRight size={20} className="text-gray-500 dark:text-gray-300" />
            </a>
          </section>
        )}

        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
          Flora Lenz v1.0.0
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;
