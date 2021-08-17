interface CalculateBmi {
  value1: number;
  value2: number;
}

const parseBmiArgs = (args: Array<string>): CalculateBmi => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers');
  }
};

const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  if (bmi < 18.5) {
    return 'Underweight';
  }
  if (bmi >= 18.5 && bmi <= 25) {
    return 'Normal (healthy weight)';
  }
  if (bmi > 25) {
    return 'Overweight';
  }

  throw new Error('malformatted parameters');
};

try {
  const { value1, value2 } = parseBmiArgs(process.argv);
  console.log(calculateBmi(value1, value2));
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Error, something bad happened, message: ', e.message);
}

export { calculateBmi };
