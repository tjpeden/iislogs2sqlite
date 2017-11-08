import * as knex from 'knex';

export class Database {
  private knex;

  connect(filename: string) {
    this.knex = knex({
      client: 'sqlite3',
      connection: { filename },
      useNullAsDefault: true,
    });
  }

  createTable(): Promise<any> {
    return this.knex.schema
    .createTableIfNotExists('logs', table => {
      table.increments();
      table.text('date');
      table.text('time');
      table.text('s_sitename');
      table.text('s_computername');
      table.text('s_ip');
      table.text('cs_method');
      table.text('cs_uri_stem');
      table.text('cs_uri_query');
      table.integer('s_port');
      table.text('cs_username');
      table.text('c_ip');
      table.text('cs_version');
      table.text('cs_user_agent');
      table.text('cs_cookie');
      table.text('cs_referer');
      table.text('cs_host');
      table.integer('sc_status');
      table.integer('sc_substatus');
      table.integer('sc_win32_status');
      table.integer('sc_bytes');
      table.integer('cs_bytes');
      table.integer('time_taken');
    });
  }

  bulkInsert(callback): Promise<any> {
    return this.knex.transaction(trx => {
      return callback(record => {
        return this.knex.insert(record).into('logs').transacting(trx);
      });
    });
  }
}
