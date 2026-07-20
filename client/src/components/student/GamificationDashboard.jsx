import React from "react";

export default function GamificationDashboard({ user, leaderboard }) {
  const xpInCurrentLevel = user?.xp % 100;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 max-w-5xl mx-auto space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">Your learning journey is looking impressive.</p>
        </div>
        
        {/* STREAK PILL */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/10 self-start transform hover:scale-[1.02] transition-transform cursor-default">
          <span className="text-xl animate-pulse">🔥</span>
          <span className="font-semibold text-sm tracking-wide">{user?.streak || 0} Day Streak</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* XP CARD */}
        <div className="relative group bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 overflow-hidden transition-all">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl transition-colors"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Experience Points</p>
              <div className="bg-blue-50/50 p-2 rounded-lg text-blue-600 border border-blue-100">✨</div>
            </div>
            
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {user?.xp || 0} <span className="text-base font-normal text-slate-400">XP</span>
            </h2>
            
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Level {user?.level || 1}</span>
                <span className="text-blue-600 font-semibold">{100 - xpInCurrentLevel} XP to next rank</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${xpInCurrentLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LEVEL CARD */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-[80px]"></div>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Current Standing</p>
              <h2 className="text-4xl font-extrabold mt-2 tracking-tight">Level {user?.level || 1}</h2>
            </div>
            
            <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg text-xl">👑</div>
              <p className="text-xs font-normal text-slate-300">You're doing great! Keep it up</p>
            </div>
          </div>
        </div>

      </div>

      {/* LEADERBOARD SECTION */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-lg">🏆</span> Global Leaderboard
            </h3>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-2.5">
          {leaderboard?.length > 0 ? (
            leaderboard.map((u, i) => (
              <div
                key={i}
                className={`flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-100 ${
                  u.email === user?.email 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-[1.01]" 
                  : "bg-white border border-slate-100 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm ${
                    i === 0 ? "bg-yellow-400 text-white" : 
                    i === 1 ? "bg-slate-300 text-white" : 
                    i === 2 ? "bg-amber-600 text-white" : 
                    (u.email === user?.email ? "bg-indigo-500 text-white" : "bg-slate-50 text-slate-500 border border-slate-200/40")
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className={`font-semibold text-sm ${u.email === user?.email ? "text-white" : "text-slate-800"}`}>
                      {u.name} 
                      {u.email === user?.email && (
                        <span className="ml-2 text-[9px] font-bold bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base font-bold tracking-tight ${u.email === user?.email ? "text-white" : "text-slate-900"}`}>
                    {u.xp.toLocaleString()}
                  </span>
                  <span className={`text-[10px] font-medium ${u.email === user?.email ? "text-indigo-200" : "text-slate-400"}`}>
                    XP
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <div className="text-3xl animate-bounce">⏳</div>
              <p className="font-medium text-xs tracking-wider uppercase">Waiting for contenders...</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
