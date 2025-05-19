import express, { Application } from 'express';
import moviesRoutes from './routes/movies-routes';
import createTablesMovies from './database/tables';
import loadMovies from './services/movies-service';

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use('/api', moviesRoutes);

async function startServer() {
  try {
    await createTablesMovies();
    await loadMovies();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app };