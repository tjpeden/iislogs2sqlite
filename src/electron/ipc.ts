import { readFile, createReadStream } from 'fs';

import { BrowserWindow, ipcMain as ipc, dialog } from 'electron';

import * as parse from 'csv-parse';

import { Database } from './database';

const database = new Database();

const columns = [
  'date',
  'time',
  's_sitename',
  's_computername',
  's_ip',
  'cs_method',
  'cs_uri_stem',
  'cs_uri_query',
  's_port',
  'cs_username',
  'c_ip',
  'cs_version',
  'cs_user_agent',
  'cs_cookie',
  'cs_referer',
  'cs_host',
  'sc_status',
  'sc_substatus',
  'sc_win32_status',
  'sc_bytes',
  'cs_bytes',
  'time_taken'
];

function log2sqlite(file: string) {
  return (insert: Function): Promise<any> => {
    return new Promise((resolve, reject) => {
      const inserts = [];
      const stream = createReadStream(file);
      const parser = parse({
        columns,
        delimiter: ' ',
        comment: '#',
        quote: false,
        relax_column_count: true,
      });

      parser.on('readable', () => {
        let record;
        while (record = parser.read()) {
          inserts.push(insert(record));
        }
      });

      parser.on('error', error => {
        console.log(error);
        reject(error);
      });

      parser.on('end', () => {
        Promise.all(inserts).then(() => resolve());
      });

      stream.pipe(parser);
    });
  }
}

ipc.on('connect', event => {
  dialog.showSaveDialog({
    title: 'Open Databse',
    message: 'Choose a SQLite Database file.',
    showsTagField: false,
    filters: [
      { name: 'SQLite Database', extensions: ['sqlite3', 'sqlite'] },
    ],
  }, filename => {
    if (filename) {
      database.connect(filename);
      database.createTable()
      .then(() => event.sender.send('connect-result'))
      .catch(error => event.sender.send('connect-result', error));
    }
  });
});

ipc.on('ingest', (event, file: string) => {
  console.log('ingest:', file);
  database.bulkInsert(log2sqlite(file))
  .then(() => {
    event.sender.send('ingest-result');
  })
  .catch(error => {
    console.log(error);
    event.sender.send('ingest-result', error);
  });
});
