import type { Plant, Task, JournalEntry, Weather } from '../types';

const data = {
  plants: [
    { id: 1, name: 'Monstera Deliciosa', nickname: 'Monty', image: 'https://images.unsplash.com/photo-1628620223412-ad52eef8c4de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8TW9uc3RlcmElMjBEZWxpY2lvc2F8ZW58MHx8MHx8fDA%3D', location: 'Bedroom', tags: ['Low Light', 'Indoor'], waterDays: 2, light: 'ok', soil: 'dry' },
    { id: 2, name: 'Snake Plant', nickname: 'Snakey', image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U25ha2UlMjBQbGFudHxlbnwwfHwwfHx8MA%3D%3D', location: 'Living Room', tags: ['Low Maintenance'], waterDays: 5, light: 'ok', soil: 'ok' },
    { id: 3, name: 'Pothos', nickname: 'Patty', image: 'https://images.unsplash.com/photo-1595524147656-eb5d0a63e9a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UG90aG9zfGVufDB8fDB8fHww', location: 'Kitchen', tags: ['Trailing', 'Indoor'], waterDays: 1, light: 'low', soil: 'dry' },
    { id: 4, name: 'Fiddle Leaf Fig', nickname: 'Figgy', image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RmlkZGxlJTIwTGVhZiUyMEZpZ3xlbnwwfHwwfHx8MA%3D%3D', location: 'Dining Room', tags: ['Fussy', 'Indoor Tree'], waterDays: 4, light: 'high', soil: 'ok' }
  ] as Plant[],
  tasks: [
    { id: 1, plantId: 1, type: 'water', date: '2025-10-09', time: '09:00' },
    { id: 2, plantId: 2, type: 'fertilize', date: '2025-10-10', time: '10:00' },
    { id: 3, plantId: 3, type: 'water', date: '2025-10-09', time: '09:00' }
  ] as Task[],
  journal: [
    { id: 1, plantId: 1, date: '2025-10-05', note: 'New leaf sprouting! Looking healthy.', growth: '+1 leaf' },
    { id: 2, plantId: 2, date: '2025-10-01', note: 'Very resilient plant!', growth: 'Stable' }
  ] as JournalEntry[],
  weather: { temp: 28, humidity: 65, condition: 'Partly Cloudy' } as Weather
};

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const floraService = {
  getPlants: async (): Promise<{ success: true; data: Plant[] }> => {
    await delay();
    return { success: true, data: data.plants };
  },

  waterPlant: async (id: number): Promise<{ success: boolean; data?: Plant }> => {
    await delay();
    const index = data.plants.findIndex(p => p.id === id);
    if (index !== -1) {
      data.plants[index] = { ...data.plants[index], waterDays: 7, soil: 'ok' };
      return { success: true, data: data.plants[index] };
    }
    return { success: false };
  },

  getTasks: async (): Promise<{ success: true; data: Task[] }> => {
    await delay();
    return { success: true, data: data.tasks };
  },

  completeTask: async (id: number): Promise<{ success: true }> => {
    await delay();
    data.tasks = data.tasks.filter(t => t.id !== id);
    return { success: true };
  },

  getJournal: async (plantId: number): Promise<{ success: true; data: JournalEntry[] }> => {
    await delay();
    return { success: true, data: data.journal.filter(e => e.plantId === plantId) };
  },

  getWeather: async (): Promise<{ success: true; data: Weather }> => {
    await delay();
    return { success: true, data: data.weather };
  }
};