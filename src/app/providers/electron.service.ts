import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';

@Injectable()
export class ElectronService {
  private ipc: typeof ipcRenderer;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipc = window.require('electron').ipcRenderer;
    }
  }

  isElectron() {
    return window && window.process && window.process.type;
  }

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.ipc.send('connect');
      this.ipc.once('connect-result', (event, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      })
    });
  }

  ingest(file: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.ipc.send('ingest', file);
      this.ipc.once('ingest-result', (event, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }
}
