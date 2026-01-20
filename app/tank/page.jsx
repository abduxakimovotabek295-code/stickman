"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const LaserTanks = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [p1Ammo, setP1Ammo] = useState(5);
  const [p2Ammo, setP2Ammo] = useState(5);
  const [gameMode, setGameMode] = useState(null); // null, 'bot', 'pvp'

  useEffect(() => {
    if (!gameMode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const bases = {
      p1: { x: 50, y: 50, w: 180, h: 180, color: "rgba(0, 210, 255, 0.2)" },
      p2: {
        x: window.innerWidth - 230,
        y: window.innerHeight - 230,
        w: 180,
        h: 180,
        color: "rgba(255, 71, 87, 0.2)",
      },
    };

    const createTank = (x, y, angle, color) => ({
      x,
      y,
      angle,
      color,
      bullets: [],
      ammo: 5,
      alive: true,
      respawnTimer: 0,
      size: 1,
      power: null,
      powerTimer: 0,
      shield: false,
    });

    const p1 = createTank(140, 140, 0, "#00d2ff");
    const p2 = createTank(
      window.innerWidth - 140,
      window.innerHeight - 140,
      Math.PI,
      "#ff4757"
    );

    let airdrop = null;
    let plane = { x: -200, y: 150, active: false, speed: 6 };
    let p1Moving = false;
    let p2Moving = false;

    const isInBase = (tx, ty, b) =>
      tx >= b.x && tx <= b.x + b.w && ty >= b.y && ty <= b.y + b.h;

    const drawBullet = (b, color) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.atan2(b.vy, b.vx));
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(-6, -2, 12, 4);
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.restore();
    };

    const handleInput = (e) => {
      // P1 Controls (Space & Mouse)
      if (e.code === "Space") p1Moving = true;
      if (e.type === "mousedown" && p1.alive) {
        if (p1.ammo > 0 || p1.power === "infinite") {
          p1.bullets.push({
            x: p1.x,
            y: p1.y,
            vx: Math.cos(p1.angle) * 8,
            vy: Math.sin(p1.angle) * 8,
            b: 0,
          });
          if (p1.power !== "infinite") p1.ammo--;
          setP1Ammo(p1.ammo);
        }
      }

      // P2 Controls (ArrowUp & Enter)
      if (gameMode === "pvp") {
        if (e.code === "ArrowUp") p2Moving = true;
        if (e.code === "Enter" && p2.alive) {
          if (p2.ammo > 0 || p2.power === "infinite") {
            p2.bullets.push({
              x: p2.x,
              y: p2.y,
              vx: Math.cos(p2.angle) * 8,
              vy: Math.sin(p2.angle) * 8,
              b: 0,
            });
            if (p2.power !== "infinite") p2.ammo--;
            setP2Ammo(p2.ammo);
          }
        }
      }
    };

    const stopInput = (e) => {
      if (e.code === "Space") p1Moving = false;
      if (e.code === "ArrowUp") p2Moving = false;
    };

    window.addEventListener("keydown", handleInput);
    window.addEventListener("keyup", stopInput);
    canvas.addEventListener("mousedown", handleInput);

    const logic = setInterval(() => {
      if (p1.ammo < 5) {
        p1.ammo++;
        setP1Ammo(p1.ammo);
      }
      if (p2.ammo < 5) {
        p2.ammo++;
        setP2Ammo(p2.ammo);
      }
      if (!plane.active && Math.random() > 0.4) {
        plane.active = true;
        plane.x = -200;
        plane.y = Math.random() * (canvas.height - 300) + 150;
      }
    }, 2500);

    const update = () => {
      ctx.fillStyle = "#0a0e17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Bases
      Object.values(bases).forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
      });

      // Plane & Airdrop
      if (plane.active) {
        plane.x += plane.speed;
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(plane.x, plane.y, 60, 15);
        if (Math.abs(plane.x - canvas.width / 2) < plane.speed && !airdrop) {
          airdrop = {
            x: plane.x,
            y: plane.y,
            vy: 2,
            landed: false,
            type: ["shield", "small", "infinite"][
              Math.floor(Math.random() * 3)
            ],
          };
        }
        if (plane.x > canvas.width + 200) plane.active = false;
      }

      if (airdrop) {
        if (!airdrop.landed) {
          airdrop.y += airdrop.vy;
          if (airdrop.y > canvas.height * 0.7) airdrop.landed = true;
        }
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(airdrop.x, airdrop.y, 30, 30);
        ctx.fillStyle = "white";
        ctx.fillText("?", airdrop.x + 10, airdrop.y + 22);
      }

      const process = (p, isP1) => {
        if (!p.alive) {
          p.respawnTimer--;
          if (p.respawnTimer <= 0) {
            p.alive = true;
            p.size = 1;
            p.shield = false;
            p.power = null;
            p.x = isP1 ? 140 : canvas.width - 140;
            p.y = isP1 ? 140 : canvas.height - 140;
          }
          return;
        }

        // MOVEMENT LOGIC
        if (isP1) {
          if (p1Moving) {
            p.x += Math.cos(p.angle) * 3.5;
            p.y += Math.sin(p.angle) * 3.5;
          } else p.angle += 0.06;
        } else {
          if (gameMode === "bot") {
            // BOT AI
            const targetAngle = Math.atan2(p1.y - p.y, p1.x - p.x);
            let diff = targetAngle - p.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            p.angle += diff * 0.04;
            p.x += Math.cos(p.angle) * 2.2;
            p.y += Math.sin(p.angle) * 2.2;
            if (p.ammo > 0 && Math.abs(diff) < 0.3 && Math.random() > 0.98) {
              p.bullets.push({
                x: p.x,
                y: p.y,
                vx: Math.cos(p.angle) * 8,
                vy: Math.sin(p.angle) * 8,
                b: 0,
              });
              p.ammo--;
              setP2Ammo(p.ammo);
            }
          } else {
            // PLAYER 2
            if (p2Moving) {
              p.x += Math.cos(p.angle) * 3.5;
              p.y += Math.sin(p.angle) * 3.5;
            } else p.angle += 0.06;
          }
        }

        // Powerup Check
        if (airdrop && Math.hypot(p.x - airdrop.x, p.y - airdrop.y) < 40) {
          p.power = airdrop.type;
          p.powerTimer = 600;
          if (p.power === "shield") p.shield = true;
          if (p.power === "small") p.size = 0.5;
          airdrop = null;
        }

        // Bullets Logic
        p.bullets.forEach((b, i) => {
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < 0 || b.x > canvas.width) {
            b.vx *= -1;
            b.b++;
          }
          if (b.y < 0 || b.y > canvas.height) {
            b.vy *= -1;
            b.b++;
          }

          drawBullet(b, p.color);

          const target = isP1 ? p2 : p1;
          const targetInSafe = isP1
            ? isInBase(p2.x, p2.y, bases.p2)
            : isInBase(p1.x, p1.y, bases.p1);

          if (
            target.alive &&
            !targetInSafe &&
            Math.hypot(b.x - target.x, b.y - target.y) <
              (target.shield ? 45 : 25 * target.size)
          ) {
            if (target.shield) {
              target.shield = false;
              target.power = null;
            } else {
              target.alive = false;
              target.respawnTimer = 120;
              setScore((s) => ({
                ...s,
                [isP1 ? "p1" : "p2"]: s[isP1 ? "p1" : "p2"] + 1,
              }));
            }
            p.bullets.splice(i, 1);
          }
          if (b.b >= 2) p.bullets.splice(i, 1);
        });

        // Draw Tank
        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.shield) {
          ctx.beginPath();
          ctx.arc(0, 0, 45, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
          ctx.stroke();
        }
        ctx.scale(p.size, p.size);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-18, -14, 36, 28);
        ctx.fillStyle = "white";
        ctx.fillRect(15, -3, 15, 6);
        ctx.restore();
      };

      process(p1, true);
      process(p2, false);
      requestAnimationFrame(update);
    };

    const anim = requestAnimationFrame(update);
    return () => {
      clearInterval(logic);
      cancelAnimationFrame(anim);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleInput);
      window.removeEventListener("keyup", stopInput);
    };
  }, [gameMode]);

  if (!gameMode) {
    return (
      <div style={styles.overlay}>
        <h1 style={{ color: "white", fontSize: "3rem" }}>LASER TANKS</h1>
        <button onClick={() => setGameMode("bot")} style={styles.menuBtn}>
          1 PLAYER (VS BOT)
        </button>
        <button onClick={() => setGameMode("pvp")} style={styles.menuBtn}>
          2 PLAYERS (PVP)
        </button>
        <Link href="/">
          <button style={{ ...styles.menuBtn, background: "#4b5563" }}>
            BACK
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.gui}>
        <button onClick={() => setGameMode(null)} style={styles.backBtn}>
          ← MENU
        </button>
        <div style={{ color: "#00d2ff" }}>
          P1: {score.p1} | AMMO: {p1Ammo}
        </div>
        <div style={{ color: "#ff4757" }}>
          {gameMode === "bot" ? "BOT" : "P2"}: {score.p2} | AMMO: {p2Ammo}
        </div>
      </div>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "#0a0e17",
  },
  gui: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "70px",
    background: "rgba(15,23,42,0.8)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    zIndex: 10,
  },
  overlay: {
    width: "100vw",
    height: "100vh",
    background: "#0a0e17",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  menuBtn: {
    width: "250px",
    padding: "15px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  backBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  canvas: { width: "100%", height: "100%", display: "block" },
};

export default LaserTanks;
