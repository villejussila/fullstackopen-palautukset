interface CalculateExercises {
  dailyExerciseHours: Array<number>;
  targetHours: number;
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExercisesArgs = (args: Array<string>): CalculateExercises => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const dailyExerciseHours = [];

  for (let i = 2; i < args.length; i++) {
    if (isNaN(Number(args[i]))) {
      throw new Error('Provided values were not numbers');
    }
    if (i > 2) dailyExerciseHours.push(Number(args[i]));
  }
  return {
    dailyExerciseHours,
    targetHours: Number(args[2]),
  };
};

const calculateExercises = (
  dailyExerciseHours: Array<number>,
  targetHours: number
): Result => {
  const periodLength = dailyExerciseHours.length;
  let trainingDays = 0;
  let hoursSum = 0;

  dailyExerciseHours.forEach((exerciseHours) => {
    if (exerciseHours > 0) trainingDays++;
    hoursSum += exerciseHours;
  });

  const average = hoursSum / periodLength;
  const success = average >= targetHours;

  let rating = 2;
  
  if (average < targetHours - 1) rating = 1;
  else if (average >= targetHours - 1 && average < targetHours + 1) rating = 2;
  else if (average >= targetHours + 1) rating = 3;

  let ratingDescription = '';
  switch (rating) {
    case 1:
      ratingDescription = 'pretty bad';
      break;
    case 2:
      ratingDescription = 'not too bad but could be better';
      break;
    case 3:
      ratingDescription = 'Nice!';
      break;
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target: targetHours,
    average,
  };
};
try {
  const { dailyExerciseHours, targetHours } = parseExercisesArgs(process.argv);
  console.log(calculateExercises(dailyExerciseHours, targetHours));
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Something bad happened, message: ', e.message);
}

export { calculateExercises };
