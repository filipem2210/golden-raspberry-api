import fs from 'fs';
import csvParser from 'csv-parser';
import type { CsvMovie } from '../../src/protocols/csv-movie';

export async function loadCsvData(filePath: string): Promise<CsvMovie[]> {
  return new Promise((resolve, reject) => {
    const results: CsvMovie[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ';' }))
      .on('data', (row: Record<string, string>) => {
        results.push({
          title: row['title'],
          year: parseInt(row['year'], 10),
          producers: row['producers'],
          winner: row['winner'].toLowerCase().trim() === 'yes' ? 1 : 0
        });
      })
      .on('end', () => resolve(results))
      .on('error', (err: Error) => reject(err));
  });
}
