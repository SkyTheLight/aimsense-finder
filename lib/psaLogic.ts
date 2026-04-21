import { PSAIteration } from '@/types';

export function generateInitialPSAOptions(base: number): {
  slower: number;
  current: number;
  faster: number;
} {
  return {
    slower: Number((base * 0.7).toFixed(3)),
    current: Number(base.toFixed(3)),
    faster: Number((base * 1.3).toFixed(3)),
  };
}

export function createPSAIteration(
  iteration: number,
  low: number,
  high: number
): PSAIteration {
  const mid = Number(((low + high) / 2).toFixed(3));
  const step = (high - low) / 4;
  
  return {
    iteration,
    low: Number((mid - step).toFixed(3)),
    high: Number((mid + step).toFixed(3)),
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

  let newLow: number, newHigh: number;
  
  if (choice === 'low') {
    newLow = lastIteration.low;
    newHigh = lastIteration.mid;
  } else {
    newLow = lastIteration.mid;
    newHigh = lastIteration.high;
  }

  const newIteration = createPSAIteration(
    lastIteration.iteration + 1,
    newLow,
    newHigh
  );

  const updatedLast = { ...lastIteration, choice };
  
  return [...iterations.slice(0, -1), updatedLast, newIteration];
}

export function getPSAValue(iterations: PSAIteration[]): number | null {
  if (iterations.length === 0) return null;

  const validIterations = iterations.filter(i => i.choice !== null);
  if (validIterations.length === 0) return null;

  const last = validIterations[validIterations.length - 1];
  return last.mid;
}

export function getPSARange(iterations: PSAIteration[]): { low: number; high: number } | null {
  if (iterations.length === 0) return null;

  const last = iterations[iterations.length - 1];
  return { low: last.low, high: last.high };
}

export function createFirstIteration(base: number): PSAIteration {
  const range = { low: base * 0.7, high: base * 1.3 };
  return createPSAIteration(1, range.low, range.high);
}