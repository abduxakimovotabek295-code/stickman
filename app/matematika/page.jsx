"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function MathMaster() {
  const [activeTab, setActiveTab] = useState("home");
  const [score, setScore] = useState(0);

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>π</span>
          <h2 style={styles.brandName}>MATH PRO</h2>
        </div>

        <nav style={styles.nav}>
          <button
            onClick={() => setActiveTab("home")}
            style={activeTab === "home" ? styles.navBtnActive : styles.navBtn}
          >
            🏠 Asosiy sahifa
          </button>
          <button
            onClick={() => setActiveTab("lab")}
            style={activeTab === "lab" ? styles.navBtnActive : styles.navBtn}
          >
            🧪 Geometriya Lab
          </button>
          <button
            onClick={() => setActiveTab("game")}
            style={activeTab === "game" ? styles.navBtnActive : styles.navBtn}
          >
            🎮 Blitz O'yin
          </button>
        </nav>

        <div style={styles.stats}>
          <p style={{ fontSize: "12px", color: "#94a3b8" }}>JAMI BALL</p>
          <h3 style={{ color: "#f59e0b", margin: 0 }}>{score} XP</h3>
        </div>

        <Link href="/" style={styles.backLink}>
          ← Bosh menyuga qaytish
        </Link>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {activeTab === "home" && <WelcomeView />}
        {activeTab === "lab" && <GeometryLab />}
        {activeTab === "game" && (
          <MathGame onWin={() => setScore((s) => s + 20)} />
        )}
      </main>
    </div>
  );
}

function WelcomeView() {
  return (
    <div style={styles.welcome}>
      <h1 style={styles.title}>Matematika olamiga xush kelibsiz!</h1>
      <p style={styles.subtitle}>
        Bu yerda siz raqamlar bilan o'ynashingiz va geometrik shakllarni
        boshqarishingiz mumkin.
      </p>

      <div style={styles.featureGrid}>
        <div style={styles.featureCard}>
          <div style={{ fontSize: "40px" }}>🔢</div>
          <h3>Tezkor Hisob</h3>
          <p>Miyangizni charxlovchi matematik misollar.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={{ fontSize: "40px" }}>📐</div>
          <h3>Vizual Lab</h3>
          <p>Shakllarni o'zgartiring va natijani ko'ring.</p>
        </div>
      </div>
    </div>
  );
}

function GeometryLab() {
  const [size, setSize] = useState(100);
  return (
    <div style={styles.card}>
      <h2>Kvadrat va Doira Labaratoriyasi</h2>
      <p>
        O'lchamni o'zgartiring: <b>{size} px</b>
      </p>
      <input
        type="range"
        min="20"
        max="250"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        style={{ width: "100%", cursor: "pointer" }}
      />
      <div style={styles.labDisplay}>
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: "#3b82f6",
            borderRadius: "8px",
            transition: "0.2s",
          }}
        ></div>
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: "#ef4444",
            borderRadius: "50%",
            transition: "0.2s",
          }}
        ></div>
      </div>
      <div style={styles.infoBox}>
        <p>Kvadrat yuzi: {size * size} px²</p>
        <p>Doira yuzi: {(Math.PI * Math.pow(size / 2, 2)).toFixed(0)} px²</p>
      </div>
    </div>
  );
}

function MathGame({ onWin }) {
  const [task, setTask] = useState({ a: 5, b: 6 });
  const [ans, setAns] = useState("");
  const [msg, setMsg] = useState("Javobni kiriting...");

  const check = () => {
    if (parseInt(ans) === task.a * task.b) {
      onWin();
      setMsg("To'g'ri! 🔥");
      setTimeout(() => {
        setTask({
          a: Math.floor(Math.random() * 12 + 2),
          b: Math.floor(Math.random() * 12 + 2),
        });
        setAns("");
        setMsg("Keyingi misol...");
      }, 1000);
    } else {
      setMsg("Xato, qayta urinib ko'ring! ❌");
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={{ textAlign: "center" }}>Blitz Ko'paytirish ⚡</h2>
      <div style={styles.problemBox}>
        {task.a} × {task.b} = ?
      </div>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <input
          style={styles.input}
          type="number"
          value={ans}
          onChange={(e) => setAns(e.target.value)}
          placeholder="?"
        />
        <button style={styles.checkBtn} onClick={check}>
          TASDIQLASH
        </button>
      </div>
      <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b" }}>
        {msg}
      </p>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    background: "#f0f2f5",
    fontFamily: "sans-serif",
  },
  sidebar: {
    width: "280px",
    background: "#1e293b",
    color: "#fff",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  brandIcon: {
    background: "#3b82f6",
    padding: "5px 15px",
    borderRadius: "10px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  brandName: { fontSize: "20px", margin: 0 },
  nav: { display: "flex", flexDirection: "column", gap: "10px", flex: 1 },
  navBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    padding: "12px",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "0.3s",
  },
  navBtnActive: {
    background: "#3b82f6",
    border: "none",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "16px",
  },
  stats: {
    background: "#0f172a",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
  },
  backLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    marginTop: "10px",
  },

  main: {
    flex: 1,
    padding: "50px",
    overflowY: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  welcome: { maxWidth: "800px" },
  title: { fontSize: "40px", color: "#1e293b", marginBottom: "10px" },
  subtitle: { fontSize: "18px", color: "#64748b", marginBottom: "40px" },
  featureGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  featureCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
  },
  labDisplay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    margin: "40px 0",
    minHeight: "250px",
  },
  infoBox: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    borderLeft: "4px solid #3b82f6",
  },

  problemBox: {
    fontSize: "60px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "30px 0",
    color: "#1e293b",
  },
  input: {
    width: "120px",
    padding: "15px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "24px",
    textAlign: "center",
  },
  checkBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "0 30px",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
