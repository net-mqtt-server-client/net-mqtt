import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { EventService, Events } from 'src/services/event.service';
import { SensorDataService } from 'src/services/sensorData.service';

@Component({
    selector: 'app-sensor-data',
    templateUrl: './sensor-data.component.html',
    styleUrls: ['./sensor-data.component.scss'],
})
export class SensorDataComponent implements OnInit, OnDestroy {
    filterForm: FormGroup = this.formBuilder.group({
        location: undefined,
        sensor: undefined,
        order: 'asc',
        orderBy: undefined,
        number: undefined,
    });

    sensorData: any;
    infoPanelSensorData: any = {
        temperature: { lastValue: null, average: null, values: [] },
        humidity: { lastValue: null, average: null, values: [] },
        sound: { lastValue: null, average: null, values: [] },
        light: { lastValue: null, average: null, values: [] },
    };
    cols: any[] = [
        { field: 'sensor', header: 'Sensor Type' },
        { field: 'location', header: 'Location' },
        { field: 'value', header: 'Value' },
        { field: 'timeStamp', header: 'Time Stamp' },
    ];
    itemsSkeletonElements: any[] = this.generateBomItemsSkeletonElements(10);
    connection: any;
    loading = false;

    chartDataTemperature: any = {
        labels: [],
        datasets: [],
    };

    chartDataHumidity: any = {
        labels: [],
        datasets: [],
    };

    chartDataLight: any = {
        labels: [],
        datasets: [],
    };

    chartDataSound: any = {
        labels: [],
        datasets: [],
    };

    options: any;
    textColor: any;
    documentStyle: any;

    private subscriptions: Subscription[] = [];

    constructor(
        @Inject(DOCUMENT) public document: Document,
        private sensorDataService: SensorDataService,
        private formBuilder: FormBuilder,
        private eventService: EventService
    ) {
        this.initializeChartData();
    }

    ngOnInit() {
        this.loading = true;
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:3000/api/notify')
            .build();

        this.connection
            .start()
            .then(() => {
                console.log('Connection started');
                this.addTransferChartDataListener();
                this.fetchData();
            })
            .catch((err: any) =>
                console.log('Error while starting connection: ' + err)
            );

        this.subscriptions.push(
            this.eventService.on(Events.FILTER).subscribe((data: any) => {
                console.log('FILTER: ', data);
                this.fetchData();
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    addTransferChartDataListener() {
        this.subscriptions.push(
            this.connection.on('RecieveMessage', (data: any) => {
                console.log('RecieveMessage', data);

                const { sensor, value } = data;
                this.updateSensorData(sensor, value);
            })
        );
    }

    updateSensorData(sensorType: string, newValue: number) {
        const sensor = this.infoPanelSensorData[sensorType];

        sensor.values.push(newValue);
        if (sensor.values.length > 100) {
            sensor.values.shift(); // Usuwamy najstarszą wartość, jeśli przekroczyliśmy 100 elementów
        }

        sensor.lastValue = newValue;
        sensor.average = this.calculateAverage(sensor.values);
    }

    calculateAverage(values: number[]): number {
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    generateBomItemsSkeletonElements(length: number) {
        return (this.itemsSkeletonElements = Array.from({ length }).map(
            (_, i) => i
        ));
    }

    fetchData() {
        this.loading = true;
        this.sensorDataService
            .getSensorData(this.cleanObj(this.filterForm.value))
            .subscribe((data) => {
                data.map((d: any) => {
                    d.timeStamp = moment(d.timeStamp).format(
                        'YYYY-MM-DD HH:mm:ss'
                    );
                    return d;
                });
                this.sensorData = data;
                console.log(this.sensorData);
                this.calculateChartData();
                this.loading = false;
            });
    }

    initializeChartData() {
        this.documentStyle = getComputedStyle(document.documentElement);
        this.textColor = this.documentStyle.getPropertyValue('--text-color');
        this.options = {
            scales: {
                x: {
                    ticks: {
                        color: this.textColor,
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: this.textColor,
                    },
                },
            },
            plugins: {
                legend: {
                    labels: {
                        // fullSize: false,
                        usePointStyle: true,
                        color: this.textColor,
                    },
                },
                tooltip: {
                    callbacks: {
                        title: function (tooltipItem: any) {
                            if (tooltipItem[0].dataset.fullValues) {
                                const value =
                                    tooltipItem[0].dataset.fullValues[
                                        tooltipItem[0].dataIndex
                                    ];
                                return `${value.sensor}: ${value.timeStamp}`;
                            }
                            return tooltipItem[0].dataset.label;
                        },
                    },
                },
            },
            // maintainAspectRatio: false,
        };
    }

    calculateChartData() {
        this.chartDataTemperature = {
            labels: [],
            datasets: [
                {
                    label: 'livingroom',
                    data: [],
                    spanGaps: true,
                    fill: false,
                    borderColor:
                        this.documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                },
                {
                    label: 'bedroom',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--red-500'),
                    tension: 0.4,
                },
                {
                    label: 'hall',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--yellow-500'),
                    tension: 0.4,
                },
                {
                    label: 'toilet',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                },
            ],
        };

        this.chartDataHumidity = {
            labels: [],
            datasets: [
                {
                    label: 'livingroom',
                    data: [],
                    spanGaps: true,
                    fill: false,
                    borderColor:
                        this.documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                },
                {
                    label: 'bedroom',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--red-500'),
                    tension: 0.4,
                },
                {
                    label: 'hall',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--yellow-500'),
                    tension: 0.4,
                },
                {
                    label: 'toilet',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                },
            ],
        };

        this.chartDataLight = {
            labels: [],
            datasets: [
                {
                    label: 'livingroom',
                    data: [],
                    spanGaps: true,
                    fill: false,
                    borderColor:
                        this.documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                },
                {
                    label: 'bedroom',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--red-500'),
                    tension: 0.4,
                },
                {
                    label: 'hall',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--yellow-500'),
                    tension: 0.4,
                },
                {
                    label: 'toilet',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                },
            ],
        };

        this.chartDataSound = {
            labels: [],
            datasets: [
                {
                    label: 'livingroom',
                    data: [],
                    spanGaps: true,
                    fill: false,
                    borderColor:
                        this.documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                },
                {
                    label: 'bedroom',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--red-500'),
                    tension: 0.4,
                },
                {
                    label: 'hall',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--yellow-500'),
                    tension: 0.4,
                },
                {
                    label: 'toilet',
                    data: [],
                    fill: false,
                    spanGaps: true,
                    borderColor:
                        this.documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4,
                },
            ],
        };

        this.sensorData.forEach((data: any) => {
            if (data.sensor === 'temperature') {
                // this.chartData.temperature.push(data);
                if (data.location === 'livingroom') {
                    this.chartDataTemperature.datasets[0].data.push(data);
                } else if (data.location === 'bedroom') {
                    this.chartDataTemperature.datasets[1].data.push(data);
                } else if (data.location === 'hall') {
                    this.chartDataTemperature.datasets[2].data.push(data);
                } else if (data.location === 'toilet') {
                    this.chartDataTemperature.datasets[3].data.push(data);
                }
            } else if (data.sensor === 'humidity') {
                // this.chartData.humidity.push(data);

                if (data.location === 'livingroom') {
                    this.chartDataHumidity.datasets[0].data.push(data);
                } else if (data.location === 'bedroom') {
                    this.chartDataHumidity.datasets[1].data.push(data);
                } else if (data.location === 'hall') {
                    this.chartDataHumidity.datasets[2].data.push(data);
                } else if (data.location === 'toilet') {
                    this.chartDataHumidity.datasets[3].data.push(data);
                }
            } else if (data.sensor === 'light') {
                // this.chartData.light.push(data);

                if (data.location === 'livingroom') {
                    this.chartDataLight.datasets[0].data.push(data);
                } else if (data.location === 'bedroom') {
                    this.chartDataLight.datasets[1].data.push(data);
                } else if (data.location === 'hall') {
                    this.chartDataLight.datasets[2].data.push(data);
                } else if (data.location === 'toilet') {
                    this.chartDataLight.datasets[3].data.push(data);
                }
            } else if (data.sensor === 'sound') {
                // this.chartData.sound.push(data);
                if (data.location === 'livingroom') {
                    this.chartDataSound.datasets[0].data.push(data);
                } else if (data.location === 'bedroom') {
                    this.chartDataSound.datasets[1].data.push(data);
                } else if (data.location === 'hall') {
                    this.chartDataSound.datasets[2].data.push(data);
                } else if (data.location === 'toilet') {
                    this.chartDataSound.datasets[3].data.push(data);
                }
            }
        });

        // this.chartData.temperature = this.sortByTimeStampAsc(
        //     this.chartData.temperature
        // );
        // this.chartData.humidity = this.sortByTimeStampAsc(
        //     this.chartData.humidity
        // );
        // this.chartData.light = this.sortByTimeStampAsc(this.chartData.light);
        // this.chartData.sound = this.sortByTimeStampAsc(this.chartData.sound);
        console.log(
            'this.chartDataTemperature',
            structuredClone(this.chartDataTemperature)
        );
        this.sortByDataInDatasets(this.chartDataTemperature);
        this.sortByDataInDatasets(this.chartDataHumidity);
        this.sortByDataInDatasets(this.chartDataLight);
        this.sortByDataInDatasets(this.chartDataSound);
        console.log(
            'this.chartDataTemperature',
            structuredClone(this.chartDataTemperature)
        );
        // this.chartDataTemperature.datasets[0].data = this.sortByTimeStampAsc(
        //     this.chartDataTemperature.datasets[0].data
        // );
        // this.chartDataHumidity.datasets[0].data = this.sortByTimeStampAsc(
        //     this.chartDataHumidity.datasets[0].data
        // );
        // this.chartDataLight.datasets[0].data = this.sortByTimeStampAsc(
        //     this.chartDataLight.datasets[0].data
        // );
        // this.chartDataSound.datasets[0].data = this.sortByTimeStampAsc(
        //     this.chartDataSound.datasets[0].data
        // );

        ({
            values: {
                0: this.chartDataTemperature.datasets[0].data,
                1: this.chartDataTemperature.datasets[1].data,
                2: this.chartDataTemperature.datasets[2].data,
                3: this.chartDataTemperature.datasets[3].data,
            },
            fullValues: {
                0: this.chartDataTemperature.datasets[0].fullValues,
                1: this.chartDataTemperature.datasets[1].fullValues,
                2: this.chartDataTemperature.datasets[2].fullValues,
                3: this.chartDataTemperature.datasets[3].fullValues,
            },
            labels: this.chartDataTemperature.labels,
        } = this.reduceToValue(this.chartDataTemperature));

        ({
            values: {
                0: this.chartDataHumidity.datasets[0].data,
                1: this.chartDataHumidity.datasets[1].data,
                2: this.chartDataHumidity.datasets[2].data,
                3: this.chartDataHumidity.datasets[3].data,
            },
            fullValues: {
                0: this.chartDataHumidity.datasets[0].fullValues,
                1: this.chartDataHumidity.datasets[1].fullValues,
                2: this.chartDataHumidity.datasets[2].fullValues,
                3: this.chartDataHumidity.datasets[3].fullValues,
            },
            labels: this.chartDataHumidity.labels,
        } = this.reduceToValue(this.chartDataHumidity));

        ({
            values: {
                0: this.chartDataLight.datasets[0].data,
                1: this.chartDataLight.datasets[1].data,
                2: this.chartDataLight.datasets[2].data,
                3: this.chartDataLight.datasets[3].data,
            },
            fullValues: {
                0: this.chartDataLight.datasets[0].fullValues,
                1: this.chartDataLight.datasets[1].fullValues,
                2: this.chartDataLight.datasets[2].fullValues,
                3: this.chartDataLight.datasets[3].fullValues,
            },
            labels: this.chartDataLight.labels,
        } = this.reduceToValue(this.chartDataLight));

        ({
            values: {
                0: this.chartDataSound.datasets[0].data,
                1: this.chartDataSound.datasets[1].data,
                2: this.chartDataSound.datasets[2].data,
                3: this.chartDataSound.datasets[3].data,
            },
            fullValues: {
                0: this.chartDataSound.datasets[0].fullValues,
                1: this.chartDataSound.datasets[1].fullValues,
                2: this.chartDataSound.datasets[2].fullValues,
                3: this.chartDataSound.datasets[3].fullValues,
            },
            labels: this.chartDataSound.labels,
        } = this.reduceToValue(this.chartDataSound));

        console.log(this.chartDataTemperature, this.chartDataHumidity);
    }

    sortByDataInDatasets(values: any) {
        values.datasets[0].data = this.sortByTimeStampAsc(
            values.datasets[0].data
        );
        values.datasets[1].data = this.sortByTimeStampAsc(
            values.datasets[1].data
        );
        values.datasets[2].data = this.sortByTimeStampAsc(
            values.datasets[2].data
        );
        values.datasets[3].data = this.sortByTimeStampAsc(
            values.datasets[3].data
        );
    }

    sortByTimeStampAsc(values: any) {
        return values.sort((a: any, b: any) => {
            // Convert timeStamp strings to moment objects and then to Date objects for comparison
            let dateA = moment(a.timeStamp, 'YYYY-MM-DD HH:mm:ss').toDate();
            let dateB = moment(b.timeStamp, 'YYYY-MM-DD HH:mm:ss').toDate();
            return dateA.getTime() - dateB.getTime();
        });
    }

    reduceToValue(data: any) {
        let allData = [
            ...structuredClone(data.datasets[0].data),
            ...structuredClone(data.datasets[1].data),
            ...structuredClone(data.datasets[2].data),
            ...structuredClone(data.datasets[3].data),
        ];

        allData = this.sortByTimeStampAsc(allData);

        let allLabels = allData.reduce(function (p, c, i, a) {
            if (p.indexOf(c) === -1) p.push(c);
            return p;
        }, []);

        const values: any = [[], [], [], []];

        const fullValues: any = [[], [], [], []];

        allLabels.forEach((label: any) => {
            for (let i = 0; i < 4; i++) {
                const index = data.datasets[i].data.findIndex(
                    (d: any) => d.timeStamp === label.timeStamp
                );

                if (index !== -1) {
                    values[i].push(data.datasets[i].data[index].value);
                    fullValues[i].push(data.datasets[i].data[index]);
                    data.datasets[i].data.splice(index, 1);
                } else {
                    values[i].push(null);
                    fullValues[i].push(null);
                }
            }
        });

        allLabels = structuredClone(allLabels).map((l: any) => l.timeStamp);

        return { values, fullValues, labels: allLabels };
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
        this.filterForm.controls['orderBy'].setValue(event.field, {
            emitEvent: false,
        });
        this.filterForm.controls['order'].setValue(
            event.order === -1 ? 'desc' : 'asc',
            { emitEvent: false }
        );
        // this.eventService.broadcast(Events.FILTER);
    }
}
