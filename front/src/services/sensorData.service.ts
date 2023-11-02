import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SensorDataService {
  private apiUrl = 'your-api-url'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getSensorData(filters: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sensors`, { params: filters });
  }

  // Method to download data in CSV/JSON format, implement as needed based on your API
}
