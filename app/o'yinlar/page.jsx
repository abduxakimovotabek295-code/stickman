"use client";
import { useEffect, useRef, useState } from "react";

export default function UltimateGameHub() {
  const canvasRef = useRef(null);
  const [activeGame, setActiveGame] = useState(null);
  const [score, setScore] = useState(0);
  const [isTwoPlayer, setIsTwoPlayer] = useState(false); // Pong uchun rejim

  const boxSize = 20;

  const games = [
    {
      id: "snake",
      name: "Snake",
      icon: "🐍",
      color: "#2ecc71",
      desc: "Klassik ilon o'yini",
    },
    {
      id: "pong",
      name: "Pong",
      icon: "🏓",
      color: "#3498db",
      desc: "Bot yoki 2 kishilik jang",
    },
    {
      id: "boxcatch",
      name: "Box Catch",
      icon: "📦",
      color: "#e67e22",
      desc: "Tezkor qutini tut",
    },
    {
      id: "runner",
      name: "Runner",
      icon: "🏃",
      color: "#f1c40f",
      desc: "To'siqlardan sakra",
    },
    {
      id: "shooter",
      name: "Star Strike Pro",
      icon: "🚀",
      color: "#a855f7",
      desc: "Boss Battle Edition",
    },
    {
      id: "nebulous",
      name: "Nebulous",
      icon: "🌌",
      color: "#9333ea",
      desc: "Kattalash va hammani ye!",
    },
    {
      id: "towerdefense",
      name: "Tower Defense",
      icon: "🎖️",
      color: "#f43f5e",
      desc: "Tank va samolyotlar hujumi",
    },
  ];

  // --- 1. Snake Logic (O'zgarishsiz) ---
  const runSnakeGame = (canvas, ctx) => {
    let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
    let dir = "RIGHT";
    let food = {
      x: Math.floor(Math.random() * 19) * boxSize,
      y: Math.floor(Math.random() * 19) * boxSize,
    };
    setScore(0);
    const keyHandler = (e) => {
      if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
      if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
      if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
      if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
    };
    document.addEventListener("keydown", keyHandler);
    const loop = setInterval(() => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#00ff88" : "#00aa66";
        ctx.fillRect(p.x, p.y, boxSize - 1, boxSize - 1);
      });
      ctx.fillStyle = "#ff4444";
      ctx.fillRect(food.x, food.y, boxSize - 1, boxSize - 1);
      let hX = snake[0].x,
        hY = snake[0].y;
      if (dir === "LEFT") hX -= boxSize;
      if (dir === "UP") hY -= boxSize;
      if (dir === "RIGHT") hX += boxSize;
      if (dir === "DOWN") hY += boxSize;
      if (hX < 0) hX = canvas.width - boxSize;
      else if (hX >= canvas.width) hX = 0;
      if (hY < 0) hY = canvas.height - boxSize;
      else if (hY >= canvas.height) hY = 0;
      const nH = { x: hX, y: hY };
      if (snake.some((p) => p.x === nH.x && p.y === nH.y)) {
        clearInterval(loop);
        setActiveGame(null);
      }
      if (hX === food.x && hY === food.y) {
        setScore((s) => s + 1);
        food = {
          x: Math.floor(Math.random() * 19) * boxSize,
          y: Math.floor(Math.random() * 19) * boxSize,
        };
      } else snake.pop();
      snake.unshift(nH);
    }, 120);
    return () => {
      clearInterval(loop);
      document.removeEventListener("keydown", keyHandler);
    };
  };

  // --- 2. Pong Logic (YANGILANGAN: 2 kishilik rejim qo'shildi) ---
  const runPongGame = (canvas, ctx) => {
    let p1Y = 160,
      p2Y = 160;
    let ball = { x: 300, y: 200, vx: 4, vy: 4 };
    let keys = {};
    setScore(0);

    const handleKeyDown = (e) => (keys[e.code] = true);
    const handleKeyUp = (e) => (keys[e.code] = false);
    const moveMouse = (e) => {
      if (!isTwoPlayer) {
        const rect = canvas.getBoundingClientRect();
        p1Y = e.clientY - rect.top - 40;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", moveMouse);

    const loop = setInterval(() => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Boshqaruv
      if (isTwoPlayer) {
        if (keys["KeyW"]) p1Y -= 6;
        if (keys["KeyS"]) p1Y += 6;
        if (keys["ArrowUp"]) p2Y -= 6;
        if (keys["ArrowDown"]) p2Y += 6;
      } else {
        // Bot harakati
        if (p2Y + 40 < ball.y) p2Y += 3.8;
        else p2Y -= 3.8;
      }

      // Chegaralarni ushlash
      p1Y = Math.max(0, Math.min(canvas.height - 80, p1Y));
      p2Y = Math.max(0, Math.min(canvas.height - 80, p2Y));

      ctx.fillStyle = "#3498db";
      ctx.fillRect(10, p1Y, 15, 80); // Chap
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(canvas.width - 25, p2Y, 15, 80); // O'ng

      // To'p
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y <= 0 || ball.y >= canvas.height) ball.vy *= -1;

      // To'qnashuv
      if (
        (ball.x <= 25 && ball.y > p1Y && ball.y < p1Y + 80) ||
        (ball.x >= canvas.width - 25 && ball.y > p2Y && ball.y < p2Y + 80)
      ) {
        ball.vx *= -1.05;
        setScore((s) => s + 1);
      }

      if (ball.x < 0 || ball.x > canvas.width) {
        clearInterval(loop);
        setActiveGame(null);
      }
    }, 1000 / 60);

    return () => {
      clearInterval(loop);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", moveMouse);
    };
  };

  // --- QOLGAN O'YINLAR (Sizniki - O'zgarishsiz) ---
  const runBoxCatch = (canvas, ctx) => {
    let playerX = 270,
      boxes = [],
      localScore = 0;
    setScore(0);
    const move = (e) => {
      const rect = canvas.getBoundingClientRect();
      playerX = e.clientX - rect.left - 30;
    };
    canvas.addEventListener("mousemove", move);
    const loop = setInterval(() => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.05)
        boxes.push({ x: Math.random() * (canvas.width - 20), y: 0 });
      ctx.fillStyle = "#e67e22";
      ctx.fillRect(playerX, canvas.height - 30, 60, 20);
      boxes.forEach((b, i) => {
        b.y += 5;
        ctx.fillStyle = "#fff";
        ctx.fillRect(b.x, b.y, 20, 20);
        if (b.y > canvas.height - 50 && b.x > playerX && b.x < playerX + 60) {
          boxes.splice(i, 1);
          localScore++;
          setScore(localScore);
        } else if (b.y > canvas.height) {
          clearInterval(loop);
          setActiveGame(null);
        }
      });
    }, 1000 / 60);
    return () => {
      clearInterval(loop);
      canvas.removeEventListener("mousemove", move);
    };
  };

  const runRunner = (canvas, ctx) => {
    let playerY = 350,
      velocityY = 0,
      obstacles = [],
      frame = 0,
      localScore = 0;
    setScore(0);
    const jump = () => {
      if (playerY === 350) velocityY = -15;
    };
    const handleJump = (e) => {
      if (e.code === "Space") jump();
    };
    window.addEventListener("keydown", handleJump);
    canvas.addEventListener("click", jump);
    const loop = setInterval(() => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      velocityY += 0.8;
      playerY += velocityY;
      if (playerY > 350) {
        playerY = 350;
        velocityY = 0;
      }
      if (frame % 100 === 0)
        obstacles.push({ x: canvas.width, w: 20 + Math.random() * 30 });
      ctx.fillStyle = "#f1c40f";
      ctx.fillRect(50, playerY, 30, 30);
      obstacles.forEach((o, i) => {
        o.x -= 6;
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(o.x, 350, o.w, 30);
        if (o.x < 80 && o.x + o.w > 50 && playerY > 320) {
          clearInterval(loop);
          setActiveGame(null);
        }
        if (o.x < -o.w) {
          obstacles.splice(i, 1);
          localScore++;
          setScore(localScore);
        }
      });
      frame++;
    }, 1000 / 60);
    return () => {
      clearInterval(loop);
      window.removeEventListener("keydown", handleJump);
    };
  };

  const runShooter = (canvas, ctx) => {
    let ship = { x: canvas.width / 2, y: canvas.height - 70, w: 45, h: 50 };
    let bullets = [],
      enemyBullets = [],
      enemies = [],
      powers = [],
      frame = 0,
      localScore = 0,
      weaponCount = 1,
      boss = null;
    setScore(0);
    const move = (e) => {
      const rect = canvas.getBoundingClientRect();
      ship.x = e.clientX - rect.left - ship.w / 2;
    };
    const drawPlane = (x, y, color, isBoss = false) => {
      const scale = isBoss ? 3 : 1;
      ctx.fillStyle = color;
      ctx.fillRect(x + 15 * scale, y, 10 * scale, 40 * scale);
      ctx.fillRect(x, y + 10 * scale, 40 * scale, 10 * scale);
    };
    canvas.addEventListener("mousemove", move);
    const loop = setInterval(() => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (frame % 15 === 0) {
        for (let i = 0; i < weaponCount; i++) {
          let offset = (i - (weaponCount - 1) / 2) * 15;
          bullets.push({ x: ship.x + ship.w / 2 + offset, y: ship.y, vy: -10 });
        }
      }
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.w / 2, ship.y);
      ctx.lineTo(ship.x, ship.y + ship.h);
      ctx.lineTo(ship.x + ship.w, ship.y + ship.h);
      ctx.fill();
      bullets.forEach((b, i) => {
        b.y += b.vy;
        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
        ctx.fill();
        if (b.y < 0) bullets.splice(i, 1);
      });
      if (localScore >= 2000 && !boss)
        boss = {
          x: canvas.width / 2 - 60,
          y: -150,
          hp: 100,
          maxHp: 100,
          dir: 1,
        };
      if (boss) {
        if (boss.y < 50) boss.y += 1;
        boss.x += 2 * boss.dir;
        if (boss.x > canvas.width - 120 || boss.x < 0) boss.dir *= -1;
        drawPlane(boss.x, boss.y, "#f43f5e", true);
        if (frame % 40 === 0)
          enemyBullets.push({ x: boss.x + 60, y: boss.y + 100, vy: 5 });
        bullets.forEach((b, bi) => {
          if (
            b.x > boss.x &&
            b.x < boss.x + 120 &&
            b.y > boss.y &&
            b.y < boss.y + 120
          ) {
            boss.hp -= 1;
            bullets.splice(bi, 1);
            if (boss.hp <= 0) {
              alert("G'ALABA!");
              setActiveGame(null);
            }
          }
        });
      }
      if (!boss && frame % 60 === 0)
        enemies.push({
          x: Math.random() * (canvas.width - 40),
          y: -50,
          targetY: 50 + Math.random() * 150,
          cooldown: 0,
        });
      enemies.forEach((e, i) => {
        if (e.y < e.targetY) e.y += 2;
        e.cooldown++;
        if (e.cooldown > 100) {
          enemyBullets.push({ x: e.x + 20, y: e.y + 40, vy: 4 });
          e.cooldown = 0;
        }
        drawPlane(e.x, e.y, "#fb923c");
        bullets.forEach((b, bi) => {
          if (b.x > e.x && b.x < e.x + 40 && b.y > e.y && b.y < e.y + 40) {
            if (Math.random() > 0.7)
              powers.push({ x: e.x + 20, y: e.y + 20, vy: 2 });
            enemies.splice(i, 1);
            bullets.splice(bi, 1);
            localScore += 25;
            setScore(localScore);
          }
        });
      });
      enemyBullets.forEach((eb, i) => {
        eb.y += eb.vy;
        ctx.fillStyle = "#ff4444";
        ctx.beginPath();
        ctx.arc(eb.x, eb.y, 5, 0, Math.PI * 2);
        ctx.fill();
        if (
          eb.x > ship.x &&
          eb.x < ship.x + ship.w &&
          eb.y > ship.y &&
          eb.y < ship.y + ship.h
        ) {
          clearInterval(loop);
          setActiveGame(null);
        }
      });
      powers.forEach((p, i) => {
        p.y += p.vy;
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fill();
        if (
          p.x > ship.x &&
          p.x < ship.x + ship.w &&
          p.y > ship.y &&
          p.y < ship.y + ship.h
        ) {
          weaponCount++;
          powers.splice(i, 1);
        }
      });
      frame++;
    }, 1000 / 60);
    return () => {
      clearInterval(loop);
      canvas.removeEventListener("mousemove", move);
    };
  };

  const runNebulous = (canvas, ctx) => {
    let player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: 15,
      color: "#a855f7",
    };
    let dots = [],
      enemies = [],
      localScore = 0;
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    setScore(0);
    const move = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", move);
    const loop = setInterval(() => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (dots.length < 60)
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 3,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        });
      if (enemies.length < 6)
        enemies.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 10 + Math.random() * player.r * 1.5,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: "#ef4444",
        });
      player.x += (mouse.x - player.x) * 0.08;
      player.y += (mouse.y - player.y) * 0.08;
      dots.forEach((dot, i) => {
        ctx.fillStyle = dot.color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
        if (Math.hypot(player.x - dot.x, player.y - dot.y) < player.r) {
          dots.splice(i, 1);
          player.r += 0.3;
          localScore += 5;
          setScore(localScore);
        }
      });
      enemies.forEach((en, i) => {
        en.x += en.vx;
        en.y += en.vy;
        if (en.x < 0 || en.x > canvas.width) en.vx *= -1;
        if (en.y < 0 || en.y > canvas.height) en.vy *= -1;
        ctx.fillStyle = en.color;
        ctx.beginPath();
        ctx.arc(en.x, en.y, en.r, 0, Math.PI * 2);
        ctx.fill();
        let dist = Math.hypot(player.x - en.x, player.y - en.y);
        if (dist < player.r + en.r * 0.8) {
          if (player.r > en.r * 1.1) {
            player.r += en.r * 0.2;
            enemies.splice(i, 1);
            localScore += 100;
            setScore(localScore);
          } else if (en.r > player.r * 1.1) {
            clearInterval(loop);
            alert("Score: " + localScore);
            setActiveGame(null);
          }
        }
      });
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
      ctx.fill();
    }, 1000 / 60);
    return () => {
      clearInterval(loop);
      canvas.removeEventListener("mousemove", move);
    };
  };

  const runTowerDefense = (canvas, ctx) => {
    let money = 200,
      health = 10,
      enemies = [],
      towers = [],
      bullets = [],
      wave = 0,
      frame = 0;
    setScore(0);
    const path = [
      { x: 0, y: 200 },
      { x: 250, y: 200 },
      { x: 250, y: 350 },
      { x: 550, y: 350 },
      { x: 550, y: 100 },
      { x: 800, y: 100 },
    ];
    const spawn = () => {
      wave++;
      for (let i = 0; i < 4 + wave; i++) {
        setTimeout(() => {
          if (!activeGame) return;
          const r = Math.random();
          let enemy = {
            x: 0,
            y: 200,
            targetIdx: 1,
            speed: 1.2,
            hp: 60 + wave * 20,
            maxHp: 60 + wave * 20,
            type: "soldier",
          };
          if (r > 0.8) {
            enemy.type = "plane";
            enemy.speed = 2.8;
            enemy.hp = 50;
            enemy.maxHp = 50;
            enemy.y = Math.random() * 250;
          } else if (r > 0.5) {
            enemy.type = "tank";
            enemy.speed = 0.8;
            enemy.hp = 180 + wave * 30;
            enemy.maxHp = 180 + wave * 30;
          }
          enemies.push(enemy);
        }, i * 1500);
      }
    };
    const drawEnemy = (e) => {
      if (e.type === "soldier") {
        ctx.fillStyle = "#ffdbac";
        ctx.beginPath();
        ctx.arc(e.x, e.y - 12, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4b5320";
        ctx.fillRect(e.x - 5, e.y - 8, 10, 12);
      } else if (e.type === "tank") {
        ctx.fillStyle = "#1b4332";
        ctx.fillRect(e.x - 18, e.y - 10, 36, 20);
        ctx.fillStyle = "#2d6a4f";
        ctx.fillRect(e.x - 10, e.y - 16, 20, 10);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(e.x, e.y - 12);
        ctx.lineTo(e.x + 22, e.y - 12);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.moveTo(e.x - 20, e.y);
        ctx.lineTo(e.x + 20, e.y);
        ctx.lineTo(e.x, e.y + 10);
        ctx.fill();
      }
      ctx.fillStyle = "red";
      ctx.fillRect(e.x - 15, e.y - 25, 30, 4);
      ctx.fillStyle = "lime";
      ctx.fillRect(e.x - 15, e.y - 25, (e.hp / e.maxHp) * 30, 4);
    };
    const click = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (money >= 75) {
        towers.push({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          range: 160,
          cd: 0,
        });
        money -= 75;
      }
    };
    canvas.addEventListener("click", click);
    const loop = setInterval(() => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 50;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      enemies.forEach((en, i) => {
        if (en.type === "plane") en.x += en.speed;
        else {
          let t = path[en.targetIdx];
          let d = Math.hypot(t.x - en.x, t.y - en.y);
          if (d < 4) {
            en.targetIdx++;
            if (en.targetIdx >= path.length) {
              enemies.splice(i, 1);
              health--;
              return;
            }
          } else {
            en.x += ((t.x - en.x) / d) * en.speed;
            en.y += ((t.y - en.y) / d) * en.speed;
          }
        }
        drawEnemy(en);
      });
      towers.forEach((t) => {
        if (t.cd > 0) t.cd--;
        else {
          let target = enemies.find(
            (en) => Math.hypot(en.x - t.x, en.y - t.y) < t.range
          );
          if (target) {
            bullets.push({ x: t.x, y: t.y - 20, target });
            t.cd = 30;
          }
        }
      });
      bullets.forEach((b, i) => {
        let d = Math.hypot(b.target.x - b.x, b.target.y - b.y);
        if (d < 10) {
          b.target.hp -= 25;
          if (b.target.hp <= 0) {
            enemies.splice(enemies.indexOf(b.target), 1);
            money += 20;
          }
          bullets.splice(i, 1);
        } else {
          b.x += ((b.target.x - b.x) / d) * 10;
          b.y += ((b.target.y - b.y) / d) * 10;
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      if (enemies.length === 0 && frame > 100) spawn();
      if (health <= 0) {
        alert("Game Over!");
        setActiveGame(null);
      }
      frame++;
    }, 1000 / 60);
    return () => {
      clearInterval(loop);
      canvas.removeEventListener("click", click);
    };
  };

  useEffect(() => {
    if (!activeGame) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const gameMap = {
      snake: runSnakeGame,
      pong: runPongGame,
      boxcatch: runBoxCatch,
      runner: runRunner,
      shooter: runShooter,
      nebulous: runNebulous,
      towerdefense: runTowerDefense,
    };
    return gameMap[activeGame](canvas, ctx);
  }, [activeGame, isTwoPlayer]);

  // --- UI RENDER ---
  return (
    <div style={styles.container}>
      <div style={styles.bgGradient}></div>
      <div style={styles.mesh}></div>
      {!activeGame ? (
        <div style={styles.homeContent}>
          <header style={styles.header}>
            <div style={styles.badge}>v2.1 Premium Edition</div>
            <h1 style={styles.mainTitle}>
              ULTIMATE <span style={styles.highlight}>ARCADE</span>
            </h1>
            <p style={styles.subtitle}>Eng sara 7 ta o'yin bitta portalda</p>
          </header>
          <div style={styles.gameGrid}>
            {games.map((g) => (
              <div
                key={g.id}
                style={styles.cardWrapper}
                onClick={() => setActiveGame(g.id)}
                className="game-card"
              >
                <div style={styles.gameCard}>
                  <div
                    style={{
                      ...styles.iconBox,
                      background: `linear-gradient(135deg, ${g.color}33, ${g.color}11)`,
                      color: g.color,
                    }}
                  >
                    {g.icon}
                  </div>
                  <h3 style={styles.cardName}>{g.name}</h3>
                  <p style={styles.cardDesc}>{g.desc}</p>
                  <button
                    style={{
                      ...styles.playBtn,
                      boxShadow: `0 0 20px ${g.color}44`,
                      border: `1px solid ${g.color}`,
                    }}
                  >
                    START MISSION
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={styles.gameWrapper}>
          <div style={styles.gameHeader}>
            <button
              onClick={() => setActiveGame(null)}
              style={styles.backButton}
            >
              ← CHIQISH
            </button>
            <div style={styles.scoreBoard}>
              <span style={styles.scoreValue}>{score}</span>
              <span style={styles.scoreLabel}>POINTS</span>
            </div>

            {/* Pong rejimi uchun tugma */}
            {activeGame === "pong" && (
              <div style={styles.modeToggle}>
                <button
                  onClick={() => setIsTwoPlayer(!isTwoPlayer)}
                  style={{
                    ...styles.modeBtn,
                    background: isTwoPlayer ? "#a855f7" : "#334155",
                  }}
                >
                  {isTwoPlayer ? "👤 2 PLAYER" : "🤖 VS BOT"}
                </button>
              </div>
            )}

            <div style={styles.activeGameTag}>
              <span
                style={{ color: games.find((g) => g.id === activeGame).color }}
              >
                ●
              </span>{" "}
              {activeGame.toUpperCase()}
            </div>
          </div>
          <div style={styles.canvasWrapper}>
            <canvas
              ref={canvasRef}
              width={
                activeGame === "shooter" ||
                activeGame === "nebulous" ||
                activeGame === "towerdefense"
                  ? 800
                  : 600
              }
              height={
                activeGame === "shooter" ||
                activeGame === "nebulous" ||
                activeGame === "towerdefense"
                  ? 500
                  : 400
              }
              style={styles.canvas}
            />
          </div>
          <div style={styles.controlsInfo}>
            {activeGame === "pong"
              ? isTwoPlayer
                ? "⌨️ Chap: W/S | O'ng: Yo'nalish tugmalari"
                : "🖱️ Chap raketkani sichqoncha bilan boshqaring"
              : activeGame === "towerdefense"
              ? "🏰 Askarlar o'rnatish uchun bosing ($75)"
              : "🎮 Boshqarish uchun sichqoncha/klaviaturadan foydalaning"}
          </div>
        </div>
      )}
      <style jsx>{`
        .game-card {
          transition: all 0.4s;
        }
        .game-card:hover {
          transform: translateY(-10px);
        }
        button {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#05050a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #05050a 100%)",
    zIndex: 0,
  },
  mesh: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    zIndex: 0,
  },
  homeContent: {
    width: "90%",
    maxWidth: "1200px",
    padding: "60px 20px",
    zIndex: 1,
  },
  header: { textAlign: "center", marginBottom: "70px" },
  badge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "20px",
    background: "rgba(168, 85, 247, 0.15)",
    color: "#a855f7",
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginBottom: "15px",
    border: "1px solid rgba(168, 85, 247, 0.3)",
  },
  mainTitle: {
    fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
    fontWeight: "900",
    margin: 0,
  },
  highlight: {
    background: "linear-gradient(90deg, #a855f7, #6366f1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: { color: "#94a3b8", fontSize: "1.2rem", marginTop: "10px" },
  gameGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
  },
  gameCard: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    borderRadius: "32px",
    padding: "40px 30px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  iconBox: {
    width: "90px",
    height: "90px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    marginBottom: "25px",
  },
  cardName: { fontSize: "1.6rem", fontWeight: "800", marginBottom: "12px" },
  cardDesc: { fontSize: "0.95rem", color: "#64748b", marginBottom: "30px" },
  playBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "16px",
    background: "transparent",
    color: "#fff",
    fontWeight: "bold",
  },
  gameWrapper: {
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "20px",
  },
  gameHeader: {
    width: "100%",
    maxWidth: "800px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "15px 25px",
    borderRadius: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  backButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "12px",
    fontWeight: "bold",
  },
  scoreBoard: { textAlign: "center" },
  scoreValue: { fontSize: "1.8rem", fontWeight: "900", display: "block" },
  scoreLabel: { fontSize: "0.6rem", color: "#64748b" },
  activeGameTag: { fontWeight: "bold", fontSize: "0.9rem" },
  canvasWrapper: {
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "28px",
  },
  canvas: { background: "#020617", borderRadius: "20px", display: "block" },
  controlsInfo: { marginTop: "20px", color: "#64748b", fontSize: "0.9rem" },
  modeBtn: {
    border: "none",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "10px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};
