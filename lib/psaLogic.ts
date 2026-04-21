import { PSAIteration } from '@/types';

export function generateInitialPSAOptions(base: number): {
  half: number;
  base: number;
  double: number;
} {
  return {
    half: Number((base * 0.5).toFixed(3)),
    base: Number(base.toFixed(3)),
    double: Number((base * 2).toFixed(3)),
  };
}

export function createPSAIteration(
  iteration: number,
  low: number,
  high: number
): PSAIteration {
  const mid = Number(((low + high) / 2).toFixed(3));
  const step = 0.12 / iteration;
  const adjustedStep = Math.max(step, 0.012);

  return {
    iteration,
    low: Number((mid - adjustedStep).toFixed(3)),
    high: Number((mid + adjustedStep).toFixed(3)),
    mid,
    choice: null,
  };
}

export function processPSAChoice(
  iterations: PSAIteration[],
  choice: 'low' | 'high'
): PSAIteration[] {
  const lastIteration = iterations[iterations.length - 1];
  if (!lastIteration) return iterations;

  const newIteration = createPSAIteration(
    lastIteration.iteration + 1,
    choice === 'low' ? lastIteration.low : lastIteration.mid,
    choice === 'low' ? lastIteration.mid : lastIteration.high
  );

  newIteration.choice = choice;
  lastIteration.choice = choice;

  return [...iterations.slice(0, -1), lastIteration, newIteration];
}

export function getPSAValue(iterations: PSAIteration[]): number | null {
  if (iterations.length === 0) return null;

  const completed = iterations.filter(i => i.choice !== null);
  if (completed.length === 0) return null;

  const last = completed[completed.length - 1];
  return last.mid;
}

export function getPSARange(iterations: PSAIteration[]): { low: number; high: number } | null {
  if (iterations.length === 0) return null;

  const last = iterations[iterations.length - 1];
  return { low: last.low, high: last.high };
}

export function createFirstIteration(base: number): PSAIteration {
  const range = { low: base * 0.5, high: base * 1.5 };
  return createPSAIteration(1, range.low, range.high);
}