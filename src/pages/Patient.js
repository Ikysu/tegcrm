//@ts-nocheck
import * as React from 'react';
import {
  Grid,
  Paper,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  Box,
  Typography,
} from '@mui/material';
import BasicNavigator from './BasicNavigator';
import TemplatesDialog from './TemplatesDialog';
import { useParams } from 'react-router-dom';
import { apiGetPatient } from '../modules/apilib';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function Patient() {
  const [value, setValue] = React.useState(0);

  const tabChange = (event, newValue) => {
    setValue(newValue);
  };

  let params = useParams();
  var patientData = apiGetPatient(+params.patientId);

  function tels() {
    var out = [];
    for (let i = 0; i < patientData.tel.length; i++) {
      var nowTel = patientData.tel[i];
      out.push(
        <TextField
          variant="outlined"
          value={`+${nowTel[0]} (${nowTel.slice(1, 4)}) ${nowTel.slice(4, 7)}-${nowTel.slice(
            7,
            9,
          )}-${nowTel.slice(9, 11)}`}
          inputProps={{ readOnly: true }}
        />,
      );
    }
    return out;
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}>
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <BasicNavigator>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs onChange={tabChange} aria-label="lab API tabs example">
            <Tab label="Карточка" {...a11yProps(0)} />
            <Tab label="Сканы" {...a11yProps(1)} />

            <TemplatesDialog patientData={patientData} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper>
                <div
                  style={{
                    padding: '0 1.5em 0 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <h2>Общее</h2>
                </div>
                <div
                  style={{
                    padding: '0 1.5em 0 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <TextField
                    label="Имя"
                    variant="outlined"
                    value={patientData.name.first}
                    inputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Фамилия"
                    variant="outlined"
                    value={patientData.name.second}
                    inputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Отчество"
                    variant="outlined"
                    value={patientData.name.third}
                    inputProps={{ readOnly: true }}
                  />
                  <DesktopDatePicker
                    label="Дата рождения"
                    inputFormat="MM/dd/yyyy"
                    value={patientData.dateOfBirth}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                <div
                  style={{
                    padding: '1em 1.5em 0.5em 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <RadioGroup value={patientData.sex} name="radio-buttons-group" row>
                    <FormControlLabel value="male" control={<Radio />} label="Мужской" />
                    <FormControlLabel value="female" control={<Radio />} label="Женский" />
                  </RadioGroup>
                </div>

                <Divider sx={{ my: 1 }} />

                <div
                  style={{
                    padding: '0 1.5em 0 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <h2>Паспортные данные</h2>
                </div>
                <div
                  style={{
                    padding: '0 1.5em 1.5em 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      width: '50%',

                      justifyContent: 'space-between',
                    }}>
                    <TextField
                      label="Серия и номер"
                      variant="outlined"
                      value={
                        ('' + patientData.passport.series).slice(0, 2) +
                        ' ' +
                        ('' + patientData.passport.series).slice(2, 4) +
                        ' ' +
                        patientData.passport.number
                      }
                      inputProps={{ readOnly: true }}
                    />
                    <DesktopDatePicker
                      label="Дата выдачи"
                      inputFormat="MM/dd/yyyy"
                      value={patientData.passport.issuedDate}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <TextField
                    label="Кем выдан"
                    variant="outlined"
                    value={patientData.passport.issuedBy}
                    inputProps={{ readOnly: true }}
                    style={{
                      width: '45%',
                    }}
                  />
                </div>

                <Divider sx={{ my: 1 }} />

                <div
                  style={{
                    padding: '0 1.5em 0 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <h2>Полис</h2>
                </div>
                <div
                  style={{
                    padding: '0 1.5em 0 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '50%',
                  }}>
                  <TextField
                    label="Номер"
                    variant="outlined"
                    value={patientData.polis.number}
                    inputProps={{ readOnly: true }}
                  />
                  {patientData.polis.validity ? (
                    <DesktopDatePicker
                      label="Срок действия*"
                      inputFormat="MM/dd/yyyy"
                      value={patientData.polis.validity}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  ) : (
                    <TextField
                      label="Срок действия*"
                      variant="outlined"
                      value="Не указанно"
                      inputProps={{ readOnly: true }}
                      disabled={true}
                    />
                  )}
                </div>
                <div
                  style={{
                    padding: '1.5em 1.5em 0 1.5em',
                    color: 'gray',
                  }}>
                  *Не указывается для застрахованных лиц, постоянно проживающих в Российской
                  Федерации
                </div>

                <Divider sx={{ my: 1 }} />

                <div
                  style={{
                    padding: '0 1.5em 0 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <h2>Телефоны</h2>
                </div>
                <div
                  style={{
                    padding: '0 1.5em 1.5em 1.5em',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  {tels()}
                </div>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <img
              src={patientData.passport.pic}
              style={{
                width: '48%',
              }}
            />
            <img
              src={patientData.polis.pic}
              style={{
                width: '48%',
              }}
            />
          </div>
        </TabPanel>
      </Box>
    </BasicNavigator>
  );
}

/*




*/
