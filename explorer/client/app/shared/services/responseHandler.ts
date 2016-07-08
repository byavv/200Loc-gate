import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Router} from '@angular/router';
//let messageKeys = require('../../../../shared/index').keys;
import {Identity} from'./identity';
import {Storage} from'./storage';

@Injectable()
export class ResponseHandler {
    constructor(private router: Router, private identity: Identity, private storage: Storage) { }

    public handleError(error: Response, allowArrayResult = false): any {
        let errorMessage: any = error.json();
      //  return this._getMessage(errorMessage, allowArrayResult);
    }

    public handleSuccess(args): any {
      //  return this._getMessage(args);
    }

    public handle401(): any {
        this.identity.update(null);
        this.storage.removeItem("authorizationData");
        this.router.navigate(['Login']);
    }

    public handle500(): any {
        //todo: notify user with error popup dialog or smth else
    }

    /*private _getMessage(source, allowArrayResult = false) {
        if (!!source && _.has(messageKeys, source.key)) {
            if (source.message) {
                if (_.isString(source.message)) {
                    return source.message;
                }              
                if (_.isArray(source.message)) {
                    if (allowArrayResult) {
                        return source.message;
                    } else {
                        return source.message[0];
                    }
                }
            } else {
                return messageKeys[source.key].default;
            }
        } else {
            return `Unexpected server error`;
        }
    }*/
}