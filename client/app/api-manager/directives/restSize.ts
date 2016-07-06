import { Directive, ElementRef, Renderer, Input} from '@angular/core';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';

@Directive({
    selector: '[rest-height]',
})
export class RestSize {
    private _doc: HTMLDocument;
    private _domAdapter: DomAdapter;

    ignoreElementSize = false;
    constructor(public element: ElementRef, private renderer: Renderer) {
        this._domAdapter = getDOM();
        this._doc = this._domAdapter.defaultDoc();
    }

    ngAfterViewInit() {       
        this.renderer.listenGlobal('window', 'resize', (evt: any) => {
            this._setMinHeight();
        });
        this._setMinHeight();
    }

    _setMinHeight() {
        var scrollTop = this._doc.documentElement.scrollTop || this._doc.body.scrollTop;
        var docHeight = this._doc.documentElement.clientHeight;
        var rect = this._domAdapter.getBoundingClientRect(this.element.nativeElement);       
        this._domAdapter.setStyle(this.element.nativeElement, 'min-height', `${docHeight - rect.top - 65}px`);
    }

    _reset() {
        this._domAdapter.setStyle(this.element.nativeElement, 'min-height', `auto`);
        this._domAdapter.setStyle(this.element.nativeElement, 'transition-duration', `${0}ms`);
    }
}