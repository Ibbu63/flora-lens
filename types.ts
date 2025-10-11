// --- Plant Model ---
export interface Plant {
  id: number;
  name: string;              // Scientific/common name
  nickname: string;          // User-given nickname
  image: string;             // URL of plant image
  location: string;          // Room/location
  tags: string[];            // Tags like 'Indoor', 'Low Light'
  waterDays: number;         // Days until next watering
  light: 'ok' | 'low' | 'high'; // Light status
  soil: 'ok' | 'dry' | 'wet';   // Soil moisture status
}

// --- Task Model ---
export interface Task {
  id: number;
  plantId: number;           // Linked plant
  type: 'water' | 'fertilize';
  date: string;              // YYYY-MM-DD
  time: string;              // HH:MM
}

// --- Plant Journal ---
export interface JournalEntry {
  id: number;
  plantId: number;
  date: string;              // YYYY-MM-DD
  note: string;
  growth: string;            // e.g., "New Leaf", "Flowering"
}

// --- Weather Model ---
export interface Weather {
  temp: number;              // in °C
  humidity: number;          // %
  condition: string;         // e.g., 'Sunny', 'Rainy'
}

// --- Chat Message ---
export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
}

// --- Main App Tabs ---
export type Tab = 'garden' | 'calendar' | 'identify' | 'chat' | 'settings';

// --- Garden View Modes ---
export type ViewMode = 'grid' | 'list';
