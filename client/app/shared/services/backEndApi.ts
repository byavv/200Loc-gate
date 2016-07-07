import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ExtHttp} from './extHttp';

@Injectable()
export class BackEnd {

  constructor(private _http: ExtHttp) { }

  public getPlugins(): Observable<any> {
    return this._http
      .get("/api/plugins")
      .map(res => res.json());
  }
  public getApiConfigs(): Observable<any> {
    return this._http
      .get("/api/configs")
      .map(res => res.json());
  }
  public getConfig(id): Observable<any> {
    return this._http
      .get(`/api/config/${id}`)
      .map(res => res.json());
  }  

  public createOrUpdate(data: any, id?: string) {    
    return this._http
      .post(`/api/config/${id}`, JSON.stringify(data))
      .map(res => res.json());
  }
  public deleteApiConfig(id){
     return this._http
      .delete(`/api/config/${id}`)
      .map(res => res.json());
  }
}