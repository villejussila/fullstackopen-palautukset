import React from 'react';
import { Field, Formik, Form } from 'formik';
import { Entry, EntryType } from '../types';
import {
  DiagnosisSelection,
  NumberField,
  TextField,
} from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import { Button, Dropdown, Grid } from 'semantic-ui-react';

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;
export type EntryFormValues = UnionOmit<Entry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  const entryTypes: EntryType[] = [
    'HealthCheck',
    'Hospital',
    'OccupationalHealthcare',
  ];

  const entryValues: EntryFormValues[] = [
    {
      date: '',
      description: '',
      specialist: '',
      type: 'HealthCheck',
      diagnosisCodes: [],
      healthCheckRating: 0,
    },
    {
      date: '',
      description: '',
      specialist: '',
      type: 'Hospital',
      diagnosisCodes: [],
      discharge: {
        criteria: '',
        date: '',
      },
    },
    {
      date: '',
      description: '',
      specialist: '',
      type: 'OccupationalHealthcare',
      diagnosisCodes: [],
      employerName: '',
      sickLeave: {
        startDate: '',
        endDate: '',
      },
    },
  ];

  const initialSelectedValue = entryValues[0];
  const [selectedEntryType, setSelectedEntryType] = React.useState(
    initialSelectedValue.type
  );

  const isEntryType = (entryType: string): entryType is EntryType => {
    const availableTypes = [
      'Hospital',
      'HealthCheck',
      'OccupationalHealthcare',
    ];
    return availableTypes.includes(entryType);
  };

  const handleChangeType = (
    event: React.SyntheticEvent<HTMLElement, Event>
  ): void => {
    const currentType = event.currentTarget.innerText;
    if (isEntryType(currentType)) {
      setSelectedEntryType(currentType);
      return;
    }
    console.error(
      `selected entry type: ${currentType} does not match available types`
    );
  };

  return (
    <Formik
      initialValues={initialSelectedValue}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const invalidError = 'Value is invalid';
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        if (!isEntryType(values.type)) {
          errors.type = invalidError;
        }
        if (values.type === 'OccupationalHealthcare') {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, setValues }) => {
        return (
          <Form className="form ui">
            <Dropdown
              value={selectedEntryType}
              fluid
              search
              selection
              options={entryTypes.map((type) => ({
                key: type,
                text: type,
                value: type,
              }))}
              onChange={(
                event: React.SyntheticEvent<HTMLElement, Event>,
                data
              ) => {
                handleChangeType(event);
                setFieldValue('type', data.value);
                const newEntryValues = entryValues.find(
                  (entry) => entry.type === data.value
                );
                setValues(newEntryValues || entryValues[0], false);
              }}
            />
            <Field
              label="date"
              name="date"
              placeholder="YYYY-MM-DD"
              component={TextField}
            />
            <Field
              label="description"
              name="description"
              placeholder="description"
              component={TextField}
            />
            <Field
              label="specialist"
              name="specialist"
              placeholder="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            {selectedEntryType === 'HealthCheck' && (
              <Field
                label="healthCheckRating"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              />
            )}
            {selectedEntryType === 'Hospital' && (
              <>
                <Field
                  label="Discharge criteria"
                  name="discharge.criteria"
                  component={TextField}
                  placeholder="discharge criteria"
                />
                <Field
                  label="Discharge date"
                  name="discharge.date"
                  component={TextField}
                  placeholder="discharge date"
                />
              </>
            )}
            {selectedEntryType === 'OccupationalHealthcare' && (
              <>
                <Field
                  label="Employer name"
                  name="employerName"
                  placeholder="Employer name"
                  component={TextField}
                />
                <Field
                  label="Sick leave start date"
                  name="sickLeave.startDate"
                  component={TextField}
                  placeholder="YYYY-MM-DD"
                />
                <Field
                  label="Sick leave end date"
                  name="sickLeave.endDate"
                  component={TextField}
                  placeholder="YYYY-MM-DD"
                />
              </>
            )}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
