import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSourceService } from './dataSource.service';

@Injectable({
    providedIn: 'root',
})
export class SensorDataService {
    constructor(private dataSource: DataSourceService) {}

    getSensors() {
        return ['temperature', 'humidity', 'light', 'sound'];
    }

    getRooms() {
        return ['livingroom', 'bedroom', 'hall', 'toilet'];
    }

    getSensorData(filters: any): Observable<any> {
        return this.dataSource.get('/api/measurements', filters);
    }

    downloadJson(filters: any): Observable<any> {
        return this.dataSource.downloadJson('/api/measurements/json', filters);
    }

    downloadCsv(filters: any): Observable<any> {
        return this.dataSource.downloadCsv('/api/measurements/csv', filters);
    }
}
