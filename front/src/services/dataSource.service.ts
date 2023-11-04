import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';
@Injectable({
    providedIn: 'root',
})
export class DataSourceService {
    hostUrl = '';
    constructor(private http: HttpClient) {
        this.hostUrl = environment.apiUrl;
    }

    downloadFile(
        url: string,
        queryParams: any,
        fileName: string,
        fileType: string
    ): Observable<Blob> {
        let params = new HttpParams();
        for (const key in queryParams) {
            if (queryParams.hasOwnProperty(key)) {
                params = params.append(key, queryParams[key]);
            }
        }

        return this.http.get(url, {
            responseType: 'blob',
            observe: 'body',
            params: params,
        });
    }

    downloadJson(restMapping: string, queryParams: any): Observable<Blob> {
        return this.downloadFile(
            `${this.hostUrl}${restMapping}`,
            queryParams,
            'data.json',
            'text/json'
        );
    }

    downloadCsv(restMapping: string, queryParams: any): Observable<Blob> {
        const url = '/api/csv'; // API endpoint for CSV file
        return this.downloadFile(
            `${this.hostUrl}${restMapping}`,
            queryParams,
            'data.csv',
            'text/csv'
        );
    }

    // Get
    get(restMapping: string, data = {}): Observable<object> {
        return this.http.get(`${this.hostUrl}${restMapping}`, { params: data });
    }

    // Create
    post(restMapping: string, data: any, httpParam?: boolean): Observable<any> {
        const requestParams = this.prepareRequestParams(data, httpParam);

        return this.http.post(
            `${this.hostUrl}${restMapping}`,
            requestParams.dataPost,
            {
                headers: requestParams.headerOptions,
                responseType: 'json',
            }
        );
    }

    // Update
    put(
        restMapping: string,
        data: any = {},
        httpParam?: boolean
    ): Observable<any> {
        const requestParams = this.prepareRequestParams(data, httpParam);

        return this.http.put(
            `${this.hostUrl}${restMapping}`,
            requestParams.dataPost,
            {
                headers: requestParams.headerOptions,
                responseType: 'json',
            }
        );
    }

    // Delete
    delete(restMapping: string): Observable<object> {
        return this.http.delete(`${this.hostUrl}${restMapping}`);
    }

    // Get File
    getFile(restMapping: string, data = {}): Observable<object> {
        return this.http.get(`${this.hostUrl}${restMapping}`, {
            responseType: 'blob' as 'json',
            params: data,
        });
    }

    // Create File
    postFile(
        restMapping: string,
        file: FormData,
        data: any = {}
    ): Observable<string> {
        return this.http.post(`${this.hostUrl}${restMapping}`, file, {
            params: data,
            responseType: 'text',
        });
    }

    updateParams(restMapping: string, data: any = {}): Observable<string> {
        const requestParams = this.prepareRequestParams(data, true);
        return this.http.put(
            `${this.hostUrl}${restMapping}`,
            requestParams.dataPost,
            {
                params: data,
                responseType: 'text',
            }
        );
    }

    private prepareRequestParams(data: any, httpParam?: boolean) {
        let headerOptions = {};
        let dataPost = new HttpParams();

        if (httpParam !== undefined) {
            headerOptions = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            Object.keys(data).forEach((key) => {
                dataPost = dataPost.append(key, data[key]);
            });
        } else {
            headerOptions = {};
            dataPost = data;
        }

        // headerOptions = { ...headerOptions,  "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Headers": "Content-Type"}

        return { headerOptions, dataPost };
    }
}
