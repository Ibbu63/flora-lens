import React, { useState, useEffect } from "react";
import {
  Sun,
  Droplet,
  Leaf,
  ChevronLeft,
  Image,
  Grid,
  List,
  Plus,
} from "lucide-react";
import type { Plant, Task, JournalEntry, Weather, ViewMode } from "../types";
import { floraService } from "../services/floraService";

/* ---------------------------------------------------------
   PLANT DETAIL SCREEN
--------------------------------------------------------- */
const PlantDetailScreen: React.FC<{
  plant: Plant;
  tasks: Task[];
  onClose: () => void;
  onWater: (plantId: number) => void;
  onCompleteTask: (taskId: number) => void;
}> = ({ plant, tasks, onClose, onWater, onCompleteTask }) => {
  const [detailTab, setDetailTab] = useState<
    "overview" | "journal" | "reminders"
  >("overview");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    floraService.getJournal(plant.id).then((res) => {
      if (res.success) setJournalEntries(res.data);
    });
  }, [plant.id]);

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-[100] overflow-y-auto pb-28">
      <div className="relative h-80 shadow-xl overflow-hidden">
        <div
          style={{ backgroundImage: `url(${plant.image})` }}
          className="absolute inset-0 bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-14 left-4 p-3 bg-white/80 rounded-full shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="px-4 -mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-t-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-black mb-1">{plant.nickname}</h1>
          <p className="text-gray-500 italic mb-2">{plant.name}</p>

          <div className="flex gap-2 mb-6 flex-wrap">
            {plant.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 border-b mb-6">
            {["overview", "journal", "reminders"].map((t) => (
              <button
                key={t}
                onClick={() => setDetailTab(t as any)}
                className={`pb-2 font-bold capitalize ${
                  detailTab === t
                    ? "text-green-600 border-b-4 border-green-600"
                    : "text-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {detailTab === "overview" && (
            <div className="space-y-6">
              <div className="p-6 bg-green-50 rounded-3xl">
                <h3 className="font-black text-lg mb-4">Health</h3>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-2xl shadow">
                    <Sun size={28} className="mx-auto mb-2 text-yellow-500" />
                    <div className="font-semibold">Light</div>
                    <div className="text-xs text-green-600 font-bold">Good</div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow">
                    <Droplet size={28} className="mx-auto mb-2 text-blue-500" />
                    <div className="font-semibold">Soil</div>
                    <div className="text-xs text-blue-600 font-bold">
                      {plant.soil === "ok" ? "Moist" : "Dry"}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow">
                    <Leaf size={28} className="mx-auto mb-2 text-green-500" />
                    <div className="font-semibold">Health</div>
                    <div className="text-xs text-green-600 font-bold">
                      Healthy
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onWater(plant.id)}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold"
              >
                💧 Mark as watered
              </button>
            </div>
          )}

          {detailTab === "journal" && (
            <div className="space-y-4">
              <button className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold">
                ✍ Add Entry
              </button>

              {journalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-green-50 p-5 rounded-3xl shadow"
                >
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-bold">{entry.date}</span>
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs">
                      {entry.growth}
                    </span>
                  </div>
                  <p>{entry.note}</p>
                </div>
              ))}
            </div>
          )}

          {detailTab === "reminders" && (
            <div className="space-y-4">
              {tasks
                .filter((t) => t.plantId === plant.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-blue-50 p-5 rounded-3xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <Droplet className="text-blue-500" size={20} />
                      <div>
                        <div className="font-bold">{task.type}</div>
                        <div className="text-sm text-gray-600">
                          {task.date} at {task.time}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="px-5 py-2 bg-green-500 text-white rounded-full font-bold"
                    >
                      Done
                    </button>
                  </div>
                ))}

              {tasks.filter((t) => t.plantId === plant.id).length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No reminders for {plant.nickname}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   ADD / EDIT PLANT MODAL (COMPLETE + FIXED)
--------------------------------------------------------- */
const AddPlantModal: React.FC<{
  onClose: () => void;
  onSave: (plant: Plant) => void;
  nextId: number;
  mode?: "add" | "edit";
  existingPlant?: Plant | null;
}> = ({ onClose, onSave, nextId, mode = "add", existingPlant }) => {
  const [nickname, setNickname] = useState(existingPlant?.nickname || "");
  const [name, setName] = useState(existingPlant?.name || "");
  const [tags, setTags] = useState(existingPlant?.tags?.join(", ") || "");
  const [waterDays, setWaterDays] = useState(existingPlant?.waterDays || 3);
  const [soil, setSoil] = useState<"ok" | "dry">(existingPlant?.soil || "ok");
  const [light, setLight] = useState<"low" | "medium" | "high">(
    existingPlant?.light || "medium"
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(
    existingPlant?.image || ""
  );

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleSave = () => {
    if (!nickname.trim() || !name.trim()) {
      alert("Please fill nickname and plant name");
      return;
    }

    const plant: Plant = {
      id: nextId,
      nickname,
      name,
      image: imagePreview || existingPlant?.image || "",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      waterDays,
      soil,
      light,
      location: existingPlant?.location || "Unknown",
    };

    onSave(plant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center pb-24">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
  {mode === "add" ? "Add Plant" : "Edit Plant"}
</h3>


        <div className="space-y-3">
          <input
            className="w-full p-3 border rounded-xl bg-gray-50"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded-xl bg-gray-50"
            placeholder="Plant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded-xl bg-gray-50"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-3 border rounded-xl bg-gray-50"
            placeholder="Water after days"
            value={waterDays}
            onChange={(e) => setWaterDays(Number(e.target.value))}
          />

          <select
            className="w-full p-3 border rounded-xl bg-gray-50"
            value={soil}
            onChange={(e) => setSoil(e.target.value as any)}
          >
            <option value="ok">Moist</option>
            <option value="dry">Dry</option>
          </select>

          <select
            className="w-full p-3 border rounded-xl bg-gray-50"
            value={light}
            onChange={(e) => setLight(e.target.value as any)}
          >
            <option value="low">Low Light</option>
            <option value="medium">Medium</option>
            <option value="high">High Light</option>
          </select>

          <label className="block">
            <div className="p-3 border rounded-xl flex items-center gap-3 bg-gray-50">
              <Image size={20} />
              <span>Select Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </label>

          {imagePreview ? (
            <img
              src={imagePreview}
              className="h-36 w-full object-cover rounded-xl mt-3"
            />
          ) : null}
        </div>

        {/* FIXED SAVE / CANCEL BUTTONS */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 pb-4 mt-4 border-t flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-green-500 text-white font-bold"
            onClick={handleSave}
          >
            {mode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   PLANT CARD WITH MENU (⋮)
--------------------------------------------------------- */
const PlantCard: React.FC<{
  plant: Plant;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ plant, onClick, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const wateringText = (d: number) =>
    d <= 0 ? "Water today" : d === 1 ? "Water in 1d" : `Water in ${d}d`;

  return (
    <div className="relative">
      {/* Three-dot menu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-3 right-3 z-20 bg-black/40 text-white px-2 py-1 rounded-full"
      >
        ⋮
      </button>

      {showMenu && (
        <div
          className="absolute top-10 right-2 z-30 bg-white rounded-xl shadow-lg border w-32 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
            onClick={() => {
              setShowMenu(false);
              onEdit();
            }}
          >
            ✏ Edit
          </button>

          <button
            className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-100"
            onClick={() => {
              setShowMenu(false);
              onDelete();
            }}
          >
            🗑 Delete
          </button>
        </div>
      )}

      {/* Plant Card */}
      <div
        onClick={onClick}
        className="group relative aspect-[3/4] rounded-3xl shadow-lg overflow-hidden cursor-pointer"
      >
        <div
          style={{ backgroundImage: `url(${plant.image})` }}
          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="font-bold text-xl truncate">{plant.nickname}</h3>
          <p className="text-sm opacity-80 italic">{plant.name}</p>

          <div className="flex items-center gap-2 mt-2 text-sm font-medium">
            <Droplet size={14} />
            <span>{wateringText(plant.waterDays)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   MAIN GARDEN SCREEN
--------------------------------------------------------- */
const Garden: React.FC<{
  plants: Plant[];
  tasks: Task[];
  weather: Weather | null;
  onWater: (plantId: number) => void;
  onCompleteTask: (taskId: number) => void;
}> = ({ plants, tasks, weather, onWater, onCompleteTask }) => {
  const [localPlants, setLocalPlants] = useState<Plant[]>(plants);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterTag, setFilterTag] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPlant, setEditPlant] = useState<Plant | null>(null);

  const nextId = React.useMemo(
    () => Math.max(0, ...localPlants.map((p) => p.id)) + 1,
    [localPlants]
  );

  const filtered =
    filterTag === "All"
      ? localPlants
      : localPlants.filter((p) => p.tags.includes(filterTag));

  return (
    <div className="pb-28 pt-16">
      {/* Header */}
      <div className="bg-green-400 p-6 rounded-b-3xl shadow-xl mx-4 text-white">
        <h1 className="text-2xl font-black mb-2">Good Morning, Ibrahim</h1>

        {weather && (
          <div className="flex gap-3">
            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
              <Sun size={16} /> {weather.temp}°C
            </div>

            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
              <Droplet size={16} /> {weather.humidity}%
            </div>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {["All", "Low Light", "Indoor", "Trailing", "Low Maintenance"].map(
            (tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm font-bold ${
                  filterTag === tag
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setFilterTag(tag)}
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* View Mode Buttons */}
        <div className="flex gap-2">
          <button
            className={`p-3 rounded-xl ${
              viewMode === "grid"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid size={18} />
          </button>

          <button
            className={`p-3 rounded-xl ${
              viewMode === "list"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Plant Grid */}
      <div className="px-4 mt-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No plants found.</p>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 gap-4"
                : "space-y-4"
            }
          >
            {filtered.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onClick={() => setSelectedPlant(plant)}
                onEdit={() => {
                  setEditPlant(plant);
                  setShowAddModal(true);
                }}
                onDelete={() => {
                  if (confirm("Delete this plant?")) {
                    setLocalPlants((prev) =>
                      prev.filter((p) => p.id !== plant.id)
                    );
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setEditPlant(null);
          setShowAddModal(true);
        }}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-xl text-white"
      >
        <Plus size={28} />
      </button>

      {/* Modal */}
      {showAddModal && (
        <AddPlantModal
          onClose={() => {
            setShowAddModal(false);
            setEditPlant(null);
          }}
          onSave={(p) => {
            if (editPlant) {
              setLocalPlants((prev) =>
                prev.map((pl) => (pl.id === editPlant.id ? p : pl))
              );
            } else {
              setLocalPlants((prev) => [...prev, p]);
            }
          }}
          nextId={editPlant ? editPlant.id : nextId}
          mode={editPlant ? "edit" : "add"}
          existingPlant={editPlant}
        />
      )}

      {/* Details Screen */}
      {selectedPlant && (
        <PlantDetailScreen
          plant={selectedPlant}
          tasks={tasks}
          onClose={() => setSelectedPlant(null)}
          onWater={onWater}
          onCompleteTask={onCompleteTask}
        />
      )}
    </div>
  );
};

export default Garden;
