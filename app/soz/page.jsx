"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SCIENCE_DATABASE = [
  { word: "ATOM", hint: "Moddaning eng kichik bo'lagi." },
  { word: "GALAXY", hint: "Yulduzlar to'plami." },
  { word: "DNA", hint: "Irsiyat kodi." },
  { word: "GRAVITY", hint: "Yerning tortish kuchi." },
  { word: "PROTON", hint: "Musbat zaryadlangan zarracha." },
  { word: "CELL", hint: "Hayotning asosi - hujayra." },
  { word: "OXYGEN", hint: "Nafas olish uchun gaz." },
  { word: "QUANTUM", hint: "Energiyaning eng kichik birligi." },
  { word: "PLASMA", hint: "Moddaning to'rtinchi holati." },
  { word: "NEUTRON", hint: "Zaryadsiz zarracha." },
];

export default function NebulaChallenge() {
  const [mode, setMode] = useState(null); // null, 'solo', 'duel'
  const [gameState, setGameState] = useState("menu");
  const [p1, setP1] = useState({ score: 0, input: "", combo: 0 });
  const [p2, setP2] = useState({ score: 0, input: "", combo: 0 });
  const [currentWord, setCurrentWord] = useState({
    word: "",
    hint: "",
    scrambled: "",
  });
  const [timeLeft, setTimeLeft] = useState(20);

  // So'zni aralashtirish
  const scramble = (word) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const nextRound = () => {
    const wordObj =
      SCIENCE_DATABASE[Math.floor(Math.random() * SCIENCE_DATABASE.length)];
    setCurrentWord({
      ...wordObj,
      scrambled: scramble(wordObj.word),
    });
    setTimeLeft(20);
    setP1((p) => ({ ...p, input: "" }));
    setP2((p) => ({ ...p, input: "" }));
  };

  const startSolo = () => {
    setMode("solo");
    setGameState("playing");
    nextRound();
    setP1({ score: 0, input: "", combo: 0 });
  };
  const startDuel = () => {
    setMode("duel");
    setGameState("playing");
    nextRound();
    setP1({ score: 0, input: "", combo: 0 });
    setP2({ score: 0, input: "", combo: 0 });
  };

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      nextRound();
    }
  }, [gameState, timeLeft]);

  const checkInput = (val, player) => {
    const upperVal = val.toUpperCase();
    if (player === 1) setP1((p) => ({ ...p, input: upperVal }));
    else setP2((p) => ({ ...p, input: upperVal }));

    if (upperVal === currentWord.word) {
      if (player === 1)
        setP1((p) => ({
          ...p,
          score: p.score + timeLeft * 10,
          combo: p.combo + 1,
        }));
      else
        setP2((p) => ({
          ...p,
          score: p.score + timeLeft * 10,
          combo: p.combo + 1,
        }));

      // G'olib aniqlangandan keyin yangi raund
      setTimeout(nextRound, 200);
    }
  };

  if (gameState === "menu") {
    return (
      <div style={styles.wrapper}>
        <div style={styles.menuBox}>
          <h1 style={styles.neonTitle}>NEBULA DUEL</h1>
          <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
            Koinot bilimdonlari jangi
          </p>
          <div style={styles.btnGroup}>
            <button onClick={startSolo} style={styles.mainBtn}>
              YOLG'IZ O'YIN (SOLO)
            </button>
            <button onClick={startDuel} style={styles.duelBtn}>
              IKKI KISHILIK (DUEL)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* O'yinchi 2 (Duel rejimida yuqorida teskari bo'lib chiqadi yoki yonma-yon) */}
      <div
        style={{
          ...styles.gameArea,
          borderBottom: mode === "duel" ? "2px solid #334155" : "none",
        }}
      >
        {mode === "duel" && (
          <div style={styles.playerInfo}>
            <span style={{ color: "#ff4757" }}>P2 SCORE: {p2.score}</span>
            <input
              style={styles.duelInput}
              value={p2.input}
              onChange={(e) => checkInput(e.target.value, 2)}
              placeholder="PLAYER 2 TYPE..."
            />
          </div>
        )}

        <div style={styles.wordSection}>
          <div style={styles.timerRing}>{timeLeft}</div>
          <h2 style={styles.scrambledText}>{currentWord.scrambled}</h2>
          <p style={styles.hintText}>HINT: {currentWord.hint}</p>
        </div>

        <div style={styles.playerInfo}>
          <span style={{ color: "#00ffcc" }}>P1 SCORE: {p1.score}</span>
          <input
            autoFocus
            style={styles.duelInput}
            value={p1.input}
            onChange={(e) => checkInput(e.target.value, 1)}
            placeholder={
              mode === "duel" ? "PLAYER 1 TYPE..." : "TYPE ANSWER..."
            }
          />
        </div>
      </div>

      <button onClick={() => setGameState("menu")} style={styles.backBtn}>
        MENU
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100vw",
    height: "100vh",
    background: "#020617",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Orbitron', sans-serif",
    color: "#fff",
    overflow: "hidden",
  },
  menuBox: {
    textAlign: "center",
    padding: "40px",
    background: "rgba(15, 23, 42, 0.8)",
    borderRadius: "30px",
    border: "1px solid #1e293b",
  },
  neonTitle: {
    fontSize: "4rem",
    color: "#00ffcc",
    textShadow: "0 0 20px #00ffcc",
    marginBottom: "10px",
  },
  btnGroup: { display: "flex", flexDirection: "column", gap: "15px" },
  mainBtn: {
    padding: "15px 30px",
    fontSize: "1.2rem",
    borderRadius: "12px",
    border: "none",
    background: "#00ffcc",
    color: "#020617",
    cursor: "pointer",
    fontWeight: "bold",
  },
  duelBtn: {
    padding: "15px 30px",
    fontSize: "1.2rem",
    borderRadius: "12px",
    border: "2px solid #ff4757",
    background: "none",
    color: "#ff4757",
    cursor: "pointer",
    fontWeight: "bold",
  },
  gameArea: {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    padding: "20px",
  },
  wordSection: { textAlign: "center" },
  timerRing: {
    width: "60px",
    height: "60px",
    border: "4px solid #00ffcc",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "1.5rem",
    color: "#00ffcc",
    boxShadow: "0 0 15px #00ffcc",
  },
  scrambledText: {
    fontSize: "3.5rem",
    letterSpacing: "15px",
    color: "#fff",
    textShadow: "0 0 10px rgba(255,255,255,0.5)",
    marginBottom: "10px",
  },
  hintText: { color: "#94a3b8", fontStyle: "italic", fontSize: "1.1rem" },
  playerInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  duelInput: {
    background: "#0f172a",
    border: "2px solid #334155",
    borderRadius: "15px",
    padding: "15px",
    color: "#fff",
    fontSize: "1.5rem",
    textAlign: "center",
    width: "100%",
    outline: "none",
    transition: "0.3s",
    focus: { borderColor: "#00ffcc" },
  },
  backBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "none",
    border: "1px solid #334155",
    color: "#94a3b8",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
