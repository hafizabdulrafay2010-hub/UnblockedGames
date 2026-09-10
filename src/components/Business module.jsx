import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Gamepad2,
  FolderOpen,
  BarChart3,
  User,
  Settings,
  Plus,
  Trash2,
  Search,
} from "lucide-react";

const GAMES_KEY = "unblocked_games_list_v1";

export function BusinessModule({ games = [], onGamesChange }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const categories = useMemo(() => {
    const list = games.map((game) => game.category).filter(Boolean);
    return ["All", ...new Set(list)];
  }, [games]);

  const totalPlays = games.reduce(
    (total, game) => total + (game.playsCount || 0),
    0
  );

  const popularGames = [...games]
    .sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0))
    .slice(0, 5);

  const filteredGames = games.filter((game) =>
    game.title?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteGame = (id) => {
    if (!window.confirm("Delete this game?")) return;

    const updatedGames = games.filter((game) => game.id !== id);

    if (onGamesChange) {
      onGamesChange(updatedGames);
    } else {
      localStorage.setItem(GAMES_KEY, JSON.stringify(updatedGames));
    }
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;

    alert(
      `Category "${newCategory}" is ready to use when adding games.`
    );

    setNewCategory("");
  };

  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "games",
      label: "Game Management",
      icon: Gamepad2,
    },
    {
      id: "categories",
      label: "Categories",
      icon: FolderOpen,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "profile",
      label: "Admin Profile",
      icon: User,
    },
    {
      id: "settings",
      label: "Website Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen flex-col md:flex-row">

        {/* SIDEBAR */}
        <aside className="w-full border-b border-[#FFFFFF1A] bg-[#080808] md:w-64 md:border-b-0 md:border-r">
          <div className="p-5">
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00f0ff]">
                UNBLOCKED GAMES
              </p>

              <h1 className="mt-1 text-xl font-black uppercase">
                Business Panel
              </h1>
            </div>

            <div className="flex gap-2 overflow-x-auto md:block">
              {menu.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`mb-2 flex shrink-0 items-center gap-3 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider transition-all md:w-full ${
                      activeSection === item.id
                        ? "bg-[#CBFB45] text-black"
                        : "bg-[#111111] text-[#AAAAAA] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          {/* HEADER */}
          <div className="mb-8 border-b border-[#FFFFFF1A] pb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00f0ff]">
              ADMIN CONTROL CENTER
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase sm:text-4xl">
              {menu.find((item) => item.id === activeSection)?.label}
            </h2>
          </div>

          {/* DASHBOARD */}
          {activeSection === "dashboard" && (
            <div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                <StatCard
                  title="Total Games"
                  value={games.length}
                />

                <StatCard
                  title="Categories"
                  value={Math.max(categories.length - 1, 0)}
                />

                <StatCard
                  title="Total Plays"
                  value={totalPlays.toLocaleString()}
                />

                <StatCard
                  title="Status"
                  value="ONLINE"
                />

              </div>

              <Panel title="System Overview">
                <p className="text-sm text-[#AAAAAA]">
                  Your Unblocked Games business control center is
                  ready.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  <InfoBox
                    label="Games loaded"
                    value={games.length}
                  />

                  <InfoBox
                    label="Most played"
                    value={
                      popularGames[0]?.title || "No games yet"
                    }
                  />

                </div>
              </Panel>
            </div>
          )}

          {/* GAME MANAGEMENT */}
          {activeSection === "games" && (
            <Panel title="Game Management">

              <div className="mb-5 flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[#777]" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search games..."
                    className="w-full border border-[#FFFFFF22] bg-[#111111] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>

              </div>

              {filteredGames.length === 0 ? (
                <EmptyState text="No games found." />
              ) : (
                <div className="space-y-2">

                  {filteredGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between gap-3 border border-[#FFFFFF12] bg-[#0d0d0d] p-4"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold">
                          {game.title}
                        </h3>

                        <p className="mt-1 font-mono text-[10px] uppercase text-[#777]">
                          {game.category || "Uncategorized"}
                          {" • "}
                          {(game.playsCount || 0).toLocaleString()} plays
                        </p>
                      </div>

                      <button
                        onClick={() => deleteGame(game.id)}
                        className="shrink-0 border border-red-500/40 bg-red-500/10 p-2 text-red-400 hover:bg-red-500 hover:text-white"
                        title="Delete game"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                </div>
              )}
            </Panel>
          )}

          {/* CATEGORIES */}
          {activeSection === "categories" && (
            <Panel title="Category Management">

              <div className="mb-6 flex flex-col gap-2 sm:flex-row">

                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 border border-[#FFFFFF22] bg-[#111111] px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
                />

                <button
                  onClick={addCategory}
                  className="flex items-center justify-center gap-2 bg-[#CBFB45] px-5 py-3 text-xs font-black uppercase text-black"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>

              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

                {categories.map((category) => (
                  <div
                    key={category}
                    className="border border-[#FFFFFF15] bg-[#0d0d0d] p-4"
                  >
                    <p className="text-sm font-bold uppercase">
                      {category}
                    </p>

                    <p className="mt-1 font-mono text-[10px] text-[#777]">
                      {category === "All"
                        ? games.length
                        : games.filter(
                            (game) => game.category === category
                          ).length}{" "}
                      games
                    </p>
                  </div>
                ))}

              </div>
            </Panel>
          )}

          {/* ANALYTICS */}
          {activeSection === "analytics" && (
            <Panel title="Game Analytics">

              <div className="space-y-5">

                {popularGames.length === 0 ? (
                  <EmptyState text="No analytics available yet." />
                ) : (
                  popularGames.map((game, index) => {

                    const maxPlays =
                      popularGames[0]?.playsCount || 1;

                    const percentage =
                      ((game.playsCount || 0) / maxPlays) * 100;

                    return (
                      <div key={game.id}>

                        <div className="mb-2 flex justify-between gap-3">
                          <span className="text-sm font-bold">
                            #{index + 1} {game.title}
                          </span>

                          <span className="font-mono text-xs text-[#00f0ff]">
                            {(game.playsCount || 0).toLocaleString()}
                          </span>
                        </div>

                        <div className="h-2 bg-[#222]">
                          <div
                            className="h-full bg-[#CBFB45]"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                      </div>
                    );
                  })
                )}

              </div>
            </Panel>
          )}

          {/* PROFILE */}
          {activeSection === "profile" && (
            <Panel title="Admin Profile">

              <div className="border border-[#FFFFFF15] bg-[#0d0d0d] p-6">

                <div className="flex h-16 w-16 items-center justify-center bg-[#CBFB45] text-2xl font-black text-black">
                  A
                </div>

                <h3 className="mt-5 text-xl font-black uppercase">
                  Administrator
                </h3>

                <p className="mt-1 text-sm text-[#777]">
                  Website Owner / Admin
                </p>

                <div className="mt-5 inline-flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-3 py-2 font-mono text-[10px] uppercase text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Admin Active
                </div>

              </div>
            </Panel>
          )}

          {/* SETTINGS */}
          {activeSection === "settings" && (
            <Panel title="Website Settings">

              <div className="space-y-5">

                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase text-[#777]">
                    Website Name
                  </label>

                  <input
                    defaultValue="Unblocked Games"
                    className="w-full border border-[#FFFFFF22] bg-[#111111] px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase text-[#777]">
                    Website Description
                  </label>

                  <textarea
                    defaultValue="Play free unblocked games online."
                    className="min-h-28 w-full resize-y border border-[#FFFFFF22] bg-[#111111] px-4 py-3 text-sm outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <button
                  onClick={() => alert("Settings saved!")}
                  className="bg-[#CBFB45] px-6 py-3 text-xs font-black uppercase text-black"
                >
                  Save Settings
                </button>

              </div>
            </Panel>
          )}

        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="border border-[#FFFFFF15] bg-[#0d0d0d] p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-[#777]">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-[#CBFB45]">
        {value}
      </p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="border border-[#FFFFFF12] bg-[#111111] p-4">
      <p className="font-mono text-[9px] uppercase text-[#666]">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold">
        {value}
      </p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="border border-[#FFFFFF15] bg-[#080808] p-5 sm:p-6">
      <h3 className="mb-6 border-b border-[#FFFFFF12] pb-4 text-lg font-black uppercase">
        {title}
      </h3>

      {children}
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="border border-dashed border-[#FFFFFF22] py-12 text-center">
      <Gamepad2 className="mx-auto h-8 w-8 text-[#555]" />

      <p className="mt-3 font-mono text-xs uppercase text-[#666]">
        {text}
      </p>
    </div>
  );
                           }
