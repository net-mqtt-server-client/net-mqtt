import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventService, Events } from 'src/services/event.service';
import { SensorDataService } from 'src/services/sensorData.service';

@Component({
    selector: 'app-sensor-data-filter',
    templateUrl: './sensor-data-filter.component.html',
    styleUrls: ['./sensor-data-filter.component.scss'],
})
export class SensorDataFilterComponent {
    @Input() filterForm!: FormGroup;
    @Input() loading = false;

    locations: any[];
    sensors: any[];
    numbers = [
        {
            label: '50',
            value: 50,
        },
        {
            label: '100',
            value: 100,
        },
        {
            label: '250',
            value: 250,
        },
    ];
    downloadItems = [
        {
            label: 'Options',
            items: [
                {
                    label: 'CSV',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        this.downloadCSV();
                    },
                },
                {
                    label: 'JSON',
                    icon: 'pi pi-code',
                    command: () => {
                        this.downloadJSON();
                    },
                },
            ],
        },
    ];

    constructor(
        @Inject(DOCUMENT) public document: Document,
        private eventService: EventService,
        private sensorDataService: SensorDataService
    ) {
        this.locations = this.sensorDataService.getRooms();
        this.sensors = this.sensorDataService.getSensors();
    }

    sendFilter() {
        this.eventService.broadcast(Events.FILTER, {
            ...this.filterForm.value,
        });
    }

    resetFilter() {
        // const number = this.filterForm.controls['number'].value;
        const order = this.filterForm.controls['order'].value;
        const orderBy = this.filterForm.controls['orderBy'].value;
        this.filterForm.reset();
        // this.filterForm.controls['number'].setValue(number || 100);
        this.filterForm.controls['order'].setValue(order || 'asc');
        this.filterForm.controls['orderBy'].setValue(orderBy || 'value');
        this.eventService.broadcast(Events.RESET_FILTER, {
            ...this.filterForm.value,
        });
    }

    downloadCSV() {
        this.sensorDataService
            .downloadCsv(this.cleanObj(this.filterForm.value))
            .subscribe((data: any) => {
                console.log(data);
                this.triggerDownload(data, 'data.csv');
            });
    }

    downloadJSON() {
        this.sensorDataService
            .downloadJson(this.cleanObj(this.filterForm.value))
            .subscribe((data: any) => {
                console.log(data);
                this.triggerDownload(data, 'data.json');
            });
    }

    private triggerDownload(blob: Blob, fileName: string) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
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
}
