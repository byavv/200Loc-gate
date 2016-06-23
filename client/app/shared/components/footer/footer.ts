import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: require('./footer.html'),
    directives: []
})
export class FooterComponent implements OnInit {
    constructor() { }
    seo = {
        title: 'SEO'
    };
    ngOnInit() { }
}