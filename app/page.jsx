"use client";
import React from "react";
import Link from "next/link";

export default function StickmanHub() {
  const games = [
    {
      id: "tank",
      title: "LASER TANKS",
      emoji: "🚀",
      desc: "Mustahkam baza va lazerli janglar!",
      color: "#00d2ff",
      gradient: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)",
      shadow: "0 10px 30px -10px rgba(0, 210, 255, 0.5)",
    },
    {
      id: "poyga",
      title: "PRO RACING",
      emoji: "🏎️",
      desc: "Tezlik va aqlli raqiblar poygasi!",
      color: "#ff4757",
      gradient: "linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)",
      shadow: "0 10px 30px -10px rgba(255, 71, 87, 0.5)",
    },
    {
      id: "idish",
      title: "WATER SORT",
      emoji: "🧪",
      desc: "Rangli suvlarni idishlarga saralang!",
      color: "#2ed573",
      gradient: "linear-gradient(135deg, #2ed573 0%, #1e90ff 100%)",
      shadow: "0 10px 30px -10px rgba(46, 213, 115, 0.5)",
    },
    {
      id: "matematika",
      title: "MATH MASTER",
      emoji: "📐",
      desc: "Interaktiv laboratoriya va aqlli hisoblar!",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      shadow: "0 10px 30px -10px rgba(245, 158, 11, 0.5)",
    },
    {
      id: "soz",
      title: "NEBULA QUEST",
      emoji: "🧩",
      desc: "Koinot bo'ylab so'zlar sarguzashti!",
      color: "#00ffcc",
      gradient: "linear-gradient(135deg, #00ffcc 0%, #00a8cc 100%)",
      shadow: "0 10px 30px -10px rgba(0, 255, 204, 0.5)",
    },
  ];

  return (
    <div style={styles.pageWrapper}>
      {/* Animatsiyali fon elementlari */}
      <div style={styles.bgGlow1}></div>
      <div style={styles.bgGlow2}></div>

      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.tag}>VERSION 2.5.0</div>
          <h1 style={styles.mainTitle}>
            STICKMAN<span style={{ color: "#ff4757" }}>.</span>HUB
          </h1>
          <p style={styles.subtitle}>
            Matematika va mantiq olamiga xush kelibsiz!
          </p>
        </header>

        <div style={styles.gameGrid}>
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/${game.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.borderColor = game.color;
                  e.currentTarget.style.boxShadow = game.shadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{ ...styles.iconWrapper, background: game.gradient }}
                >
                  <span style={styles.emoji}>{game.emoji}</span>
                </div>

                <h3 style={{ ...styles.gameTitle, color: game.color }}>
                  {game.title}
                </h3>
                <p style={styles.gameDesc}>{game.desc}</p>

                <div
                  style={{
                    ...styles.playBtn,
                    border: `1px solid ${game.color}`,
                    color: game.color,
                  }}
                >
                  O'YNASH
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer style={styles.footer}>
          <div style={styles.statBar}>
            <span style={styles.onlineStatus}></span>
            <span>1,450 Online o'yinchilar</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: "#020617",
    color: "#fff",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    display: "flex",
    justifyContent: "center",
    padding: "60px 20px",
    position: "relative",
    overflowX: "hidden",
  },
  bgGlow1: {
    position: "absolute",
    top: "-10%",
    right: "-10%",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
    zIndex: 1,
    filter: "blur(60px)",
  },
  bgGlow2: {
    position: "absolute",
    bottom: "-10%",
    left: "-10%",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(255, 71, 87, 0.1) 0%, transparent 70%)",
    zIndex: 1,
    filter: "blur(60px)",
  },
  content: {
    zIndex: 2,
    width: "100%",
    maxWidth: "1100px",
    textAlign: "center",
  },
  header: { marginBottom: "60px" },
  tag: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: "0.75rem",
    fontWeight: "bold",
    color: "#94a3b8",
    marginBottom: "16px",
  },
  mainTitle: {
    fontSize: "4rem",
    fontWeight: "900",
    letterSpacing: "-2px",
    margin: "0",
    textShadow: "0 10px 20px rgba(0,0,0,0.5)",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "1.2rem",
    marginTop: "12px",
    fontWeight: "400",
  },
  gameGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(12px)",
    borderRadius: "32px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "40px 30px",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "24px",
    transform: "rotate(-5deg)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  },
  emoji: { fontSize: "2.8rem" },
  gameTitle: {
    fontSize: "1.5rem",
    fontWeight: "800",
    margin: "0 0 12px 0",
    letterSpacing: "1px",
  },
  gameDesc: {
    color: "#64748b",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "30px",
    minHeight: "48px",
  },
  playBtn: {
    padding: "10px 40px",
    borderRadius: "14px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "transparent",
  },
  footer: {
    marginTop: "80px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: "30px",
  },
  statBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    color: "#64748b",
    fontSize: "0.9rem",
  },
  onlineStatus: {
    width: "8px",
    height: "8px",
    background: "#22c55e",
    borderRadius: "50%",
    boxShadow: "0 0 10px #22c55e",
  },
};
