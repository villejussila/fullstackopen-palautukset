/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  try {
    const bmi = calculateBmi(height, weight);
    res.json({ weight, height, bmi });
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    res.status(400).json({ error: e.message });
  }
});

app.post('/exercises', (req, res) => {
  if (!req.body.daily_exercises || !req.body.target) {
    return res.status(400).json({ error: 'parameters missing' });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dailyExercises: Array<any> = req.body.daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target: any = req.body.target;
  dailyExercises.forEach((val: number) => {
    if (isNaN(Number(val))) {
      return res.status(400).json({ error: 'malformatted parameters' });
    }
    return;
  });
  if (isNaN(Number(req.body.target))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
  const exercises = calculateExercises(dailyExercises, target);
  return res.json(exercises);
});

const PORT = 3002;

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
