import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Camera,
  Calendar,
  MessageSquare,
  Settings,
  Plus,
  Sun,
  Droplet,
  Leaf,
  ChevronLeft,
  Edit,
  Share2,
  Image,
  Send,
  AlertCircle,
  Grid,
  List,
  Home,
  Loader,
  Sprout,
  BookOpen,
} from 'lucide-react';
import type { Plant, Task, JournalEntry, Weather, ViewMode } from '../types';
import { floraService } from '../services/floraService';

// --- Plant Detail Screen Component ---
// (unchanged - same as your original component; omitted here for brevity in comments)
// Keep your PlantDetailScreen & PlantCard components as they were (copied below in full).

// --- Plant Detail Screen Component (same as you had) ---
const PlantDetailScreen: React.FC<{
  plant: Plant;
  tasks: Task[];
  onClose: () => void;
  onWater: (plantId: number) => void;
  onCompleteTask: (taskId: number) => void;
}> = ({ plant, tasks, onClose, onWater, onCompleteTask }) => {
  const [detailTab, setDetailTab] = useState<'overview' | 'journal' | 'reminders'>('overview');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    floraService.getJournal(plant.id).then(res => {
      if (res.success) setJournalEntries(res.data);
    });
  }, [plant.id]);

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] overflow-y-auto pb-28">
      <div className="relative h-80 shadow-xl overflow-hidden">
        <div
          style={{ backgroundImage: `url(${plant.image})` }}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-black/70 to-transparent"></div>

        <button onClick={onClose} className="absolute top-16 left-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition z-10">
          <ChevronLeft size={24} className="dark:text-white" />
        </button>

        <div className="absolute top-16 right-4 flex gap-3 z-10">
          <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition"><Edit size={20} className="dark:text-white" /></button>
          <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition"><Share2 size={20} className="dark:text-white" /></button>
        </div>
      </div>

      <div className="px-4 -mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-t-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-1">{plant.nickname}</h1>
          <p className="text-gray-500 dark:text-gray-400 italic text-lg mb-2">{plant.name}</p>
          <div className="flex gap-2 mb-6 flex-wrap">
            {plant.tags.map(tag => (
              <span key={tag} className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold dark:bg-green-900/50 dark:text-green-300">{tag}</span>
            ))}
          </div>

          <div className="flex gap-2 border-b-2 dark:border-gray-700 overflow-x-auto mb-6 scrollbar-hide">
            {['overview', 'journal', 'reminders'].map(tab => (
              <button
                key={tab}
                onClick={() => setDetailTab(tab as 'overview' | 'journal' | 'reminders')}
                className={`px-6 py-3 font-bold capitalize transition-all whitespace-nowrap ${
                  detailTab === tab
                    ? 'text-green-600 border-b-4 border-green-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {detailTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-100 dark:bg-gray-700/50 dark:border-gray-600">
                <h3 className="font-black text-lg mb-4 text-gray-800 dark:text-white">Health Status</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow">
                    <Sun className="mx-auto mb-2 text-yellow-500" size={28} />
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">Light</div>
                    <div className="text-xs text-green-600 font-bold">Good</div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow">
                    <Droplet className="mx-auto mb-2 text-blue-500" size={28} />
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">Soil</div>
                    <div className={`text-xs font-bold ${plant.soil === 'ok' ? 'text-blue-600' : 'text-amber-600'}`}>
                      {plant.soil === 'ok' ? 'Moist' : 'Dry'}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow">
                    <Leaf className="mx-auto mb-2 text-green-500" size={28} />
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">Health</div>
                    <div className="text-xs text-green-600 font-bold">Healthy</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border-2 border-blue-100 dark:bg-gray-700/50 dark:border-gray-600">
                <h3 className="font-black text-lg mb-3 text-gray-800 dark:text-white">💡 Care Tips</h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-700 rounded-xl p-3"><Droplet className="text-blue-500 flex-shrink-0 mt-1" size={20} /><span>Water when top 2 inches are dry</span></div>
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-700 rounded-xl p-3"><Sun className="text-yellow-500 flex-shrink-0 mt-1" size={20} /><span>Bright indirect light preferred</span></div>
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-700 rounded-xl p-3"><Leaf className="text-green-500 flex-shrink-0 mt-1" size={20} /><span>Fertilize monthly in spring/summer</span></div>
                </div>
              </div>
              <button onClick={() => onWater(plant.id)} className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105">💧 Mark as Watered</button>
            </div>
          )}

          {detailTab === 'journal' && (
            <div className="space-y-4 animate-fade-in">
              <button className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all">✍ Add New Entry</button>
              {journalEntries.length > 0 ? journalEntries.map(entry => (
                <div key={entry.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-5 border-2 border-green-100 dark:bg-gray-700/50 dark:border-gray-600">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{entry.date}</span>
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">{entry.growth}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{entry.note}</p>
                </div>
              )) : (
                <div className="text-center py-12 px-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-dashed border-green-200 mt-4 dark:bg-gray-700/50 dark:border-gray-600">
                  <img src="https://ouch-cdn2.icons8.com/b-h4hTQDyzDQ1A5h41zUnEoCGr3a-4W1YJ2q1-Q2M_g/rs:fit:368:276/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvMzU3/LzQwYmI1NTJjLWU4/NjUtNGIzZC05ZGFm/LTliMjViYjdiZmFh/Mi5wbmc.png" alt="Plant growth chart" className="w-32 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Start Your Plant's Journal</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Keep track of new leaves, growth, or any changes. Your plant's story begins here!</p>
                </div>
              )}
            </div>
          )}

          {detailTab === 'reminders' && (
            <div className="space-y-4 animate-fade-in">
              {tasks.filter(t => t.plantId === plant.id).map(task => (
                <div key={task.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-5 flex items-center justify-between border-2 border-blue-100 dark:bg-gray-700/50 dark:border-gray-600">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${task.type === 'water' ? 'bg-blue-500' : 'bg-green-500'}`}>{task.type === 'water' ? <Droplet className="text-white" size={24} /> : <Leaf className="text-white" size={24} />}</div>
                    <div>
                      <div className="font-bold capitalize text-gray-800 dark:text-white">{task.type}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{task.date} at {task.time}</div>
                    </div>
                  </div>
                  <button onClick={() => onCompleteTask(task.id)} className="px-5 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition">Done</button>
                </div>
              ))}
              {tasks.filter(t => t.plantId === plant.id).length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No reminders for {plant.nickname}.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Plant Card Component (same as your original) ---
const PlantCard: React.FC<{ plant: Plant; onClick: () => void }> = ({ plant, onClick }) => {
  const wateringText = (days: number) => {
    if (days <= 0) return 'Water today';
    if (days === 1) return 'Water in 1d';
    return `Water in ${days}d`;
  };

  return (
    <div
      onClick={onClick}
      className="group relative aspect-[3/4] rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1"
    >
      <div
        style={{ backgroundImage: `url(${plant.image})` }}
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="font-bold text-xl truncate">{plant.nickname}</h3>
        <p className="text-sm text-gray-200 truncate italic mb-2">{plant.name}</p>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Droplet size={14} />
          <span>{wateringText(plant.waterDays)}</span>
        </div>
      </div>
    </div>
  );
};

// --- Add Plant Modal Component ---
const AddPlantModal: React.FC<{
  onClose: () => void;
  onSave: (plant: Plant) => void;
  nextId: number;
}> = ({ onClose, onSave, nextId }) => {
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [waterDays, setWaterDays] = useState<number>(3);
  const [soil, setSoil] = useState<'ok' | 'dry'>('ok');
  const [light, setLight] = useState<'low' | 'medium' | 'high'>('medium');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
  };

  const handleSave = async () => {
    if (!nickname.trim() || !name.trim()) {
      alert('Please provide nickname and name');
      return;
    }

    // create plant object (minimal fields used by UI)
    const newPlant: Plant = {
      id: nextId,
      nickname: nickname.trim(),
      name: name.trim(),
      image: imagePreview || 'https://via.placeholder.com/400x600?text=Plant', // fallback
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      waterDays,
      soil: soil === 'ok' ? 'ok' : 'dry',
      light,
      // if your Plant type has other fields, add defaults here
    } as Plant;

    // If you have floraService.addPlant implemented, you can call it:
    // try {
    //   await floraService.addPlant(newPlant, imageFile); // adapt API as needed
    // } catch (err) {
    //   console.error('Failed to save to service', err);
    // }

    onSave(newPlant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center px-4 sm:px-0">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:w-[640px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 z-10 mb-8 sm:mb-0">
        <h3 className="text-xl font-bold mb-3">Add New Plant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Nickname</label>
            <input value={nickname} onChange={e => setNickname(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="eg. Monty" />
          </div>
          <div>
            <label className="text-sm font-medium">Scientific / common name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="eg. Monstera Deliciosa" />
          </div>

          <div>
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700" placeholder="Indoor, Low Light" />
          </div>

          <div>
            <label className="text-sm font-medium">Water in (days)</label>
            <input type="number" value={waterDays} onChange={e => setWaterDays(Number(e.target.value))} min={0} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700" />
          </div>

          <div>
            <label className="text-sm font-medium">Soil</label>
            <select value={soil} onChange={e => setSoil(e.target.value as 'ok' | 'dry')} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
              <option value="ok">Moist / OK</option>
              <option value="dry">Dry</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Light</label>
            <select value={light} onChange={e => setLight(e.target.value as 'low'|'medium'|'high')} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Image</label>
            <div className="mt-2 flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg cursor-pointer">
                <Image size={16} /> <span className="text-sm">Choose file</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-md border" />
              ) : (
                <div className="h-20 w-20 rounded-md border flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">Save Plant</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Garden Component (updated to support add modal & local plants) ---
const Garden: React.FC<{
  plants: Plant[];
  tasks: Task[];
  weather: Weather | null;
  onWater: (plantId: number) => void;
  onCompleteTask: (taskId: number) => void;
}> = ({ plants, tasks, weather, onWater, onCompleteTask }) => {
  // local copy so we can add new plants from the modal
  const [localPlants, setLocalPlants] = useState<Plant[]>(plants || []);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterTag, setFilterTag] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // keep in sync if parent updates plants
  useEffect(() => {
    setLocalPlants(plants || []);
  }, [plants]);

  const handleSavePlant = (p: Plant) => {
    setLocalPlants(prev => [...prev, p]);
    // optionally, if you have a backend service:
    // floraService.addPlant(p).then(...).catch(...)
  };

  const nextId = React.useMemo(() => {
    // generate next id from existing plants (simple approach)
    const maxId = localPlants.reduce((m, it) => Math.max(m, it.id ?? 0), 0);
    return maxId + 1;
  }, [localPlants]);

  const filteredPlants = filterTag === 'All' ? localPlants : localPlants.filter(p => p.tags.includes(filterTag));

  if (selectedPlant) {
    return <PlantDetailScreen
      plant={selectedPlant}
      tasks={tasks}
      onClose={() => setSelectedPlant(null)}
      onWater={onWater}
      onCompleteTask={onCompleteTask}
    />;
  }

  return (
    <div className="pb-28 pt-16 sm:pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 p-4 sm:p-8 rounded-b-3xl shadow-xl mx-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 sm:mb-3">Good Morning, Ibrahim</h1>
        {weather && (
          <div className="flex flex-wrap gap-2 sm:gap-6 text-white">
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm sm:text-base">
              <Sun size={16} className="sm:!w-18 sm:!h-18" /> <span className="font-semibold">{weather.temp}°C</span>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm sm:text-base">
              <Droplet size={16} /> <span className="font-semibold">{weather.humidity}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-xl mb-4 sm:mb-6 border-2 border-green-100 dark:border-gray-700">
          <div className="flex justify-around text-center flex-wrap gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">{localPlants.length}</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Plants</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">{localPlants.filter(p => p.waterDays <= 2).length}</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Need Water</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">{localPlants.filter(p => p.light === 'low').length}</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Low Light</div>
            </div>
          </div>
        </div>

        {/* Filters & View Mode */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Low Light', 'Indoor', 'Trailing', 'Low Maintenance'].map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-5 py-2 rounded-full text-sm sm:text-base font-semibold whitespace-nowrap transition-all transform ${
                  filterTag === tag
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-2">
            <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition ${viewMode === 'grid' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}><Grid size={18} /></button>
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition ${viewMode === 'list' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}><List size={18} /></button>
          </div>
        </div>

        {/* Plants Grid/List */}
        {filteredPlants.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
            {filteredPlants.map(plant => (
              <PlantCard key={plant.id} plant={plant} onClick={() => setSelectedPlant(plant)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-2 border-dashed border-green-200 dark:border-gray-700">
            <img src="https://ouch-cdn2.icons8.com/s-f2-j7-Xw030iB2L2x0V-lqI_bE_A-sA1gLaa_g/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvOTI4/LzM1OGMxZjJjLTFl/Y2ItNDZiZi05NmE2/LTQ3M2ZlNDE5YmY5/My5wbmc.png" alt="A friendly potted plant" className="w-32 sm:w-40 h-32 sm:h-40 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Your Garden Awaits</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">It looks a little empty here. Let's add your first plant to get started!</p>
            <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold flex items-center justify-center gap-2 mx-auto hover:shadow-xl transition-all transform hover:scale-105">
              <Plus size={20} /> Add Plant
            </button>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 sm:bottom-32 right-4 sm:right-6 w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-400/50 transition-all transform hover:scale-110 z-50"
      >
        <Plus className="text-white" size={28} />
      </button>

      {/* Add Plant Modal */}
      {showAddModal && (
        <AddPlantModal
          onClose={() => setShowAddModal(false)}
          onSave={(p) => handleSavePlant(p)}
          nextId={nextId}
        />
      )}
    </div>
  );
};

export default Garden;
