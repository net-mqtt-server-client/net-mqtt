import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { EventService, Events } from 'src/services/event.service';
import { SensorDataService } from 'src/services/sensorData.service';

@Component({
  selector: 'app-sensor-data',
  templateUrl: './sensor-data.component.html',
  styleUrls: ['./sensor-data.component.scss'],
})
export class SensorDataComponent implements OnInit {
  filterForm: FormGroup = this.formBuilder.group({
    sensorType: undefined,
    sortingField: 'sensorType',
    sortingDirection: 'ASC',
  });

  sensorData: any[] = [];
  cols: any[] = [
    { field: 'date', header: 'Date' },
    { field: 'sensorType', header: 'Sensor Type' },
    { field: 'sensorInstance', header: 'Sensor Instance' },
    { field: 'value', header: 'Value' },
    // ... define other columns
  ];
  chartData: any = [];
  connection: any;
  loading = false;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private sensorDataService: SensorDataService,
    private formBuilder: FormBuilder,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('wss://localhost:28234/notify')
      .build();

    this.connection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err: any) =>
        console.log('Error while starting connection: ' + err)
      );

    this.eventService.on(Events.FILTER).subscribe((data: any) => {
      console.log('FILTER: ', data);
      this.fetchData();
    });

    this.fetchData();
  }

  addTransferChartDataListener = () => {
    this.connection.on('transferchartdata', (data: any) => {
      console.log(data);
    });
  };

  fetchData() {
    this.loading = true;
    this.sensorDataService
      .getSensorData(this.cleanObj(this.filterForm.value))
      .subscribe((data) => {
        this.sensorData = data;
        this.loading = false;
      });
  }

  cleanObj(obj: any) {
    return Object.keys(obj).reduce(
      (acc, key) =>
        obj[key] === undefined || obj[key] === null || obj[key] === ''
          ? acc
          : { ...acc, [key]: obj[key] },
      {}
    );
  }

  onSort(event: any) {
    this.filterForm.controls['sortingField'].setValue(event.field, {
      emitEvent: false,
    });
    this.filterForm.controls['sortingDirection'].setValue(
      event.order === -1 ? 'DESC' : 'ASC',
      { emitEvent: false }
    );
    this.eventService.broadcast(Events.FILTER);
  }

  // Methods for filtering, sorting, downloading data, etc.
}
