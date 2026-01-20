"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const ProRacing = () => {
  const canvasRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameState = useRef({
    player: { lane: 2, x: 0, y: 0, speed: 0, targetSpeed: 8, color: "#00f2ff" },
    rivals: [],
    roadYOffset: 0,
    keys: {},
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const laneWidth = 110;
    const roadWidth = laneWidth * 5;
    const carHeight = 85;
    const carWidth = 42;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gameState.current.player.y = canvas.height - 150;
    };

    const setupRivals = () => {
      const roadX = (window.innerWidth - roadWidth) / 2;
      // TIRBANDLIK: Raqiblar soni 5 taga oshirildi
      gameState.current.rivals = Array(5)
        .fill()
        .map((_, i) => ({
          lane: Math.floor(Math.random() * 5),
          y: -500 - i * 300,
          speed: 3 + Math.random() * 4,
          color: ["#ff4757", "#2ed573", "#ffa502", "#e84393", "#badc58"][i],
        }));
    };

    resize();
    setupRivals();
    window.addEventListener("resize", resize);

    const handleKeyDown = (e) => (gameState.current.keys[e.code] = true);
    const handleKeyUp = (e) => (gameState.current.keys[e.code] = false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // MASHINA DIZAYNI (SPORT CAR)
    const drawSportCar = (x, y, color, isPlayer = false) => {
      ctx.save();
      ctx.translate(x, y);

      // Soya va Neon effekt
      ctx.shadowBlur = isPlayer ? 25 : 10;
      ctx.shadowColor = color;

      // 1. G'ildiraklar
      ctx.fillStyle = "#111";
      ctx.fillRect(-26, -35, 8, 18); // Old chap
      ctx.fillRect(18, -35, 8, 18); // Old o'ng
      ctx.fillRect(-26, 20, 8, 18); // Orqa chap
      ctx.fillRect(18, 20, 8, 18); // Orqa o'ng

      // 2. Korpus (Aerodinamik)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-22, 40); // Orqa chap
      ctx.lineTo(-22, -20);
      ctx.quadraticCurveTo(-22, -45, 0, -50); // Burun qismi
      ctx.quadraticCurveTo(22, -45, 22, -20);
      ctx.lineTo(22, 40);
      ctx.fill();

      // 3. Spoiler (Qanot)
      ctx.fillStyle = "#111";
      ctx.fillRect(-24, 35, 48, 8);

      // 4. Kapot va Tom
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.moveTo(-15, -10);
      ctx.lineTo(15, -10);
      ctx.lineTo(12, 25);
      ctx.lineTo(-12, 25);
      ctx.fill();

      // 5. Old Chiroqlar (Lazer)
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#fff";
      ctx.fillRect(-18, -42, 12, 4);
      ctx.fillRect(6, -42, 12, 4);

      // 6. O'yinchi uchun maxsus neon chiziq
      if (isPlayer) {
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-18, -44, 36, 86);
      }

      ctx.restore();
    };

    const update = () => {
      if (gameOver) return;

      const roadX = (canvas.width - roadWidth) / 2;
      const { player, rivals, keys } = gameState.current;

      // Input logic
      if (keys["ArrowLeft"] && player.lane > 0) {
        player.lane--;
        keys["ArrowLeft"] = false;
      }
      if (keys["ArrowRight"] && player.lane < 4) {
        player.lane++;
        keys["ArrowRight"] = false;
      }

      if (keys["ArrowUp"]) player.targetSpeed = 18;
      else if (keys["ArrowDown"]) player.targetSpeed = 4;
      else player.targetSpeed = 9;

      player.speed += (player.targetSpeed - player.speed) * 0.05;
      gameState.current.roadYOffset =
        (gameState.current.roadYOffset + player.speed) % 100;

      // Fon
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Yo'l asfaltti
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(roadX, 0, roadWidth, canvas.height);

      // Yo'l chiziqlari
      ctx.strokeStyle = "#475569";
      ctx.setLineDash([40, 60]);
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(roadX + i * laneWidth, gameState.current.roadYOffset - 100);
        ctx.lineTo(roadX + i * laneWidth, canvas.height + 100);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // O'yinchi
      const targetX = roadX + player.lane * laneWidth + laneWidth / 2;
      player.x += (targetX - player.x) * 0.18;
      drawSportCar(player.x, player.y, player.color, true);

      // Tirbandlik va To'qnashuv
      rivals.forEach((r) => {
        r.y += player.speed - r.speed;
        const rx = roadX + r.lane * laneWidth + laneWidth / 2;

        // Tirbandlikni cheksiz qilish
        if (r.y > canvas.height + 200) {
          r.y = -400;
          r.lane = Math.floor(Math.random() * 5);
          r.speed = 3 + Math.random() * 6;
        }

        // To'qnashuvni tekshirish
        const dx = Math.abs(player.x - rx);
        const dy = Math.abs(player.y - r.y);

        if (dx < carWidth && dy < carHeight) {
          setGameOver(true);
        }

        drawSportCar(rx, r.y, r.color);
      });

      setDistance((prev) => prev + player.speed / 60);
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver]);

  const restartGame = () => {
    gameState.current.player.lane = 2;
    gameState.current.player.speed = 0;
    setDistance(0);
    setGameOver(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.gui}>
        <Link href="/">
          <button style={styles.backBtn}>← EXIT</button>
        </Link>
        <div style={styles.scoreBoard}>
          <span style={{ color: "#64748b" }}>DISTANCE:</span>
          <span style={{ color: "#00f2ff", marginLeft: "10px" }}>
            {Math.floor(distance)}m
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "block" }} />

      {gameOver && (
        <div style={styles.overlay}>
          <div style={styles.crashBox}>
            <h1 style={styles.crashText}>CRASHED!</h1>
            <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
              Score: {Math.floor(distance)}m
            </p>
            <button onClick={restartGame} style={styles.restartBtn}>
              TRY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "#020617",
  },
  gui: {
    position: "absolute",
    top: 30,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 60px",
    zIndex: 10,
    alignItems: "center",
  },
  backBtn: {
    padding: "12px 24px",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    backdropFilter: "blur(10px)",
  },
  scoreBoard: {
    fontSize: "1.5rem",
    fontWeight: "900",
    background: "rgba(15,23,42,0.8)",
    padding: "10px 25px",
    borderRadius: "15px",
    border: "1px solid rgba(0,242,255,0.3)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(2,6,23,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  crashBox: {
    textAlign: "center",
    padding: "40px",
    background: "#0f172a",
    borderRadius: "30px",
    border: "2px solid #ff4757",
    boxShadow: "0 0 50px rgba(255,71,87,0.3)",
  },
  crashText: {
    fontSize: "4rem",
    color: "#ff4757",
    margin: "0",
    fontWeight: "900",
  },
  restartBtn: {
    padding: "15px 50px",
    background: "#00f2ff",
    color: "#000",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default ProRacing;
