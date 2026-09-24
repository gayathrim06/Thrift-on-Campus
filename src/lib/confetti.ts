import confetti from "canvas-confetti";

export const triggerCelebrationConfetti = (origin?: { x: number; y: number }) => {
  try {
    confetti({
      particleCount: 45,
      spread: 65,
      origin: origin || { y: 0.7 },
      colors: ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"],
      disableForReducedMotion: true,
      scalar: 1,
    });
  } catch {
    // fallback
  }
};

export const triggerHeartBurst = (x = 0.5, y = 0.5) => {
  try {
    confetti({
      particleCount: 30,
      angle: 90,
      spread: 60,
      origin: { x, y },
      colors: ["#f43f5e", "#ec4899", "#fda4af"],
      shapes: ["circle"],
      scalar: 0.9,
    });
  } catch {
    // fallback
  }
};
