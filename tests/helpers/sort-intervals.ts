import type { Interval } from '../../src/protocols/interval';

export function sortIntervals(arr: Interval[]): Interval[] {
  return [...arr].sort((a, b) => {
    if (a.producer !== b.producer) return a.producer.localeCompare(b.producer);
    if (a.interval !== b.interval) return a.interval - b.interval;
    if (a.previousWin !== b.previousWin) return a.previousWin - b.previousWin;
    return a.followingWin - b.followingWin;
  });
}