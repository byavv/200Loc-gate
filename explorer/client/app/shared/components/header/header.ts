import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Identity, AuthApi, Storage } from '../../services';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'app-header',
    template: require('./header.html'),
    directives: [ROUTER_DIRECTIVES, DROPDOWN_DIRECTIVES],
    styles: [require('./header.scss')]
})
export class HeaderComponent implements OnInit {
    isAuthenticated: boolean = false;
    shouldRedirect: boolean;
    username: string;

    constructor(private identity: Identity, private auth: AuthApi, private router: Router, private storage: Storage) { }

    ngOnInit() {   
        this.username = this.identity.user.name || "Guest";
        this.isAuthenticated = this.identity.user.isAuthenticated();
        this.identity.identity$
            .subscribe((user) => {
                this.isAuthenticated = user.isAuthenticated();
                this.username = user.name;
            });
    }
    signOut() {
        this.auth.signOut().subscribe(
            (res) => {
                this.identity.update();
                this.storage.removeItem("authorizationData")
            },
            (err) => {
                this.identity.update();
                this.storage.removeItem("authorizationData");
            }
        );
    }
}