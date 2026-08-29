export const MORE_GAME_EMBEDS = {
  asteroids: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #030712; color: #f9fafb; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  canvas { background: #000; border: 2px solid #374151; border-radius: 8px; max-width: 95vw; max-height: 75vh; }
  #hud { width: 500px; max-width: 95vw; display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 16px; font-weight: bold; }
  #info { margin-top: 8px; color: #9ca3af; font-size: 13px; }
</style>
</head>
<body>
<div id="hud">
  <div>SCORE: <span id="score" style="color:#38bdf8;">0</span></div>
  <div>LIVES: <span id="lives" style="color:#ef4444;">▲▲▲</span></div>
</div>
<canvas id="c" width="500" height="400"></canvas>
<div id="info">▲ Thrust &bull; ◄ ► Rotate &bull; SPACE Fire &bull; SHIFT Hyperspace</div>
<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
const scoreEl = document.getElementById('score'), livesEl = document.getElementById('lives');

let ship = { x: 250, y: 200, r: 10, a: -Math.PI/2, rot: 0, thrust: false, vx: 0, vy: 0 };
let asteroids = [], lasers = [];
let score = 0, lives = 3, gameOver = false, level = 1;
const keys = {};

function createAsteroid(x, y, r) {
  return {
    x, y, r,
    vx: (Math.random() - 0.5) * (4 - r/15),
    vy: (Math.random() - 0.5) * (4 - r/15),
    vert: Math.floor(Math.random() * 5 + 7),
    offs: Array.from({length: 12}, () => Math.random() * 0.4 + 0.8)
  };
}

function initAsteroids() {
  asteroids = [];
  for (let i = 0; i < 4 + level; i++) {
    let x, y;
    do {
      x = Math.random() * c.width;
      y = Math.random() * c.height;
    } while (Math.hypot(ship.x - x, ship.y - y) < 100);
    asteroids.push(createAsteroid(x, y, 35));
  }
}

function resetGame() {
  score = 0; lives = 3; level = 1; gameOver = false;
  ship.x = 250; ship.y = 200; ship.vx = 0; ship.vy = 0; ship.a = -Math.PI/2;
  scoreEl.innerText = '0';
  livesEl.innerText = '▲▲▲';
  lasers = [];
  initAsteroids();
}

window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space') {
    if (gameOver) { resetGame(); return; }
    if (lasers.length < 5) {
      lasers.push({
        x: ship.x + 4/3 * ship.r * Math.cos(ship.a),
        y: ship.y + 4/3 * ship.r * Math.sin(ship.a),
        vx: 8 * Math.cos(ship.a),
        vy: 8 * Math.sin(ship.a),
        life: 50
      });
    }
  }
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    ship.x = Math.random() * c.width;
    ship.y = Math.random() * c.height;
    ship.vx = 0; ship.vy = 0;
  }
});
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
  if (gameOver) return;

  if (keys['ArrowLeft'] || keys['KeyA']) ship.a -= 0.08;
  if (keys['ArrowRight'] || keys['KeyD']) ship.a += 0.08;
  ship.thrust = keys['ArrowUp'] || keys['KeyW'];

  if (ship.thrust) {
    ship.vx += 0.15 * Math.cos(ship.a);
    ship.vy += 0.15 * Math.sin(ship.a);
  } else {
    ship.vx *= 0.985;
    ship.vy *= 0.985;
  }

  ship.x += ship.vx;
  ship.y += ship.vy;

  // Screen wrap
  if (ship.x < 0) ship.x = c.width; else if (ship.x > c.width) ship.x = 0;
  if (ship.y < 0) ship.y = c.height; else if (ship.y > c.height) ship.y = 0;

  // Lasers
  for (let i = lasers.length - 1; i >= 0; i--) {
    let l = lasers[i];
    l.x += l.vx; l.y += l.vy;
    if (l.x < 0) l.x = c.width; else if (l.x > c.width) l.x = 0;
    if (l.y < 0) l.y = c.height; else if (l.y > c.height) l.y = 0;
    l.life--;

    // Check hit asteroid
    for (let j = asteroids.length - 1; j >= 0; j--) {
      let a = asteroids[j];
      if (Math.hypot(l.x - a.x, l.y - a.y) < a.r) {
        lasers.splice(i, 1);
        if (a.r > 20) {
          asteroids.push(createAsteroid(a.x, a.y, a.r / 2));
          asteroids.push(createAsteroid(a.x, a.y, a.r / 2));
        }
        asteroids.splice(j, 1);
        score += Math.floor(100 / a.r * 10);
        scoreEl.innerText = score;
        break;
      }
    }

    if (l.life <= 0) lasers.splice(i, 1);
  }

  // Asteroids
  asteroids.forEach(a => {
    a.x += a.vx; a.y += a.vy;
    if (a.x < -a.r) a.x = c.width + a.r; else if (a.x > c.width + a.r) a.x = -a.r;
    if (a.y < -a.r) a.y = c.height + a.r; else if (a.y > c.height + a.r) a.y = -a.r;

    // Ship collision
    if (!gameOver && Math.hypot(ship.x - a.x, ship.y - a.y) < ship.r + a.r) {
      lives--;
      livesEl.innerText = '▲'.repeat(Math.max(0, lives));
      ship.x = 250; ship.y = 200; ship.vx = 0; ship.vy = 0;
      if (lives <= 0) gameOver = true;
    }
  });

  if (asteroids.length === 0) {
    level++;
    initAsteroids();
  }
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, c.width, c.height);

  // Ship
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ship.x + 4/3 * ship.r * Math.cos(ship.a), ship.y + 4/3 * ship.r * Math.sin(ship.a));
  ctx.lineTo(ship.x - ship.r * (2/3 * Math.cos(ship.a) + Math.sin(ship.a)), ship.y - ship.r * (2/3 * Math.sin(ship.a) - Math.cos(ship.a)));
  ctx.lineTo(ship.x - ship.r * (2/3 * Math.cos(ship.a) - Math.sin(ship.a)), ship.y - ship.r * (2/3 * Math.sin(ship.a) + Math.cos(ship.a)));
  ctx.closePath();
  ctx.stroke();

  if (ship.thrust) {
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(ship.x - 4/3 * ship.r * Math.cos(ship.a), ship.y - 4/3 * ship.r * Math.sin(ship.a));
    ctx.lineTo(ship.x - ship.r * (2/3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)), ship.y - ship.r * (2/3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a)));
    ctx.stroke();
  }

  // Lasers
  ctx.fillStyle = '#f43f5e';
  lasers.forEach(l => {
    ctx.beginPath(); ctx.arc(l.x, l.y, 2.5, 0, Math.PI*2); ctx.fill();
  });

  // Asteroids
  ctx.strokeStyle = '#e5e7eb';
  asteroids.forEach(a => {
    ctx.beginPath();
    for (let i = 0; i < a.vert; i++) {
      let angle = i * (Math.PI * 2 / a.vert);
      let r = a.r * a.offs[i];
      let x = a.x + r * Math.cos(angle);
      let y = a.y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  });

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', c.width/2, 180);
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText('Press SPACE to Restart', c.width/2, 220);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

resetGame();
loop();
</script>
</body>
</html>`,

  towerStack: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #09090b; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  canvas { background: #121218; border: 2px solid #27272a; border-radius: 12px; cursor: pointer; max-height: 80vh; max-width: 90vw; }
  #info { margin-top: 10px; color: #a1a1aa; font-size: 13px; }
</style>
</head>
<body>
<canvas id="c" width="360" height="500"></canvas>
<div id="info">Click, Tap, or Press SPACE to drop block</div>
<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
const BLOCK_H = 28;
let stack = [], current = null, dir = 1, speed = 3.5, score = 0, best = localStorage.getItem('unblocked_tower_best') || 0;
let gameOver = false, cameraY = 0;

const COLORS = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308', '#f97316'];

function getColor(idx) {
  return COLORS[idx % COLORS.length];
}

function init() {
  stack = [{ x: 80, y: c.height - BLOCK_H - 20, w: 200, color: getColor(0) }];
  score = 0;
  gameOver = false;
  cameraY = 0;
  spawnNext();
}

function spawnNext() {
  let prev = stack[stack.length - 1];
  let nextY = prev.y - BLOCK_H;
  current = {
    x: 0,
    y: nextY,
    w: prev.w,
    color: getColor(stack.length)
  };
  dir = 1;
  speed = 3.5 + Math.min(6, stack.length * 0.15);
}

function drop() {
  if (gameOver) { init(); return; }
  let prev = stack[stack.length - 1];
  let diff = current.x - prev.x;

  if (Math.abs(diff) < 4) {
    // Perfect match snap
    current.x = prev.x;
  } else if (Math.abs(diff) >= current.w) {
    // Complete miss
    gameOver = true;
    return;
  } else {
    // Cut off overhang
    if (diff > 0) {
      current.w -= diff;
    } else {
      current.w += diff;
      current.x = prev.x;
    }
  }

  stack.push({ ...current });
  score++;
  if (score > best) {
    best = score;
    localStorage.setItem('unblocked_tower_best', best);
  }

  if (stack.length > 8) {
    cameraY += BLOCK_H;
  }

  spawnNext();
}

window.addEventListener('keydown', e => { if (e.code === 'Space') drop(); });
c.addEventListener('pointerdown', drop);

function update() {
  if (gameOver || !current) return;
  current.x += dir * speed;
  if (current.x <= 0 || current.x + current.w >= c.width) {
    dir *= -1;
  }
}

function draw() {
  ctx.fillStyle = '#121218';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.save();
  ctx.translate(0, cameraY);

  // Draw Stack
  stack.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, BLOCK_H);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(b.x, b.y, b.w, BLOCK_H);
  });

  // Current moving block
  if (current && !gameOver) {
    ctx.fillStyle = current.color;
    ctx.fillRect(current.x, current.y, current.w, BLOCK_H);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(current.x, current.y, current.w, BLOCK_H);
  }

  ctx.restore();

  // Score HUD
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(score, c.width / 2, 70);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText('BEST: ' + best, c.width / 2, 100);

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('Tower Collapsed!', c.width / 2, 220);
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.fillText('Score: ' + score, c.width / 2, 260);
    ctx.fillText('Tap to Build Again', c.width / 2, 300);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

init();
loop();
</script>
</body>
</html>`,

  ticTacToe: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #09090b; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
  .header { margin-bottom: 20px; text-align: center; }
  .status { font-size: 20px; font-weight: bold; color: #38bdf8; margin-top: 6px; }
  .board { display: grid; grid-template-columns: repeat(3, 90px); grid-template-rows: repeat(3, 90px); gap: 10px; background: #27272a; padding: 10px; border-radius: 16px; }
  .cell { background: #18181b; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 44px; font-weight: 800; cursor: pointer; transition: 0.15s; }
  .cell:hover { background: #27272a; }
  .cell.x { color: #38bdf8; }
  .cell.o { color: #f43f5e; }
  .modes { display: flex; gap: 10px; margin-top: 20px; }
  button { background: #27272a; border: 1px solid #3f3f46; color: #e4e4e7; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; }
  button.active { background: #6366f1; border-color: #818cf8; color: #fff; }
</style>
</head>
<body>
<div class="header">
  <h1 style="font-size: 24px; font-weight: 800;">Tic-Tac-Toe</h1>
  <div class="status" id="status">Your Turn (X)</div>
</div>
<div class="board" id="board"></div>
<div class="modes">
  <button id="aiBtn" class="active" onclick="setMode('ai')">VS AI</button>
  <button id="p2Btn" onclick="setMode('2p')">2 Player</button>
  <button onclick="reset()">Restart</button>
</div>
<script>
let board = Array(9).fill('');
let currentTurn = 'X', mode = 'ai', gameOver = false;

function setMode(m) {
  mode = m;
  document.getElementById('aiBtn').classList.toggle('active', mode === 'ai');
  document.getElementById('p2Btn').classList.toggle('active', mode === '2p');
  reset();
}

function reset() {
  board = Array(9).fill('');
  currentTurn = 'X';
  gameOver = false;
  document.getElementById('status').innerText = mode === 'ai' ? 'Your Turn (X)' : "Player X's Turn";
  render();
}

function checkWinner(b) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [x,y,z] of lines) {
    if (b[x] && b[x] === b[y] && b[x] === b[z]) return b[x];
  }
  return b.includes('') ? null : 'Tie';
}

function makeMove(idx) {
  if (board[idx] || gameOver) return;
  board[idx] = currentTurn;
  render();

  let win = checkWinner(board);
  if (win) {
    gameOver = true;
    document.getElementById('status').innerText = win === 'Tie' ? "It's a Draw!" : win + ' Wins!';
    return;
  }

  if (mode === 'ai' && currentTurn === 'X') {
    currentTurn = 'O';
    document.getElementById('status').innerText = 'AI Thinking...';
    setTimeout(aiMove, 300);
  } else {
    currentTurn = currentTurn === 'X' ? 'O' : 'X';
    document.getElementById('status').innerText = "Player " + currentTurn + "'s Turn";
  }
}

function aiMove() {
  if (gameOver) return;
  // Minimax or smart AI
  let emptyIndices = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  
  // 1. Can AI win?
  for (let idx of emptyIndices) {
    let copy = [...board]; copy[idx] = 'O';
    if (checkWinner(copy) === 'O') { doAiPick(idx); return; }
  }
  // 2. Can player win? Block!
  for (let idx of emptyIndices) {
    let copy = [...board]; copy[idx] = 'X';
    if (checkWinner(copy) === 'X') { doAiPick(idx); return; }
  }
  // 3. Center
  if (board[4] === '') { doAiPick(4); return; }
  // 4. Random corner or side
  let pick = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  doAiPick(pick);
}

function doAiPick(idx) {
  board[idx] = 'O';
  render();
  let win = checkWinner(board);
  if (win) {
    gameOver = true;
    document.getElementById('status').innerText = win === 'Tie' ? "It's a Draw!" : 'AI Wins!';
  } else {
    currentTurn = 'X';
    document.getElementById('status').innerText = 'Your Turn (X)';
  }
}

function render() {
  const bEl = document.getElementById('board');
  bEl.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell ' + val.toLowerCase();
    cell.innerText = val;
    cell.onclick = () => makeMove(i);
    bEl.appendChild(cell);
  });
}

reset();
</script>
</body>
</html>`,

  memoryMatch: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #09090b; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
  #hud { width: 340px; display: flex; justify-content: space-between; margin-bottom: 16px; font-weight: bold; }
  .grid { display: grid; grid-template-columns: repeat(4, 75px); gap: 10px; }
  .card { width: 75px; height: 75px; background: #27272a; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 32px; cursor: pointer; transition: transform 0.2s, background 0.2s; }
  .card:hover { background: #3f3f46; }
  .card.flipped { background: #6366f1; transform: scale(1.05); }
  .card.matched { background: #10b981; cursor: default; }
  button { margin-top: 16px; background: #6366f1; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; }
</style>
</head>
<body>
<div id="hud">
  <div>Moves: <span id="moves" style="color: #38bdf8;">0</span></div>
  <div>Matches: <span id="matches" style="color: #10b981;">0/8</span></div>
</div>
<div class="grid" id="grid"></div>
<button onclick="init()">Restart</button>
<script>
const ICONS = ['🚀', '🎮', '💎', '🔥', '⚡', '⭐', '🍕', '👾'];
let cards = [], flipped = [], matchedCount = 0, moves = 0, lock = false;

function init() {
  const deck = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);
  cards = deck.map((icon, id) => ({ id, icon, flipped: false, matched: false }));
  flipped = [];
  matchedCount = 0;
  moves = 0;
  lock = false;
  document.getElementById('moves').innerText = '0';
  document.getElementById('matches').innerText = '0/8';
  render();
}

function flip(idx) {
  if (lock || cards[idx].flipped || cards[idx].matched) return;
  cards[idx].flipped = true;
  flipped.push(idx);
  render();

  if (flipped.length === 2) {
    moves++;
    document.getElementById('moves').innerText = moves;
    lock = true;
    let [i1, i2] = flipped;
    if (cards[i1].icon === cards[i2].icon) {
      cards[i1].matched = true;
      cards[i2].matched = true;
      matchedCount++;
      document.getElementById('matches').innerText = matchedCount + '/8';
      flipped = [];
      lock = false;
      render();
    } else {
      setTimeout(() => {
        cards[i1].flipped = false;
        cards[i2].flipped = false;
        flipped = [];
        lock = false;
        render();
      }, 700);
    }
  }
}

function render() {
  const g = document.getElementById('grid');
  g.innerHTML = '';
  cards.forEach((c, idx) => {
    const div = document.createElement('div');
    div.className = 'card' + (c.flipped ? ' flipped' : '') + (c.matched ? ' matched' : '');
    div.innerText = (c.flipped || c.matched) ? c.icon : '❓';
    div.onclick = () => flip(idx);
    g.appendChild(div);
  });
}

init();
</script>
</body>
</html>`
};
