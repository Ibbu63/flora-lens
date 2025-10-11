import React from 'react';
import { Droplet, Leaf, CheckCircle2 } from 'lucide-react';
import type { Task, Plant } from '../types';

interface CalendarProps {
    tasks: Task[];
    plants: Plant[];
    onCompleteTask: (taskId: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, plants, onCompleteTask }) => {
    return (
        <div className="pb-28 pt-20 px-4">
            <h1 className="text-3xl font-black mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Care Calendar</h1>
            <div className="space-y-4">
                {tasks.length > 0 ? tasks.map(task => {
                    const plant = plants.find(p => p.id === task.plantId);
                    if (!plant) return null;
                    return (
                        <div key={task.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-lg flex items-center gap-4 border-2 border-green-100 dark:border-gray-700 hover:shadow-xl transition">
                            <div className={`p-4 rounded-2xl ${task.type === 'water' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                                {task.type === 'water' ? <Droplet className="text-blue-600 dark:text-blue-400" size={28} /> : <Leaf className="text-green-600 dark:text-green-400" size={28} />}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-lg capitalize text-gray-800 dark:text-white">{task.type} {plant.nickname}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{task.date} at {task.time}</div>
                            </div>
                            <button
                                onClick={() => onCompleteTask(task.id)}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl text-sm font-bold hover:shadow-lg transition"
                            >
                                ✓ Done
                            </button>
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-2 border-dashed border-green-200 dark:border-gray-700">
                        <img src="https://ouch-cdn2.icons8.com/2sY_V2zXreYTVeNq0kQdKso43sXyqX0n4dJk6sJe-D4/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNjgv/YWVjYjk2YjYtYWIz/MS00OTZkLTk0Nzgt/YTY3NDJkMGJmNGE0/LnBuZw.png" alt="Cheerful sun illustration" className="w-48 h-48 mx-auto mb-5" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">All Caught Up!</h3>
                        <p className="text-gray-500 dark:text-gray-400">Your plants are happy and there are no pending tasks. New reminders will appear here automatically.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;