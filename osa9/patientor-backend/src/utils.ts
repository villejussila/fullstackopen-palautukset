import {
  NewPatient,
  Gender,
  Entry,
  EntryType,
  EntryWithoutId,
  NewEntryBase,
  HealthCheckRating,
  Discharge,
  SickLeave,
} from './types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};
const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name: ' + name);
  }
  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};
const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error('Incorrect or missing date of birth: ' + dateOfBirth);
  }
  return dateOfBirth;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }
  return ssn;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};
const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }
  return occupation;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryArray = (entries: any[]): entries is Entry[] => {
  if (entries.length === 0) return true;
  return entries.every((entry) =>
    Object.values(EntryType).includes(entry.type)
  );
};
const parseEntries = (entries: unknown): Entry[] => {
  if (!entries) entries = [];
  if (!Array.isArray(entries) || !isEntryArray(entries)) {
    throw new Error('Incorrect or missing entry type ' + entries);
  }
  return entries;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatient = (object: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseName(object.name),
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    ssn: parseSSN(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: parseEntries(object.entries),
  };

  return newPatient;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryType = (entryType: any): entryType is EntryType => {
  return Object.values(EntryType).includes(entryType);
};

const parseEntryType = (type: unknown): EntryType => {
  if (!type || !isEntryType(type)) {
    throw new Error('Incorrect or missing field type');
  }
  return type;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating == null || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing rating');
  }
  return rating;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDischarge = (discharge: any): discharge is Discharge => {
  if (!discharge.date || !discharge.criteria) return false;
  if (!isString(discharge.date) || !isString(discharge.criteria)) {
    return false;
  }
  return true;
};

const parseDischarge = (discharge: unknown): Discharge => {
  console.log(discharge);
  if (!discharge || !isDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge');
  }
  return discharge;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSickLeave = (sickLeave: any): sickLeave is SickLeave => {
  if (sickLeave.startDate && sickLeave.endDate) {
    if (
      !isString(sickLeave.startDate) ||
      !isDate(sickLeave.startDate) ||
      !isString(sickLeave.endDate) ||
      !isDate(sickLeave.endDate)
    ) {
      return false;
    }
  }
  return true;
};

const parseSickLeave = (sickLeave: unknown): SickLeave | undefined => {
  if (!sickLeave) return undefined;
  if (!isSickLeave(sickLeave)) throw new Error('Incorrect sick leave dates');
  return sickLeave;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isStringArray = (array: any): array is string[] => {
  if (Array.isArray(array)) {
    if (array.every((val) => typeof val === 'string')) {
      return true;
    }
  }
  return false;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown[]): string[] => {
  if (!diagnosisCodes) return [];
  if (!isStringArray(diagnosisCodes)) {
    throw new Error('Error parsing diagnosis codes');
  }
  return diagnosisCodes;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewEntry = (object: any): EntryWithoutId => {
  const parsedEntryType = parseEntryType(object.type);

  const newEntryBase: NewEntryBase = {
    description: parseDescription(object.description),
    date: parseDate(object.date),
    specialist: parseSpecialist(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
  };

  switch (parsedEntryType) {
    case EntryType.HealthCheck:
      return {
        ...newEntryBase,
        type: EntryType.HealthCheck,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    case EntryType.Hospital:
      return {
        ...newEntryBase,
        type: EntryType.Hospital,
        discharge: parseDischarge(object.discharge),
      };
    case EntryType.OccupationalHealthcare:
      return {
        ...newEntryBase,
        type: EntryType.OccupationalHealthcare,
        employerName: parseName(object.employerName),
        sickLeave: parseSickLeave(object.sickLeave),
      };
    default:
      return assertNever(parsedEntryType);
  }
};

export default { toNewPatient, toNewEntry };
