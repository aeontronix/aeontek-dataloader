import {BehaviorSubject, forkJoin, Observable, ReplaySubject, Subscription} from 'rxjs';
import {EnvironmentInjector} from '@angular/core';

export class DataLoader<T> {
    private readonly preReqs: Observable<boolean[]> | undefined;
    private readonly preReqsSub: Subscription | undefined;
    private paramsValues: Map<string, any> = new Map<string, any>();
    private preReqSubject;
    private data: T | undefined;
    private dataSubject = new ReplaySubject<T>()
    private dataObservable = this.dataSubject.asObservable();

    constructor(private injector: EnvironmentInjector, preReqs: Observable<boolean>[]) {
        if (preReqs && preReqs.length > 0) {
            this.preReqs = forkJoin(preReqs)
            this.preReqsSub = this.preReqs.subscribe(val => this.preReqChanged(val));
            this.preReqSubject = new BehaviorSubject<boolean>(false)
        } else {
            this.preReqSubject = new BehaviorSubject<boolean>(false)
        }
    }

    close() {
        if (this.preReqsSub) {
            this.preReqsSub.unsubscribe();
        }
    }

    private preReqChanged(results: boolean[]) {

    }

    public getDataObservable(): Observable<T> {
        return this.dataObservable;
    }

    public getData(): T | undefined {
        return this.data;
    }
}
