import * as React from 'react';
import { Grid, Paper, Button } from '@mui/material';
import DenseTable from '../modules/patients';

import BasicNavigator from './BasicNavigator';

import { getDB } from '../modules/apilib';

export default function Dashboard() {
  return (
    <BasicNavigator>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '0 1.5em 0 1.5em',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <h2>Список пациентов на ближайшие 2 часа</h2>
              <div>{/* <Button variant="outlined">Без очереди</Button> */}</div>
            </div>
            <DenseTable />
          </Paper>
        </Grid>
      </Grid>
    </BasicNavigator>
  );
}
