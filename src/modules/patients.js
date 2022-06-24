import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { apiGetNowMeetings } from './apilib';
import { useNavigate, Link } from 'react-router-dom';

export default function DenseTable() {
  let navigate = useNavigate();
  const rows = apiGetNowMeetings(JSON.parse(localStorage.getItem('$')).id);
  return rows.length ? (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Пациент</TableCell>
            <TableCell>Время</TableCell>
            <TableCell>Карточка</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td      , &:last-child th': { border: 0 } }}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>
                <Link to={`/patient/${row.patient}`}>Перейти</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <>На ближайшие 2 часа, пациентов нет.</>
  );
}
