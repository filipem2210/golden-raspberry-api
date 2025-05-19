import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:', (err: Error | null) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Database connected.');
  }
});

export default db;
