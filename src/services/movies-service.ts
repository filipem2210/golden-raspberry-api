import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import db from '../database/database';

export default async function loadMovies(): Promise<void> {
  return new Promise((resolve, reject) => {
    const inserts: Promise<void>[] = [];
    const csvPath = path.resolve(__dirname, '../../movielist.csv');
    
    fs.createReadStream(csvPath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row: Record<string, string>) => {
        const insertPromise = new Promise<void>((resolveInsert, rejectInsert) => {
          db.run(
            `INSERT INTO movies (title, year, producers, winner) VALUES (?, ?, ?, ?)` ,
            [
              row['title'],
              parseInt(row['year'], 10),
              row['producers'],
              row['winner'] && row['winner'].toLowerCase().trim() === 'yes' ? 1 : 0
            ],
            (err: Error | null) => (err ? rejectInsert(err) : resolveInsert())
          );
        });
        inserts.push(insertPromise);
      })
      .on('end', () => Promise.all(inserts).then(() => resolve()).catch(reject))
      .on('error', reject);
  });
}