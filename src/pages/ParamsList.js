import * as React from 'react';
import {
  Grid,
  Paper,
  Button,
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import BasicNavigator from './BasicNavigator';

export default function ParamsList() {
  var structure = {
    name: {
      first: 'Имя',
      second: 'Фамилия',
      third: 'Отчество',
    },
    sex: 'Пол (на английском)',
    dateOfBirth: 'Дата рождения (в UNIX)',
    passport: {
      series: 'Серия паспорта',
      number: 'Номер паспорта',
      issuedBy: 'Кем выдан паспорт',
      issuedDate: 'Когда выдан паспорт (в UNIX)',
      pic: 'URL скана паспорта',
    },
    polis: {
      number: 'Номер полиса',
      validity: 'Срок действия полиса',
      pic: 'URL скана полиса',
    },
    medcard: 'Медкарта',
  };
  var rows = [];
  function deeper(now, parent = '') {
    Object.keys(now).forEach((key) => {
      var n = now[key];
      if (typeof n == 'object') {
        deeper(n, parent + '.' + key);
      } else {
        rows.push({ name: (parent != '' ? parent.slice(1) + '.' : '') + key, desc: n });
      }
    });
  }
  deeper(structure);

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
              <h2>Список параметров для шаблона</h2>
            </div>
            <TableBody component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Параемтр</TableCell>
                    <TableCell>Описание</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={1}
                      sx={{ '&:last-child td      , &:last-child th': { border: 0 } }}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableBody>
          </Paper>
        </Grid>
      </Grid>
    </BasicNavigator>
  );
}
