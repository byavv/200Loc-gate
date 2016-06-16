import {Injectable, NgZone} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ExtHttp} from './extHttp';

import {Api} from "./backEndApi";
import {ReplaySubject, Observable} from "rxjs";

@Injectable()
export class AppController {
    init$: ReplaySubject<any> = new ReplaySubject<any>();
    config: any = {
       
    };
  
    makers: Array<any> = [];
    engineTypes: Array<any> = [];
    // todo: car colors     
    constructor(private _backEnd: Api, private _ngZone: NgZone) { }
    start() {
        this._ngZone.runOutsideAngular(() => {
            this._loadAppDefaults((defaults) => {
                this._ngZone.run(() => { this.init$.next(defaults); });
                console.log("APPLICATION STARTED");
            })
        });
    }

    _loadAppDefaults(doneCallback: (defaults: any) => void) {

         doneCallback({/* get current configuration */});
       
       /* Observable.zip(
            this._backEnd.getMakers(),
            this._backEnd.getEngineTypes(),
            (makers, engineTypes) => [makers, engineTypes])
            .subscribe(value => {
                [this.makers, this.engineTypes] = value;
                doneCallback({
                    makers: value[0],
                    engineTypes: value[1]
                });
            }, err => {
                console.log(err);
            })*/
    }
}