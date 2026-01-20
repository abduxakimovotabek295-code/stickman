"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const COLORS = [
  "#FF4757",
  "#2ED573",
  "#1E90FF",
  "#ECCC68",
  "#70A1FF",
  "#A29BFE",
  "#00D2D3",
  "#FF7F50",
  "#54A0FF",
  "#FF9F43",
];

export default function WaterSortFinal() {
  const [level, setLevel] = useState(1);
  const [tubes, setTubes] = useState([]);
  const [selectedTube, setSelectedTube] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3); // Boshlanishiga 3ta yordam
  const [gameState, setGameState] = useState("playing");
  const [pourInfo, setPourInfo] = useState({
    fromIdx: null,
    toIdx: null,
    color: null,
    x: 0,
    y: 0,
    angle: 0,
  });

  const tubeRefs = useRef([]);

  const initGame = useCallback((lvl) => {
    setGameState("playing");
    setSelectedTube(null);
    setIsAnimating(false);
    setHintsLeft(3);

    const colorCount = Math.min(3 + Math.floor((lvl - 1) / 4), 10);
    let allColors = [];
    for (let i = 0; i < colorCount; i++)
      allColors.push(...Array(4).fill(COLORS[i]));

    allColors.sort(() => Math.random() - 0.5);

    let newTubes = [];
    for (let i = 0; i < colorCount; i++)
      newTubes.push(allColors.slice(i * 4, i * 4 + 4));

    for (let i = 0; i < 2; i++) newTubes.push([]);
    setTubes(newTubes);
  }, []);

  useEffect(() => {
    initGame(level);
  }, [level, initGame]);

  const checkAndPour = (from, to) => {
    const fromTube = tubes[from];
    const toTube = tubes[to];

    if (to === from || toTube.length >= 4 || fromTube.length === 0) {
      setSelectedTube(null);
      return;
    }

    const topColor = fromTube[fromTube.length - 1];
    if (toTube.length > 0 && toTube[toTube.length - 1] !== topColor) {
      setSelectedTube(null);
      return;
    }

    // Animatsiya hisob-kitobi
    const fromRect = tubeRefs.current[from].getBoundingClientRect();
    const toRect = tubeRefs.current[to].getBoundingClientRect();
    const diffX = toRect.left - fromRect.left;
    const diffY = toRect.top - fromRect.top;
    const direction = diffX > 0 ? 1 : -1;

    setIsAnimating(true);
    setPourInfo({
      fromIdx: from,
      toIdx: to,
      color: topColor,
      x: diffX + direction * -35,
      y: diffY - 60,
      angle: direction * 85,
    });

    setTimeout(() => {
      setTubes((prev) => {
        const next = prev.map((t) => [...t]);
        const colorToMove = next[from][next[from].length - 1];

        while (
          next[from].length > 0 &&
          next[to].length < 4 &&
          next[from][next[from].length - 1] === colorToMove
        ) {
          next[to].push(next[from].pop());
        }

        const isWon = next.every(
          (t) =>
            t.length === 0 || (t.length === 4 && t.every((c) => c === t[0]))
        );
        if (isWon) setGameState("won");
        return next;
      });
    }, 500);

    setTimeout(() => {
      setIsAnimating(false);
      setSelectedTube(null);
      setPourInfo({
        fromIdx: null,
        toIdx: null,
        color: null,
        x: 0,
        y: 0,
        angle: 0,
      });
    }, 1000);
  };

  // --- CHIROQCHA (HINT) LOGIKASI ---
  const useHint = () => {
    if (hintsLeft <= 0 || isAnimating || gameState !== "playing") return;

    for (let i = 0; i < tubes.length; i++) {
      if (tubes[i].length === 0) continue;
      const topColor = tubes[i][tubes[i].length - 1];

      for (let j = 0; j < tubes.length; j++) {
        if (i === j) continue;
        const targetTube = tubes[j];

        // Agar maqsad idish bo'sh bo'lsa yoki ustki rangi mos kelsa
        if (
          targetTube.length < 4 &&
          (targetTube.length === 0 ||
            targetTube[targetTube.length - 1] === topColor)
        ) {
          // Bir xil rangli idishni to'liq o'tkazish xato bo'lmasligini tekshirish
          if (targetTube.length === 0 && tubes[i].every((c) => c === topColor))
            continue;

          setHintsLeft((prev) => prev - 1);
          checkAndPour(i, j);
          return; // Bitta yordam ko'rsatildi
        }
      }
    }
    alert("Hozircha iloj yo'q!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/">
          <button style={styles.navBtn}>🏠</button>
        </Link>
        <div style={styles.lvlBadge}>LEVEL {level}</div>
        <button onClick={() => initGame(level)} style={styles.navBtn}>
          🔄
        </button>
      </div>

      <div style={styles.gameArea}>
        {tubes.map((tube, idx) => {
          const isPouring = pourInfo.fromIdx === idx;
          const isSelected = selectedTube === idx;
          let transform = isPouring
            ? `translate(${pourInfo.x}px, ${pourInfo.y}px) rotate(${pourInfo.angle}deg)`
            : isSelected
            ? "translateY(-30px)"
            : "none";

          return (
            <div
              ref={(el) => (tubeRefs.current[idx] = el)}
              key={idx}
              onClick={() =>
                !isAnimating &&
                (selectedTube === null
                  ? tube.length > 0 && setSelectedTube(idx)
                  : selectedTube === idx
                  ? setSelectedTube(null)
                  : checkAndPour(selectedTube, idx))
              }
              style={{
                ...styles.tubeContainer,
                transform,
                zIndex: isPouring ? 100 : 1,
              }}
            >
              {isPouring && (
                <div
                  style={{
                    ...styles.stream,
                    backgroundColor: pourInfo.color,
                    left: pourInfo.angle > 0 ? "auto" : "-8px",
                    right: pourInfo.angle > 0 ? "-8px" : "auto",
                  }}
                />
              )}
              <div style={styles.glass}>
                <div style={styles.glassReflection} />
                {tube.map((color, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      ...styles.water,
                      backgroundColor: color,
                      bottom: `${cIdx * 25}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.footer}>
        <button
          onClick={useHint}
          style={{ ...styles.hintBtn, opacity: hintsLeft > 0 ? 1 : 0.5 }}
        >
          💡 <span style={styles.hintCount}>{hintsLeft}</span>
        </button>
      </div>

      {gameState === "won" && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={{ fontSize: "2rem", color: "#2ed573" }}>G'ALABA! 🎉</h2>
            <button onClick={() => setLevel(level + 1)} style={styles.nextBtn}>
              KEYINGI LEVEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "#020617",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    padding: "20px 40px",
    alignItems: "center",
    background: "#0f172a",
  },
  navBtn: {
    padding: "12px",
    borderRadius: "12px",
    background: "#1e293b",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },
  lvlBadge: { fontSize: "1.5rem", color: "#38bdf8", fontWeight: "bold" },
  gameArea: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "35px",
    marginTop: "80px",
    maxWidth: "800px",
  },
  tubeContainer: {
    position: "relative",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  glass: {
    width: "50px",
    height: "160px",
    border: "3px solid rgba(255,255,255,0.2)",
    borderRadius: "0 0 25px 25px",
    position: "relative",
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
  },
  glassReflection: {
    position: "absolute",
    top: 0,
    left: "15%",
    width: "15%",
    height: "100%",
    background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)",
    zIndex: 5,
  },
  water: {
    position: "absolute",
    width: "100%",
    height: "25.1%",
    transition: "bottom 0.3s ease",
  },
  stream: {
    position: "absolute",
    width: "8px",
    height: "100px",
    top: "-10px",
    zIndex: 10,
    borderRadius: "4px",
  },
  footer: { position: "fixed", bottom: "40px" },
  hintBtn: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#1e293b",
    border: "3px solid #facc15",
    color: "#fff",
    fontSize: "30px",
    position: "relative",
    cursor: "pointer",
    transition: "0.3s",
  },
  hintCount: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "#ef4444",
    fontSize: "14px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modalContent: {
    background: "#1e293b",
    padding: "50px",
    borderRadius: "30px",
    textAlign: "center",
    border: "2px solid #38bdf8",
  },
  nextBtn: {
    marginTop: "25px",
    padding: "15px 40px",
    background: "#38bdf8",
    border: "none",
    borderRadius: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.1rem",
  },
};
