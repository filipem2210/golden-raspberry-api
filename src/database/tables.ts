import db from './database';

export default async function createTablesMovies(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          year INTEGER,
          producers TEXT,
          winner INTEGER
        )
      `, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}
