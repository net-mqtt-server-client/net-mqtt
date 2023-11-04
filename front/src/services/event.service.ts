import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { filter, map } from 'rxjs/operators';

export enum Events {
    FILTER,
    RESET_FILTER,
    LOGOUT,
}

interface BroadcastEvent {
    key: any;
    data?: any;
}

@Injectable({
    providedIn: 'root',
})
export class EventService {
    private _eventBus: Subject<BroadcastEvent>;

    constructor() {
        this._eventBus = new Subject<BroadcastEvent>();
    }

    broadcast(key: any, data?: any) {
        this._eventBus.next({ key, data });
    }

    on<T>(key: any): Observable<T> {
        return this._eventBus.asObservable().pipe(
            filter((event: any) => event.key === key),
            map((event: any) => <T>event.data)
        );
    }
}
