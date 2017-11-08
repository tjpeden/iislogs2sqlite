import { Component, OnInit } from '@angular/core';

import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = true;

  files: string[] = [];

  constructor(private electron: ElectronService) { }

  ngOnInit() {
    this.electron
    .connect()
    .then(() => this.loading = false)
    .catch(error => console.error(error));
  }

  ingest(event: DragEvent) {
    event.preventDefault();

    const { dataTransfer } = event;
    const { items } = dataTransfer;

    dataTransfer.dropEffect = 'move';

    this.loading = true;

    this.files = Array
    .from(items)
    .filter(item => item.kind === 'file')
    .map(item => item.getAsFile())
    .map(file => file.path);

    const ingestFile = (): Promise<any> => {
      if (this.files.length > 0) {
        return this.electron
        .ingest(this.files.shift())
        .then(ingestFile);
      }
    }

    ingestFile()
    .catch(console.error)
    .then(() => this.loading = false);
  }
}
