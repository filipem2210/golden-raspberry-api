import request from 'supertest';
import { app } from '../src/index';
import db from '../src/database/database';
import createTablesMovies from '../src/database/tables';
import loadMovies from '../src/services/movies-service';
import { CsvMovie } from '../src/protocols/csv-movie';
import { loadCsvData } from './helpers/load-csv-data';
import { extractWinnersFromCsv } from './helpers/extract-winners-from-csv';
import { sortIntervals } from './helpers/sort-intervals';

describe('Movies API Tests', () => {
  let api: any;
  let csvData: CsvMovie[] = [];

  beforeAll(async () => {
    await createTablesMovies();
    await loadMovies();
    api = request(app);
    csvData = await loadCsvData('movielist.csv');
    await new Promise<void>((resolve, reject) => {
      db.run('delete from movies', (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await loadMovies();
  });

  test('Should insert CSV data into the database', async () => {
    const rows = await new Promise<any[]>((resolve, reject) => {
      db.all('select * from movies', [], (err: Error | null, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    expect(rows.length).toBeGreaterThan(0);
  });

  test('Should return win intervals by producer', async () => {
    const response = await api.get('/api/awards/intervals');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');
  });

  test('Should return error when the database fails', async () => {
    const originalAll = db.all;
    db.all = jest.fn().mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'));
    });
    const response = await api.get('/api/awards/intervals');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Database error');
    db.all = originalAll;
  });

  test('API response should match CSV data', async () => {
    const response = await request(app).get('/api/awards/intervals');
    expect(response.status).toBe(200);
    
    const apiWinners = response.body;
    const csvWinners = extractWinnersFromCsv(csvData);

    sortIntervals(apiWinners.min);
    sortIntervals(apiWinners.max);

    sortIntervals(csvWinners.min);
    sortIntervals(csvWinners.max);

    expect(apiWinners).toStrictEqual(csvWinners);
  });
});
