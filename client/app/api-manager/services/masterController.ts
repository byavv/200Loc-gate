import {Injectable} from '@angular/core';
import {Observable, Subject, ReplaySubject, Observer} from 'rxjs';
import {Config} from '../../shared/models';

@Injectable()
export class MasterController {
    init$: ReplaySubject<any> = new ReplaySubject();
    validate$: ReplaySubject<any> = new ReplaySubject();
    error$: Subject<any> = new Subject();

    config: any = {};

    validation = {
        general: true,
        plugins: true
    };

    getValidity(key) {
        return this.validation[key];
    }

    setValidity(key, value) {
        this.validation[key] = value;
        this.validate$.next(this.validation);
    }

    validate(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            const error = Object.keys(this.validation).find(key => !this.validation[key]);
            console.log(error)
            if (error) {
                observer.error(error);
                this.error$.next(error);
            } else {
                observer.next(null);
                observer.complete();
            }
        })
    }

    isValid(key): Observable<any> {
        return this.validate$.pluck(key);
    }

    init(conf) {
        Object.assign(this.config, conf);
        this.validate$.next(this.validation);
        this.init$.next(this.config);
    }
}
