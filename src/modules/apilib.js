import moment from 'moment';

var db = {
  users: [
    {
      id: 0,
      login: 'doktor1',
      password: 'doktor1',
      profile: {
        name: {
          first: 'Иван',
          second: 'Иванов',
          third: 'Иванович',
        },
        workname: 'Терапевт',
      },
    },
    {
      id: 1,
      login: 'doktor2',
      password: 'doktor2',
      profile: {
        name: {
          first: 'Алиса',
          second: 'Асила',
          third: 'Ила',
        },
        workname: 'Стоматолог',
      },
    },
  ],
  meetings: [],
  patients: [
    {
      id: 0,
      name: {
        first: 'Имя1',
        second: 'Фамилия1',
        third: 'Отчество1',
      },
      sex: 'male',
      dateOfBirth: 946666800000,
      passport: {
        series: 1111,
        number: 111111,
        issuedBy: 'МФЦ Какой то там области 1',
        issuedDate: 1388512800000,
        pic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pasport_RF.jpg/800px-Pasport_RF.jpg',
      },
      polis: {
        number: '1010101010101010',
        validity: 1388510000000,
        pic: 'http://www.tood-tula.ru/sites/default/files/kcfinder/images/oms/oms-polis.jpg',
      },
      medcard: 'Какая то там поликлиника №0',
      tel: ['71234567890', '70000000001', '70000000002'],
    },
    {
      id: 1,
      name: {
        first: 'Имя2',
        second: 'Фамилия2',
        third: 'Отчество2',
      },
      sex: 'female',
      dateOfBirth: 944938800000,
      passport: {
        series: 2222,
        number: 222222,
        issuedBy: 'МФЦ Какой то там области 2',
        issuedDate: 1386784800000,
        pic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pasport_RF.jpg/800px-Pasport_RF.jpg',
      },
      polis: {
        number: '2000000000000000',
        validity: 0,
        pic: 'http://www.tood-tula.ru/sites/default/files/kcfinder/images/oms/oms-polis.jpg',
      },
      medcard: 'Какая то там поликлиника №1',
      tel: ['79999999999'],
    },
  ],
  templates: {
    Справка: [
      {
        text: 'Справка (Пример)',
        x: 100,
        y: 100,
      },
    ],
    'Тест параметров': [
      {
        text: 'ИФ (40): {name.first&name.second$40}',
        x: 100,
        y: 100,
      },
    ],
    'Тест с неизвестными параметрами': [
      {
        text: 'НП: {unknownparam1}',
        x: 100,
        y: 100,
      },
    ],
  },
};

var nn = moment().format('YYYYMMDD');

for (let i = 0; i < 35; i++) {
  db.meetings.push({
    id: i,
    time: +moment(nn).add(30 * i, 'm'),
    doktor: 0,
    patient: i % 2 === 0 ? 0 : 1,
  });
}

function dbfind(collection, iffer, one = true) {
  var data = db[collection].filter(iffer);
  if (data.length > 0) {
    return one ? data[0] : data;
  } else {
    return null;
  }
}

function ok(response = null) {
  if (!response) response = {};
  return { status: 200, response, ok: true };
}

function err(error = null, status = 400) {
  if (!error) error = 'Unknown error';
  return { status, error, ok: false };
}

export function apiAuth(login, password) {
  var user = dbfind('users', (e) => {
    return e.login === login && e.password === password;
  });
  if (user) {
    return ok(user);
  } else {
    return err('Bad password');
  }
}

export function apiGetNowMeetings(doktorId) {
  var out = [];

  var nowTime = +new Date();

  db.meetings.map((meeting) => {
    if (
      meeting.time < nowTime + 1000 * 60 * 60 * 2 &&
      meeting.time > nowTime - 1000 * 60 * 60 * 2 &&
      meeting.doktor === doktorId
    ) {
      var patientData = dbfind('patients', (e) => {
        return e.id === meeting.patient;
      });
      if (patientData) {
        out.push({
          id: meeting.id,
          time: moment(meeting.time).format('HH:mm'),
          name: `${patientData.name.second} ${patientData.name.first[0]}. ${patientData.name.third[0]}.`,
          patient: patientData.id,
        });
      }
    }
  });
  return out;
}

export function apiGetPatient(id) {
  var patient = dbfind('patients', (e) => {
    return e.id === id;
  });
  return patient;
}
export default ok;

export function getDB() {
  return db;
}

export function getTemplates() {
  return {
    list: Object.keys(db.templates),
    data: db.templates,
  };
}

export function templateNameExists(name) {
  return db.templates[name] != undefined;
}

export function templateAdd(name, divs) {
  db.templates[name] = divs;
}

export function templateConvertParam(text) {
  var dt = text.match(/\{[0-9a-zA-Zа-яА-Я\_\-\$\&\.]+?\}/gm);
  return dt
    ? dt.map((e) => {
        var work = e.slice(1, e.length - 1).split('$');
        var len = work.length > 1 ? +work.pop() : 1;
        var params = work.join('$').split('&');
        return {
          len,
          params,
          e,
        };
      })
    : [];
}

export function templateConvertParams(templateName) {
  var out = [];
  db.templates[templateName].map(({ text }) => {
    out = out.concat(templateConvertParam(text));
  });
  return out;
}

export function dots(obj, text) {
  var t = text.split('.');
  for (let i = 0; i < t.length; i++) obj = obj[t[i]];
  return obj;
}

export function templateDelete(templateName) {
  delete db.templates[templateName];
}
