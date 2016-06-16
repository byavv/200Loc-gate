import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ExtHttp} from './extHttp';

@Injectable()
export class Api {

  constructor(private _http: ExtHttp) { }

  public getCarsCount(query): Observable<any> {
    return this._http      
      .post("/public/cars/count", JSON.stringify(query))
      .map(res => res.json());
  }

  public getMakerModels(makerId): Observable<any> {
    return this._http     
      .get(`/public/makers/${makerId}/carModels`)
      .map(res => res.json());
  }
}