import {forkJoin, Observable, ReplaySubject, Subscription} from 'rxjs';
import {EnvironmentInjector} from '@angular/core';

export class DataLoader<T, P> {
    private readonly preReqs: Observable<boolean[]> | undefined;
    private readonly preReqsSub: Subscription | undefined;
    private data: T | undefined;
    private params: P | undefined;
    private preReqsFulfilled: boolean = false;
    private dataSubject = new ReplaySubject<T>()
    private dataObservable = this.dataSubject.asObservable();

    constructor(private injector: EnvironmentInjector,
                loader: (param: T) => T | undefined, preReqs: Observable<boolean>[]) {
        if (preReqs && preReqs.length > 0) {
            this.preReqs = forkJoin(preReqs)
            this.preReqsSub = this.preReqs.subscribe(val => this.preReqChanged(val));
        } else {
            this.preReqsFulfilled = true;
        }
    }

    close() {
        if (this.preReqsSub) {
            this.preReqsSub.unsubscribe();
        }
    }

    public load() {
        if (this.preReqsFulfilled) {

        }
    }

    private preReqChanged(results: boolean[]) {
        if (this.preReqsFulfilled && (results.length > 0 && results.includes(false))) {
            this.preReqsFulfilled = false
        } else if (!this.preReqsFulfilled && (results.length == 0 || !results.includes(false))) {
            this.preReqsFulfilled = true
        }
    }

    public getData(): Observable<T> {
        return this.dataObservable;
    }

    public getDataValue(): T | undefined {
        return this.data;
    }
}
