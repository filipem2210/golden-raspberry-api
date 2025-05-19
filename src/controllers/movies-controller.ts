import { Request, Response } from 'express';
import db from '../database/database';
import type { Interval } from '../protocols/interval';
import type { Movie } from '../protocols/movie';

export class MoviesController {
  public static async getAwardIntervals(req: Request, res: Response): Promise<void> {
    db.all<Movie>(
      'SELECT year, producers FROM movies WHERE winner = 1',
      [],
      (err: Error | null, rows: Movie[]) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const producerWins = new Map<string, number[]>();

        rows.forEach((movie) => {
          if (!movie || typeof movie.producers !== 'string' || typeof movie.year !== 'number') return;
          const producers = movie.producers.replace(/ and /g, ',');
          producers.split(',').map(p => p.trim()).forEach((producer: string) => {
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

        if (intervals.length === 0) {
          return res.json({ min: [], max: [] });
        }

        const minInterval = Math.min(...intervals.map(i => i.interval));
        const maxInterval = Math.max(...intervals.map(i => i.interval));

        res.json({
          min: intervals.filter(i => i.interval === minInterval),
          max: intervals.filter(i => i.interval === maxInterval)
        });
      }
    );
  }
}