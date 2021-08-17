import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';
import {
  Patient,
  NewPatient,
  PublicPatient,
  Entry,
  EntryWithoutId,
} from '../types';

const getPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: EntryWithoutId): Entry => {
  const entryId = uuid();
  const newEntry = {
    id: entryId,
    ...entry,
  };
  const toPatient = patients.find((patient) => patient.id === id);
  toPatient?.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatientById,
  addPatient,
  addEntry,
};
