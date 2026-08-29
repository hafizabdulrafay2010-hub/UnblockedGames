/**
 * Embedded Standalone HTML5 Game Engines
 * These embed directly into iframes safely via srcdoc / sandboxed iframe
 * with 0 external network dependencies, guaranteeing 100% unblocked reliability.
 */

export const GAME_EMBEDS = {
  snake: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #09090b; color: #f4f4f5; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  #hud { display: flex; justify-content: space-between; width: 400px; max-width: 90vw; margin-bottom: 12px; font-weight: bold; font-size: 18px; }
  .badge { background: #18181b; padding: 6px 14px; border-radius: 8px; border: 1px solid #27272a; }
  canvas { background: #18181b; border: 2px solid #3f3f46; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); max-width: 90vw; max-height: 70vh; }
  #controls { margin-top: 14px; color: #a1a1aa; font-size: 13px; text-align: center; }
  #overlay { position: absolute; background: rgba(9,9,11,0.85); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; width: 400px; height: 400px; max-width: 90vw; max-height: 70vh; }
  button { background: #6366f1; color: white; border: none; padding: 10px 24px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.2s; margin-top: 12px; }
  button:hover { background: #4f46e5; transform: scale(1.05); }
</style>
</head>
<body>
<div id="hud">
  <div class="badge">Score: <span id="score" style="color:#10b981;">0</span></div>
  <div class="badge">Best: <span id="highScore" style="color:#f59e0b;">0</span></div>
</div>
<div style="position: relative;">
  <canvas id="c" width="400" height="400"></canvas>
  <div id="overlay">
    <h2 id="msgTitle" style="font-size:24px; margin-bottom:6px;">Retro Snake</h2>
    <p id="msgSub" style="color:#a1a1aa; font-size:14px;">Use Arrow Keys or WASD</p>
    <button id="startBtn">PLAY GAME</button>
  </div>
</div>
<div id="controls">Use Arrow Keys or WASD &bull; Space to Pause</div>

<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
const scoreEl = document.getElementById('score'), highEl = document.getElementById('highScore');
const overlay = document.getElementById('overlay'), startBtn = document.getElementById('startBtn');
const msgTitle = document.getElementById('msgTitle'), msgSub = document.getElementById('msgSub');

const GRID = 20, COUNT = 20;
let snake = [], food = {x: 15, y: 15}, dir = {x: 0, y: 0}, nextDir = {x: 0, y: 0};
let score = 0, highScore = localStorage.getItem('unblocked_snake_high') || 0;
let gameLoop = null, running = false, paused = false;

highEl.innerText = highScore;

function resetGame() {
  snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
  dir = {x: 1, y: 0};
  nextDir = {x: 1, y: 0};
  score = 0;
  scoreEl.innerText = '0';
  spawnFood();
  running = true;
  paused = false;
  overlay.style.display = 'none';
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(tick, 100);
}

function spawnFood() {
  while (true) {
    food = {
      x: Math.floor(Math.random() * COUNT),
      y: Math.floor(Math.random() * COUNT)
    };
    if (!snake.some(s => s.x === food.x && s.y === food.y)) break;
  }
}

function tick() {
  if (paused) return;
  dir = nextDir;
  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

  // Wall collisions
  if (head.x < 0 || head.x >= COUNT || head.y < 0 || head.y >= COUNT) return gameOver();
  // Self collision
  if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.innerText = score;
    if (score > highScore) {
      highScore = score;
      highEl.innerText = highScore;
      localStorage.setItem('unblocked_snake_high', highScore);
    }
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, c.width, c.height);

  // Subtle grid
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= COUNT; i++) {
    ctx.beginPath(); ctx.moveTo(i * GRID, 0); ctx.lineTo(i * GRID, c.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * GRID); ctx.lineTo(c.width, i * GRID); ctx.stroke();
  }

  // Food
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(food.x * GRID + GRID/2, food.y * GRID + GRID/2, GRID/2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Snake
  snake.forEach((s, idx) => {
    ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
    ctx.beginPath();
    ctx.roundRect(s.x * GRID + 1, s.y * GRID + 1, GRID - 2, GRID - 2, 4);
    ctx.fill();
  });
}

function gameOver() {
  running = false;
  clearInterval(gameLoop);
  msgTitle.innerText = 'Game Over!';
  msgSub.innerText = 'Final Score: ' + score;
  startBtn.innerText = 'PLAY AGAIN';
  overlay.style.display = 'flex';
}

window.addEventListener('keydown', e => {
  if (['ArrowUp', 'KeyW'].includes(e.code) && dir.y === 0) nextDir = {x: 0, y: -1};
  else if (['ArrowDown', 'KeyS'].includes(e.code) && dir.y === 0) nextDir = {x: 0, y: 1};
  else if (['ArrowLeft', 'KeyA'].includes(e.code) && dir.x === 0) nextDir = {x: -1, y: 0};
  else if (['ArrowRight', 'KeyD'].includes(e.code) && dir.x === 0) nextDir = {x: 1, y: 0};
  else if (e.code === 'Space' && running) {
    paused = !paused;
    if (paused) {
      msgTitle.innerText = 'Paused';
      msgSub.innerText = 'Press Space to resume';
      startBtn.innerText = 'RESUME';
      overlay.style.display = 'flex';
    } else {
      overlay.style.display = 'none';
    }
  }
});

startBtn.onclick = () => {
  if (!running) resetGame();
  else { paused = false; overlay.style.display = 'none'; }
};

draw();
</script>
</body>
</html>`,

  flappy: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #09090b; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  canvas { background: #0ea5e9; border: 2px solid #38bdf8; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer; max-height: 85vh; max-width: 90vw; }
  #inst { margin-top: 10px; color: #a1a1aa; font-size: 13px; }
</style>
</head>
<body>
<canvas id="c" width="360" height="520"></canvas>
<div id="inst">Press SPACE, UP, or CLICK to Flap</div>
<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
let bird = { x: 60, y: 240, vy: 0, r: 14 };
let pipes = [], frame = 0, score = 0, high = localStorage.getItem('unblocked_flappy_high') || 0;
let state = 'START'; // START, PLAY, OVER

function reset() {
  bird = { x: 60, y: 240, vy: 0, r: 14 };
  pipes = [];
  score = 0;
  frame = 0;
  state = 'PLAY';
}

function flap() {
  if (state === 'START') { reset(); }
  else if (state === 'PLAY') { bird.vy = -6.8; }
  else if (state === 'OVER') { reset(); }
}

window.addEventListener('keydown', e => { if (e.code === 'Space' || e.code === 'ArrowUp') flap(); });
c.addEventListener('pointerdown', flap);

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function update() {
  if (state !== 'PLAY') return;
  frame++;
  bird.vy += 0.32; // Gravity
  bird.y += bird.vy;

  if (frame % 85 === 0) {
    let gap = 130;
    let topH = Math.floor(Math.random() * (c.height - gap - 140)) + 40;
    pipes.push({ x: c.width, top: topH, bottom: topH + gap, scored: false });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    let p = pipes[i];
    p.x -= 2.2;

    // Scoring
    if (!p.scored && p.x + 50 < bird.x) {
      score++;
      p.scored = true;
      if (score > high) { high = score; localStorage.setItem('unblocked_flappy_high', high); }
    }

    // Collision
    if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + 50) {
      if (bird.y - bird.r < p.top || bird.y + bird.r > p.bottom) {
        state = 'OVER';
      }
    }

    if (p.x < -60) pipes.splice(i, 1);
  }

  if (bird.y + bird.r >= c.height - 40 || bird.y - bird.r <= 0) {
    state = 'OVER';
  }
}

function draw() {
  // Sky
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(0, 0, c.width, c.height);

  // Clouds
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.arc(80, 80, 25, 0, Math.PI*2); ctx.arc(110, 80, 35, 0, Math.PI*2); ctx.arc(140, 80, 25, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(260, 130, 20, 0, Math.PI*2); ctx.arc(285, 130, 30, 0, Math.PI*2); ctx.arc(310, 130, 20, 0, Math.PI*2); ctx.fill();

  // Pipes
  pipes.forEach(p => {
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;
    // Top
    ctx.fillRect(p.x, 0, 50, p.top);
    ctx.strokeRect(p.x, 0, 50, p.top);
    ctx.fillRect(p.x - 4, p.top - 20, 58, 20);
    ctx.strokeRect(p.x - 4, p.top - 20, 58, 20);
    // Bottom
    ctx.fillRect(p.x, p.bottom, 50, c.height - p.bottom);
    ctx.strokeRect(p.x, p.bottom, 50, c.height - p.bottom);
    ctx.fillRect(p.x - 4, p.bottom, 58, 20);
    ctx.strokeRect(p.x - 4, p.bottom, 58, 20);
  });

  // Ground
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(0, c.height - 40, c.width, 40);
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(0, c.height - 40, c.width, 10);

  // Bird
  ctx.save();
  ctx.translate(bird.x, bird.y);
  let rot = Math.min(Math.PI/4, Math.max(-Math.PI/4, bird.vy * 0.08));
  ctx.rotate(rot);
  // Body
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(0, 0, bird.r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.stroke();
  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(5, -4, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(6, -4, 2, 0, Math.PI * 2); ctx.fill();
  // Beak
  ctx.fillStyle = '#f97316';
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(18, 4); ctx.lineTo(10, 8); ctx.fill();
  ctx.restore();

  // Score HUD
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;
  if (state === 'PLAY') {
    ctx.fillText(score, c.width / 2, 60);
  } else if (state === 'START') {
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('Flappy Bird', c.width / 2, 180);
    ctx.font = '16px sans-serif';
    ctx.fillText('Click or Space to Fly', c.width / 2, 220);
  } else if (state === 'OVER') {
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Game Over', c.width / 2, 160);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.fillText('Score: ' + score, c.width / 2, 200);
    ctx.fillText('Best: ' + high, c.width / 2, 230);
    ctx.font = '15px sans-serif';
    ctx.fillText('Click or Space to Retry', c.width / 2, 280);
  }
}

loop();
</script>
</body>
</html>`,

  game2048: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
  .header { width: 360px; max-width: 90vw; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .scores { display: flex; gap: 8px; }
  .box { background: #1e293b; padding: 6px 14px; border-radius: 8px; text-align: center; border: 1px solid #334155; }
  .box .lbl { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; }
  .box .val { font-size: 18px; font-weight: 800; color: #38bdf8; }
  #grid { width: 360px; height: 360px; max-width: 90vw; max-height: 90vw; background: #1e293b; border-radius: 12px; padding: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; border: 2px solid #334155; position: relative; }
  .tile { border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 24px; transition: transform 0.1s ease-in-out; }
  .t-0 { background: #334155; }
  .t-2 { background: #fef08a; color: #713f12; }
  .t-4 { background: #fed7aa; color: #7c2d12; }
  .t-8 { background: #fb923c; color: #fff; }
  .t-16 { background: #f97316; color: #fff; }
  .t-32 { background: #ea580c; color: #fff; }
  .t-64 { background: #dc2626; color: #fff; }
  .t-128 { background: #eab308; color: #fff; font-size: 20px; box-shadow: 0 0 10px #eab308; }
  .t-256 { background: #facc15; color: #713f12; font-size: 20px; box-shadow: 0 0 15px #facc15; }
  .t-512 { background: #10b981; color: #fff; font-size: 20px; box-shadow: 0 0 15px #10b981; }
  .t-1024 { background: #06b6d4; color: #fff; font-size: 18px; box-shadow: 0 0 20px #06b6d4; }
  .t-2048 { background: #8b5cf6; color: #fff; font-size: 18px; box-shadow: 0 0 25px #8b5cf6; }
  .controls { margin-top: 16px; display: flex; gap: 12px; align-items: center; }
  button { background: #6366f1; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; }
  button:hover { background: #4f46e5; }
  #msg { position: absolute; inset: 0; background: rgba(15,23,42,0.9); border-radius: 12px; display: none; flex-direction: column; align-items: center; justify-content: center; }
</style>
</head>
<body>
<div class="header">
  <h1 style="font-size: 32px; font-weight: 800; color: #f8fafc;">2048</h1>
  <div class="scores">
    <div class="box"><div class="lbl">Score</div><div class="val" id="score">0</div></div>
    <div class="box"><div class="lbl">Best</div><div class="val" id="best">0</div></div>
  </div>
</div>
<div id="grid">
  <div id="msg">
    <h2 id="msgText" style="font-size: 28px; margin-bottom: 12px;">Game Over</h2>
    <button onclick="newGame()">Try Again</button>
  </div>
</div>
<div class="controls">
  <button onclick="newGame()">New Game</button>
  <span style="font-size: 13px; color: #94a3b8;">Use Arrow Keys or Swipe</span>
</div>

<script>
let grid = [
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0]
];
let score = 0, best = localStorage.getItem('unblocked_2048_best') || 0;
document.getElementById('best').innerText = best;

function newGame() {
  grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  score = 0;
  document.getElementById('score').innerText = '0';
  document.getElementById('msg').style.display = 'none';
  addTile();
  addTile();
  render();
}

function addTile() {
  let empty = [];
  for(let r=0; r<4; r++) {
    for(let c=0; c<4; c++) {
      if(grid[r][c] === 0) empty.push({r, c});
    }
  }
  if(empty.length > 0) {
    let rand = empty[Math.floor(Math.random() * empty.length)];
    grid[rand.r][rand.c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function render() {
  const gEl = document.getElementById('grid');
  gEl.querySelectorAll('.tile').forEach(t => t.remove());
  for(let r=0; r<4; r++) {
    for(let c=0; c<4; c++) {
      const val = grid[r][c];
      const div = document.createElement('div');
      div.className = 'tile ' + (val ? 't-' + val : 't-0');
      div.innerText = val ? val : '';
      gEl.appendChild(div);
    }
  }
}

function slide(row) {
  let arr = row.filter(v => v !== 0);
  for(let i=0; i<arr.length-1; i++) {
    if(arr[i] === arr[i+1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i+1] = 0;
    }
  }
  arr = arr.filter(v => v !== 0);
  while(arr.length < 4) arr.push(0);
  return arr;
}

function moveLeft() {
  let changed = false;
  for(let r=0; r<4; r++) {
    let row = grid[r];
    let newRow = slide(row);
    if(JSON.stringify(row) !== JSON.stringify(newRow)) changed = true;
    grid[r] = newRow;
  }
  return changed;
}

function rotate() {
  let next = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  for(let r=0; r<4; r++) {
    for(let c=0; c<4; c++) {
      next[c][3-r] = grid[r][c];
    }
  }
  grid = next;
}

function move(dir) {
  let moved = false;
  if(dir === 'left') { moved = moveLeft(); }
  else if(dir === 'down') { rotate(); moved = moveLeft(); rotate(); rotate(); rotate(); }
  else if(dir === 'right') { rotate(); rotate(); moved = moveLeft(); rotate(); rotate(); }
  else if(dir === 'up') { rotate(); rotate(); rotate(); moved = moveLeft(); rotate(); }

  if(moved) {
    addTile();
    document.getElementById('score').innerText = score;
    if(score > best) {
      best = score;
      document.getElementById('best').innerText = best;
      localStorage.setItem('unblocked_2048_best', best);
    }
    render();
    if(isGameOver()) {
      document.getElementById('msg').style.display = 'flex';
    }
  }
}

function isGameOver() {
  for(let r=0; r<4; r++) {
    for(let c=0; c<4; c++) {
      if(grid[r][c] === 0) return false;
      if(c < 3 && grid[r][c] === grid[r][c+1]) return false;
      if(r < 3 && grid[r][c] === grid[r+1][c]) return false;
    }
  }
  return true;
}

window.addEventListener('keydown', e => {
  if(['ArrowUp','KeyW'].includes(e.code)) { e.preventDefault(); move('up'); }
  if(['ArrowDown','KeyS'].includes(e.code)) { e.preventDefault(); move('down'); }
  if(['ArrowLeft','KeyA'].includes(e.code)) { e.preventDefault(); move('left'); }
  if(['ArrowRight','KeyD'].includes(e.code)) { e.preventDefault(); move('right'); }
});

// Touch swipe
let startX, startY;
window.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; });
window.addEventListener('touchend', e => {
  if(!startX || !startY) return;
  let dx = e.changedTouches[0].clientX - startX;
  let dy = e.changedTouches[0].clientY - startY;
  if(Math.abs(dx) > Math.abs(dy)) {
    if(Math.abs(dx) > 30) move(dx > 0 ? 'right' : 'left');
  } else {
    if(Math.abs(dy) > 30) move(dy > 0 ? 'down' : 'up');
  }
});

newGame();
</script>
</body>
</html>`,

  spaceInvaders: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #030712; color: #f9fafb; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  #hud { width: 480px; max-width: 95vw; display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold; font-size: 16px; }
  canvas { background: #0b0f19; border: 2px solid #1f2937; border-radius: 8px; max-width: 95vw; max-height: 75vh; box-shadow: 0 0 20px rgba(0,0,0,0.8); }
  #info { margin-top: 8px; color: #9ca3af; font-size: 13px; }
</style>
</head>
<body>
<div id="hud">
  <div>Score: <span id="s" style="color: #22c55e;">0</span></div>
  <div>Lives: <span id="l" style="color: #ef4444;">❤❤❤</span></div>
</div>
<canvas id="c" width="480" height="520"></canvas>
<div id="info">Left / Right to move &bull; Space to Shoot</div>
<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
const sEl = document.getElementById('s'), lEl = document.getElementById('l');

let player = { x: 220, y: 480, w: 32, h: 16, speed: 5 };
let bullets = [], enemyBullets = [], enemies = [], particles = [];
let dir = 1, moveTimer = 0, score = 0, lives = 3, gameOver = false, wave = 1;
const keys = {};

function initEnemies() {
  enemies = [];
  for (let r = 0; r < 4; r++) {
    for (let col = 0; col < 8; col++) {
      enemies.push({
        x: 40 + col * 46,
        y: 50 + r * 35,
        w: 26,
        h: 20,
        type: r
      });
    }
  }
}

function resetGame() {
  score = 0; lives = 3; wave = 1; gameOver = false;
  bullets = []; enemyBullets = []; particles = [];
  player.x = 220;
  sEl.innerText = score;
  updateLives();
  initEnemies();
}

function updateLives() {
  lEl.innerText = '❤'.repeat(Math.max(0, lives));
}

window.addEventListener('keydown', e => { keys[e.code] = true; if(e.code === 'Space' && gameOver) resetGame(); });
window.addEventListener('keyup', e => { keys[e.code] = false; });

let lastShoot = 0;
function update() {
  if (gameOver) return;

  if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > 10) player.x -= player.speed;
  if ((keys['ArrowRight'] || keys['KeyD']) && player.x < c.width - player.w - 10) player.x += player.speed;

  if (keys['Space'] && Date.now() - lastShoot > 250) {
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, vy: -7 });
    lastShoot = Date.now();
  }

  // Player bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y += bullets[i].vy;
    if (bullets[i].y < 0) { bullets.splice(i, 1); continue; }

    // Hit enemy
    for (let j = enemies.length - 1; j >= 0; j--) {
      let b = bullets[i], e = enemies[j];
      if (b && b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score += (4 - e.type) * 10;
        sEl.innerText = score;
        spawnExplosion(e.x + e.w/2, e.y + e.h/2);
        break;
      }
    }
  }

  // Move enemies
  moveTimer++;
  if (moveTimer > Math.max(10, 40 - wave * 4 - (32 - enemies.length))) {
    moveTimer = 0;
    let hitEdge = false;
    enemies.forEach(e => {
      e.x += dir * 12;
      if (e.x < 10 || e.x > c.width - e.w - 10) hitEdge = true;
    });
    if (hitEdge) {
      dir *= -1;
      enemies.forEach(e => {
        e.y += 15;
        if (e.y >= player.y - 20) gameOver = true;
      });
    }
  }

  // Enemy shoot
  if (Math.random() < 0.03 && enemies.length > 0) {
    let randE = enemies[Math.floor(Math.random() * enemies.length)];
    enemyBullets.push({ x: randE.x + randE.w/2, y: randE.y + randE.h, vy: 3.5 });
  }

  // Enemy bullets
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let eb = enemyBullets[i];
    eb.y += eb.vy;
    if (eb.y > c.height) { enemyBullets.splice(i, 1); continue; }

    if (eb.x > player.x && eb.x < player.x + player.w && eb.y > player.y && eb.y < player.y + player.h) {
      enemyBullets.splice(i, 1);
      lives--;
      updateLives();
      spawnExplosion(player.x + player.w/2, player.y + player.h/2);
      if (lives <= 0) gameOver = true;
    }
  }

  // Next wave
  if (enemies.length === 0) {
    wave++;
    initEnemies();
  }

  // Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx; p.y += p.vy; p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function spawnExplosion(x, y) {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 20,
      color: ['#f59e0b', '#ef4444', '#10b981', '#38bdf8'][Math.floor(Math.random()*4)]
    });
  }
}

function draw() {
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(0, 0, c.width, c.height);

  // Player
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillRect(player.x + player.w/2 - 3, player.y - 6, 6, 6);

  // Bullets
  ctx.fillStyle = '#38bdf8';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));

  ctx.fillStyle = '#ef4444';
  enemyBullets.forEach(eb => ctx.fillRect(eb.x - 2, eb.y, 4, 8));

  // Enemies
  enemies.forEach(e => {
    ctx.fillStyle = ['#ec4899', '#a855f7', '#3b82f6', '#10b981'][e.type];
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(e.x + 5, e.y + 4, 4, 4);
    ctx.fillRect(e.x + e.w - 9, e.y + 4, 4, 4);
  });

  // Particles
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 3, 3);
  });

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', c.width/2, 240);
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.fillText('Press SPACE to Restart', c.width/2, 280);
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

  breakout: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0a0a0c; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  #hud { width: 440px; max-width: 95vw; display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold; }
  canvas { background: #121216; border: 2px solid #27272a; border-radius: 8px; max-width: 95vw; max-height: 75vh; }
  #controls { margin-top: 8px; color: #a1a1aa; font-size: 13px; }
</style>
</head>
<body>
<div id="hud">
  <div>Score: <span id="sc" style="color: #6366f1;">0</span></div>
  <div>Lives: <span id="lv" style="color: #ef4444;">❤❤❤</span></div>
</div>
<canvas id="c" width="440" height="480"></canvas>
<div id="controls">Mouse or Left/Right Arrow Keys to move paddle</div>
<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
const scEl = document.getElementById('sc'), lvEl = document.getElementById('lv');

let paddle = { x: 180, w: 80, h: 12, speed: 6 };
let ball = { x: 220, y: 300, vx: 3.5, vy: -3.5, r: 6 };
let bricks = [], score = 0, lives = 3, gameOver = false, won = false;
const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

function initBricks() {
  bricks = [];
  const rows = 5, cols = 8, w = 48, h = 18, p = 6, offTop = 40, offLeft = 7;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      bricks.push({
        x: col * (w + p) + offLeft,
        y: r * (h + p) + offTop,
        w, h,
        color: colors[r],
        active: true
      });
    }
  }
}

function resetBall() {
  ball.x = paddle.x + paddle.w / 2;
  ball.y = 400;
  ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3.5;
  ball.vy = -3.5;
}

function reset() {
  score = 0; lives = 3; gameOver = false; won = false;
  scEl.innerText = score;
  lvEl.innerText = '❤❤❤';
  initBricks();
  resetBall();
}

window.addEventListener('mousemove', e => {
  const rect = c.getBoundingClientRect();
  paddle.x = Math.max(0, Math.min(c.width - paddle.w, e.clientX - rect.left - paddle.w / 2));
});

const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if ((gameOver || won) && e.code === 'Space') reset();
});
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
  if (gameOver || won) return;

  if (keys['ArrowLeft'] || keys['KeyA']) paddle.x = Math.max(0, paddle.x - paddle.speed);
  if (keys['ArrowRight'] || keys['KeyD']) paddle.x = Math.min(c.width - paddle.w, paddle.x + paddle.speed);

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall bounce
  if (ball.x - ball.r < 0 || ball.x + ball.r > c.width) ball.vx *= -1;
  if (ball.y - ball.r < 0) ball.vy *= -1;

  // Bottom death
  if (ball.y + ball.r > c.height) {
    lives--;
    lvEl.innerText = '❤'.repeat(Math.max(0, lives));
    if (lives <= 0) {
      gameOver = true;
    } else {
      resetBall();
    }
  }

  // Paddle bounce
  if (ball.y + ball.r >= c.height - 30 && ball.y - ball.r <= c.height - 30 + paddle.h) {
    if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
      let hitOffset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      ball.vx = hitOffset * 4.5;
      ball.vy = -Math.abs(ball.vy);
    }
  }

  // Brick bounce
  let activeCount = 0;
  bricks.forEach(b => {
    if (!b.active) return;
    activeCount++;
    if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w && ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
      b.active = false;
      ball.vy *= -1;
      score += 10;
      scEl.innerText = score;
    }
  });

  if (activeCount === 0) won = true;
}

function draw() {
  ctx.fillStyle = '#121216';
  ctx.fillRect(0, 0, c.width, c.height);

  // Bricks
  bricks.forEach(b => {
    if (b.active) {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    }
  });

  // Paddle
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(paddle.x, c.height - 30, paddle.w, paddle.h);

  // Ball
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  if (gameOver || won) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = won ? '#22c55e' : '#ef4444';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(won ? 'YOU WIN!' : 'GAME OVER', c.width / 2, 220);
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.fillText('Press SPACE to Restart', c.width / 2, 260);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

reset();
loop();
</script>
</body>
</html>`,

  dino: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #09090b; color: #f4f4f5; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  canvas { background: #18181b; border: 2px solid #27272a; border-radius: 8px; max-width: 95vw; max-height: 60vh; }
  #info { margin-top: 12px; color: #a1a1aa; font-size: 14px; }
</style>
</head>
<body>
<canvas id="c" width="600" height="240"></canvas>
<div id="info">Press SPACE or UP Arrow to Jump &bull; Down to Duck</div>
<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
let dino = { x: 50, y: 170, vy: 0, w: 28, h: 42, duck: false, ground: 170 };
let obstacles = [], frame = 0, score = 0, high = localStorage.getItem('unblocked_dino_high') || 0;
let speed = 6, gameOver = false, running = true;

function jump() {
  if (gameOver) { reset(); return; }
  if (dino.y >= dino.ground) dino.vy = -11.5;
}

window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
  if (e.code === 'ArrowDown') { dino.duck = true; dino.h = 24; dino.y = dino.ground + 18; }
});
window.addEventListener('keyup', e => {
  if (e.code === 'ArrowDown') { dino.duck = false; dino.h = 42; dino.y = dino.ground; }
});
c.addEventListener('pointerdown', jump);

function reset() {
  dino = { x: 50, y: 170, vy: 0, w: 28, h: 42, duck: false, ground: 170 };
  obstacles = [];
  score = 0;
  speed = 6;
  frame = 0;
  gameOver = false;
}

function update() {
  if (gameOver) return;
  frame++;
  score += 0.15;
  speed = 6 + Math.floor(score / 150) * 0.5;

  dino.vy += 0.65; // gravity
  dino.y += dino.vy;
  if (dino.y > (dino.duck ? dino.ground + 18 : dino.ground)) {
    dino.y = dino.duck ? dino.ground + 18 : dino.ground;
    dino.vy = 0;
  }

  // Spawn obstacles
  if (frame % Math.floor(80 + Math.random() * 50) === 0) {
    let type = Math.random() > 0.4 ? 'cactus' : 'bird';
    if (type === 'cactus') {
      obstacles.push({ x: c.width, y: 172, w: 20, h: 40, type: 'cactus' });
    } else {
      obstacles.push({ x: c.width, y: 130 + (Math.random() > 0.5 ? 0 : 35), w: 30, h: 20, type: 'bird' });
    }
  }

  // Move obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let ob = obstacles[i];
    ob.x -= speed;

    // Collision
    if (dino.x + dino.w > ob.x && dino.x < ob.x + ob.w && dino.y + dino.h > ob.y && dino.y < ob.y + ob.h) {
      gameOver = true;
      if (score > high) { high = Math.floor(score); localStorage.setItem('unblocked_dino_high', high); }
    }

    if (ob.x < -40) obstacles.splice(i, 1);
  }
}

function draw() {
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, c.width, c.height);

  // Ground line
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 212);
  ctx.lineTo(c.width, 212);
  ctx.stroke();

  // Dino
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
  // Eye
  ctx.fillStyle = '#09090b';
  ctx.fillRect(dino.x + 18, dino.y + 6, 4, 4);

  // Obstacles
  obstacles.forEach(ob => {
    if (ob.type === 'cactus') {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
    } else {
      ctx.fillStyle = '#eab308';
      ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
    }
  });

  // Score HUD
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '14px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('HI ' + Math.floor(high).toString().padStart(5, '0') + '  ' + Math.floor(score).toString().padStart(5, '0'), c.width - 20, 30);

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('G A M E  O V E R', c.width / 2, 110);
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText('Press SPACE to Restart', c.width / 2, 145);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
</script>
</body>
</html>`,

  pong: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #09090b; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  #hud { width: 500px; max-width: 95vw; display: flex; justify-content: space-around; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
  canvas { background: #18181b; border: 2px solid #27272a; border-radius: 8px; max-width: 95vw; max-height: 70vh; }
  #info { margin-top: 10px; color: #a1a1aa; font-size: 13px; }
</style>
</head>
<body>
<div id="hud">
  <div style="color: #6366f1;" id="p1">0</div>
  <div style="color: #3f3f46;">:</div>
  <div style="color: #ec4899;" id="p2">0</div>
</div>
<canvas id="c" width="500" height="360"></canvas>
<div id="info">Move Mouse or W/S to control Player (Left) &bull; Beat the AI (Right)</div>
<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
const p1El = document.getElementById('p1'), p2El = document.getElementById('p2');

let p1 = { y: 140, h: 70, w: 10, score: 0 };
let p2 = { y: 140, h: 70, w: 10, score: 0, speed: 3.8 };
let ball = { x: 250, y: 180, vx: 4, vy: 3, r: 6 };

function resetBall() {
  ball.x = 250;
  ball.y = 180;
  ball.vx = (ball.vx > 0 ? -1 : 1) * 4.5;
  ball.vy = (Math.random() - 0.5) * 6;
}

window.addEventListener('mousemove', e => {
  const rect = c.getBoundingClientRect();
  p1.y = Math.max(0, Math.min(c.height - p1.h, e.clientY - rect.top - p1.h/2));
});

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
  if (keys['KeyW'] || keys['ArrowUp']) p1.y = Math.max(0, p1.y - 6);
  if (keys['KeyS'] || keys['ArrowDown']) p1.y = Math.min(c.height - p1.h, p1.y + 6);

  // AI
  if (ball.y < p2.y + p2.h/2 - 10) p2.y -= p2.speed;
  else if (ball.y > p2.y + p2.h/2 + 10) p2.y += p2.speed;
  p2.y = Math.max(0, Math.min(c.height - p2.h, p2.y));

  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom bounce
  if (ball.y - ball.r < 0 || ball.y + ball.r > c.height) ball.vy *= -1;

  // P1 Hit
  if (ball.x - ball.r <= 20 + p1.w && ball.y >= p1.y && ball.y <= p1.y + p1.h) {
    ball.vx = Math.abs(ball.vx) * 1.05;
    ball.vy = ((ball.y - (p1.y + p1.h/2)) / (p1.h/2)) * 5;
  }

  // P2 Hit
  if (ball.x + ball.r >= c.width - 20 - p2.w && ball.y >= p2.y && ball.y <= p2.y + p2.h) {
    ball.vx = -Math.abs(ball.vx) * 1.05;
    ball.vy = ((ball.y - (p2.y + p2.h/2)) / (p2.h/2)) * 5;
  }

  // Scores
  if (ball.x < 0) {
    p2.score++;
    p2El.innerText = p2.score;
    resetBall();
  } else if (ball.x > c.width) {
    p1.score++;
    p1El.innerText = p1.score;
    resetBall();
  }
}

function draw() {
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, c.width, c.height);

  // Center net
  ctx.strokeStyle = '#27272a';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(c.width/2, 0);
  ctx.lineTo(c.width/2, c.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Paddles
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(20, p1.y, p1.w, p1.h);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(c.width - 20 - p2.w, p2.y, p2.w, p2.h);

  // Ball
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
</script>
</body>
</html>`,

  tetris: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0b0f19; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  .game-wrap { display: flex; gap: 16px; align-items: flex-start; }
  canvas { background: #111827; border: 2px solid #374151; border-radius: 8px; }
  .sidebar { display: flex; flex-direction: column; gap: 12px; }
  .panel { background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 12px; min-width: 120px; }
  .panel .title { font-size: 11px; text-transform: uppercase; color: #9ca3af; font-weight: bold; }
  .panel .val { font-size: 22px; font-weight: 800; color: #38bdf8; }
  button { background: #6366f1; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; }
</style>
</head>
<body>
<div class="game-wrap">
  <canvas id="c" width="240" height="480"></canvas>
  <div class="sidebar">
    <div class="panel">
      <div class="title">Score</div>
      <div class="val" id="score">0</div>
    </div>
    <div class="panel">
      <div class="title">Lines</div>
      <div class="val" id="lines">0</div>
    </div>
    <button onclick="resetGame()">Restart</button>
    <div style="font-size: 12px; color: #9ca3af; line-height: 1.4;">
      &larr; &rarr; Move<br>
      &uarr; Rotate<br>
      &darr; Soft Drop<br>
      Space Hard Drop
    </div>
  </div>
</div>
<script>
const c = document.getElementById('c'), ctx = c.getContext('2d');
const scoreEl = document.getElementById('score'), linesEl = document.getElementById('lines');

const COLS = 10, ROWS = 20, BLOCK = 24;
const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,0],[1,1,1]], // T
  [[1,0,0],[1,1,1]], // L
  [[0,0,1],[1,1,1]], // J
  [[0,1,1],[1,1,0]], // S
  [[1,1,0],[0,1,1]]  // Z
];
const COLORS = ['#06b6d4', '#eab308', '#a855f7', '#f97316', '#3b82f6', '#22c55e', '#ef4444'];

let board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
let current = null, dropTimer = 0, score = 0, lines = 0, gameOver = false;

function newPiece() {
  const type = Math.floor(Math.random() * SHAPES.length);
  current = {
    shape: SHAPES[type],
    color: COLORS[type],
    x: Math.floor(COLS/2) - Math.floor(SHAPES[type][0].length/2),
    y: 0
  };
  if (collides(current.x, current.y, current.shape)) {
    gameOver = true;
  }
}

function collides(x, y, shape) {
  for (let r = 0; r < shape.length; r++) {
    for (let col = 0; col < shape[r].length; col++) {
      if (shape[r][col]) {
        let newX = x + col, newY = y + r;
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
        if (newY >= 0 && board[newY][newX]) return true;
      }
    }
  }
  return false;
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function merge() {
  current.shape.forEach((row, r) => {
    row.forEach((val, col) => {
      if (val && current.y + r >= 0) {
        board[current.y + r][current.x + col] = current.color;
      }
    });
  });

  // Clear rows
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(v => v !== 0)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++;
      r++;
    }
  }
  if (cleared > 0) {
    lines += cleared;
    score += [0, 100, 300, 500, 800][cleared];
    scoreEl.innerText = score;
    linesEl.innerText = lines;
  }
  newPiece();
}

function resetGame() {
  board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
  score = 0; lines = 0; gameOver = false;
  scoreEl.innerText = '0';
  linesEl.innerText = '0';
  newPiece();
}

window.addEventListener('keydown', e => {
  if (gameOver) return;
  if (e.code === 'ArrowLeft' && !collides(current.x - 1, current.y, current.shape)) current.x--;
  if (e.code === 'ArrowRight' && !collides(current.x + 1, current.y, current.shape)) current.x++;
  if (e.code === 'ArrowDown') {
    if (!collides(current.x, current.y + 1, current.shape)) current.y++;
  }
  if (e.code === 'ArrowUp') {
    let r = rotate(current.shape);
    if (!collides(current.x, current.y, r)) current.shape = r;
  }
  if (e.code === 'Space') {
    while (!collides(current.x, current.y + 1, current.shape)) current.y++;
    merge();
  }
});

let lastTime = 0;
function loop(time = 0) {
  const dt = time - lastTime;
  lastTime = time;

  if (!gameOver) {
    dropTimer += dt;
    if (dropTimer > 500) {
      if (!collides(current.x, current.y + 1, current.shape)) {
        current.y++;
      } else {
        merge();
      }
      dropTimer = 0;
    }
  }

  // Draw
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, c.width, c.height);

  // Board
  for (let r = 0; r < ROWS; r++) {
    for (let col = 0; col < COLS; col++) {
      if (board[r][col]) {
        ctx.fillStyle = board[r][col];
        ctx.fillRect(col * BLOCK, r * BLOCK, BLOCK - 1, BLOCK - 1);
      }
    }
  }

  // Active Piece
  if (current && !gameOver) {
    ctx.fillStyle = current.color;
    current.shape.forEach((row, r) => {
      row.forEach((val, col) => {
        if (val) {
          ctx.fillRect((current.x + col) * BLOCK, (current.y + r) * BLOCK, BLOCK - 1, BLOCK - 1);
        }
      });
    });
  }

  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', c.width / 2, c.height / 2);
  }

  requestAnimationFrame(loop);
}

resetGame();
loop();
</script>
</body>
</html>`,

  minesweeper: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #09090b; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  .header { display: flex; justify-content: space-between; align-items: center; width: 320px; background: #18181b; padding: 10px 16px; border-radius: 8px 8px 0 0; border: 2px solid #27272a; border-bottom: none; }
  .board { display: grid; grid-template-columns: repeat(10, 32px); background: #27272a; padding: 4px; border: 2px solid #27272a; border-radius: 0 0 8px 8px; }
  .cell { width: 32px; height: 32px; background: #3f3f46; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; cursor: pointer; border: 1px solid #27272a; border-radius: 3px; }
  .cell:hover { background: #52525b; }
  .cell.revealed { background: #18181b; cursor: default; }
  .cell.mine { background: #ef4444; }
  .cell.flagged { color: #f59e0b; }
  .c-1 { color: #38bdf8; } .c-2 { color: #4ade80; } .c-3 { color: #f87171; } .c-4 { color: #818cf8; }
  button { background: #27272a; border: 1px solid #3f3f46; color: white; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 18px; }
</style>
</head>
<body>
<div class="header">
  <div style="font-weight: bold; color: #ef4444;">💣 <span id="mines">15</span></div>
  <button id="face" onclick="init()">😊</button>
  <div style="font-weight: bold; color: #38bdf8;">⏱ <span id="timer">0</span></div>
</div>
<div class="board" id="board" oncontextmenu="return false;"></div>
<div style="margin-top: 12px; color: #a1a1aa; font-size: 13px;">Left Click to Reveal &bull; Right Click / Long Press to Flag</div>
<script>
const SIZE = 10, MINES = 15;
let grid = [], revealed = [], flagged = [], gameOver = false, time = 0, timer = null;

function init() {
  clearInterval(timer);
  time = 0;
  gameOver = false;
  document.getElementById('timer').innerText = '0';
  document.getElementById('face').innerText = '😊';
  document.getElementById('mines').innerText = MINES;

  grid = Array.from({length: SIZE}, () => Array(SIZE).fill(0));
  revealed = Array.from({length: SIZE}, () => Array(SIZE).fill(false));
  flagged = Array.from({length: SIZE}, () => Array(SIZE).fill(false));

  // Place mines
  let placed = 0;
  while (placed < MINES) {
    let r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
    if (grid[r][c] !== 'M') {
      grid[r][c] = 'M';
      placed++;
    }
  }

  // Calculate numbers
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 'M') continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (r+dr >= 0 && r+dr < SIZE && c+dc >= 0 && c+dc < SIZE && grid[r+dr][c+dc] === 'M') count++;
        }
      }
      grid[r][c] = count;
    }
  }

  timer = setInterval(() => { time++; document.getElementById('timer').innerText = time; }, 1000);
  render();
}

function reveal(r, c) {
  if (gameOver || revealed[r][c] || flagged[r][c]) return;
  revealed[r][c] = true;

  if (grid[r][c] === 'M') {
    gameOver = true;
    clearInterval(timer);
    document.getElementById('face').innerText = '😵';
    // Reveal all mines
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === 'M') revealed[i][j] = true;
      }
    }
    render();
    return;
  }

  if (grid[r][c] === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (r+dr >= 0 && r+dr < SIZE && c+dc >= 0 && c+dc < SIZE) {
          reveal(r+dr, c+dc);
        }
      }
    }
  }

  // Check win
  let unrevealedSafe = 0;
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (!revealed[i][j] && grid[i][j] !== 'M') unrevealedSafe++;
    }
  }
  if (unrevealedSafe === 0) {
    gameOver = true;
    clearInterval(timer);
    document.getElementById('face').innerText = '😎';
  }

  render();
}

function toggleFlag(r, c) {
  if (gameOver || revealed[r][c]) return;
  flagged[r][c] = !flagged[r][c];
  let flagsCount = flagged.flat().filter(Boolean).length;
  document.getElementById('mines').innerText = MINES - flagsCount;
  render();
}

function render() {
  const b = document.getElementById('board');
  b.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (revealed[r][c]) {
        cell.classList.add('revealed');
        if (grid[r][c] === 'M') {
          cell.classList.add('mine');
          cell.innerText = '💣';
        } else if (grid[r][c] > 0) {
          cell.classList.add('c-' + grid[r][c]);
          cell.innerText = grid[r][c];
        }
      } else if (flagged[r][c]) {
        cell.classList.add('flagged');
        cell.innerText = '🚩';
      }

      cell.onclick = () => reveal(r, c);
      cell.oncontextmenu = (e) => { e.preventDefault(); toggleFlag(r, c); };
      b.appendChild(cell);
    }
  }
}

init();
</script>
</body>
</html>`
};
