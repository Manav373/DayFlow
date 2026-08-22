import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
    ticks: 200,
    gravity: 1.2
  });
};

export const triggerSuccessBurst = (x: number = 0.5, y: number = 0.5) => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x, y },
    colors: ['#10b981', '#34d399', '#6ee7b7'],
    ticks: 150
  });
};
