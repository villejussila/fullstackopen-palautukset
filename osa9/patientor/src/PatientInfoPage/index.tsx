import React, { useEffect } from 'react';
import axios from 'axios';
import {
  Icon,
  SemanticCOLORS,
  Divider,
  Segment,
  Button,
} from 'semantic-ui-react';
import { useParams } from 'react-router';

import { apiBaseUrl } from '../constants';
import {
  Entry,
  Patient,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HospitalEntry,
} from '../types';
import { addEntry, updatePatient, useStateValue } from '../state';
import AddEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div key={entry.id}>
      <h4>{entry.date}</h4>
      <Segment>{entry.description}</Segment>
      <ul>
        {console.log(entry)}

        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[code]?.name}
          </li>
        ))}
      </ul>
      <div>Discharge criteria: {entry.discharge?.criteria}</div>
      <div>Discharge date: {entry.discharge?.date}</div>
      <Divider />
    </div>
  );
};
const OccupationalHealthcareEntryDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div key={entry.id}>
      <h4>{entry.date}</h4>
      <Icon name="stethoscope" size="big" /> {entry.employerName}
      <Segment>{entry.description}</Segment>
      {entry.sickLeave?.startDate && entry.sickLeave?.endDate && (
        <div>
          <div>Sick leave start date: {entry.sickLeave?.startDate}</div>
          <div>Sick leave end date: {entry.sickLeave?.endDate}</div>
        </div>
      )}
      <ul>
        {console.log(entry)}
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[code]?.name}
          </li>
        ))}
      </ul>
      <Divider />
    </div>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  const [{ diagnoses }] = useStateValue();
  const colors: SemanticCOLORS[] = ['green', 'yellow', 'orange', 'red'];
  const healthCheckRatingColor = colors[Number(entry.healthCheckRating)];

  return (
    <div key={entry.id}>
      <h4>{entry.date}</h4>
      <Icon name="doctor" size="big" />
      <Segment>{entry.description}</Segment>

      <Icon name="heart" color={healthCheckRatingColor} />
      <ul>
        {console.log(entry)}

        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses[code]?.name}
          </li>
        ))}
      </ul>
      <Divider />
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryDetails entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case 'HealthCheck':
      return <HealthCheckEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string }>();

  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );

      console.log(newEntry);
      dispatch(addEntry(newEntry, id));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );

        dispatch(updatePatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    if (!patients[id]?.ssn) {
      void fetchPatient();
    }
  }, [id]);

  if (patients[id]) {
    return (
      <div>
        <h1>{patients[id].name}</h1>
        <p>gender: {patients[id].gender}</p>
        <p>ssn: {patients[id].ssn}</p>
        <p>occupation: {patients[id].occupation}</p>
        <h3>Entries</h3>
        {patients[id].entries?.map((entry) => (
          <EntryDetails entry={entry} key={entry.id} />
        ))}
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()}>Add New Entry</Button>
      </div>
    );
  }
  return null;
};

export default PatientInfoPage;
