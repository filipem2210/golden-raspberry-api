import type { CsvMovie } from "../../src/protocols/csv-movie";
import type { Interval } from "../../src/protocols/interval";

export function extractWinnersFromCsv(csvData: CsvMovie[]): { min: Interval[]; max: Interval[] } {
  const producerWins = new Map<string, number[]>();
  csvData
    .filter(movie => movie.winner === 1)
    .forEach(movie => {
      const producers = movie.producers.replace(/ and /g, ',');
      producers.split(',').map(p => p.trim()).forEach(producer => {
        if (!producerWins.has(producer)) {
          producerWins.set(producer, []);
        }
        producerWins.get(producer)!.push(movie.year);
      });
    });

  const intervals: Interval[] = [];
  producerWins.forEach((years, producer) => {
    if (years.length > 1) {
      years.sort((a, b) => a - b);
      for (let i = 1; i < years.length; i++) {
        intervals.push({
          producer,
          interval: years[i] - years[i - 1],
          previousWin: years[i - 1],
          followingWin: years[i]
        });
      }
    }
  });
  const minInterval = Math.min(...intervals.map(i => i.interval));
  const maxInterval = Math.max(...intervals.map(i => i.interval));
  return {
    min: intervals.filter(i => i.interval === minInterval),
    max: intervals.filter(i => i.interval === maxInterval)
  };
}