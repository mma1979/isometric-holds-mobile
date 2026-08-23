import React, { useMemo } from 'react';
import { Flame, Award, Target, Activity } from 'lucide-react';
import { useLogs } from '../store';
import { format, parseISO, differenceInDays } from 'date-fns';

export default function DailyAchievement() {
  const { logs } = useLogs();

  const stats = useMemo(() => {
    if (!logs.length) return { streak: 0, todayCompleted: false, totalDays: 0, totalCalories: 0 };

    // Get unique sorted dates based on local time
    const uniqueDays = Array.from(new Set(logs.map(log => 
      format(parseISO(log.date), 'yyyy-MM-dd')
    ))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

    const todayCompleted = uniqueDays.includes(todayStr);
    let streak = 0;

    if (uniqueDays[0] === todayStr || uniqueDays[0] === yesterdayStr) {
      streak = 1;
      let currentDate = parseISO(uniqueDays[0]);
      
      for (let i = 1; i < uniqueDays.length; i++) {
        const nextDate = parseISO(uniqueDays[i]);
        if (differenceInDays(currentDate, nextDate) === 1) {
          streak++;
          currentDate = nextDate;
        } else {
          break;
        }
      }
    }

    return {
      streak,
      todayCompleted,
      totalDays: uniqueDays.length,
      totalCalories: Math.round(logs.reduce((acc, log) => acc + ((log.sets * log.durationReps) / 60) * 5, 0))
    };
  }, [logs]);

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-gray-700">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${stats.todayCompleted ? 'bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-gray-800 text-gray-500'}`}>
          <Target className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Daily Session</p>
          <p className="text-xl font-bold text-white">
            {stats.todayCompleted ? 'Completed' : 'Pending'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-gray-700">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${stats.streak > 0 ? 'bg-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-gray-800 text-gray-500'}`}>
          <Flame className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Current Streak</p>
          <p className="text-xl font-bold text-white">
            {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-gray-700">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${stats.totalDays > 0 ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-gray-800 text-gray-500'}`}>
          <Award className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Total Training Days</p>
          <p className="text-xl font-bold text-white">
            {stats.totalDays} {stats.totalDays === 1 ? 'Day' : 'Days'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900/50 p-5 transition-colors hover:border-gray-700">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${stats.totalCalories > 0 ? 'bg-blue-500/20 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-gray-800 text-gray-500'}`}>
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">Total Calories</p>
          <p className="text-xl font-bold text-white">
            {stats.totalCalories} kcal
          </p>
        </div>
      </div>
    </div>
  );
}
