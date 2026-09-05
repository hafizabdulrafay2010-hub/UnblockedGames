import React from 'react';

const AdminDashboard = ({
  games = [],
  onAddGame,
  onDeleteGame,
  onClose,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Manage your gaming website
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            Back to Website
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400">Total Games</p>
            <h2 className="text-3xl font-bold mt-2">
              {games.length}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400">Custom Games</p>
            <h2 className="text-3xl font-bold mt-2">
              {games.filter(game => game.isCustom).length}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400">Admin Status</p>
            <h2 className="text-xl font-bold mt-2 text-green-400">
              Active
            </h2>
          </div>

        </div>

        {/* Game Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">
              Game Management
            </h2>

            <button
              onClick={onAddGame}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
            >
              + Add Game
            </button>
          </div>

          {/* Games */}
          <div className="space-y-3">

            {games.length === 0 ? (
              <p className="text-slate-400">
                No games available.
              </p>
            ) : (
              games.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between gap-4 bg-slate-800 rounded-lg p-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {game.title}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {game.category || 'Uncategorized'}
                    </p>
                  </div>

                  <button
                    onClick={(e) => onDeleteGame(game.id, e)}
                    className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
