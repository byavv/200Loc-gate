import {Directive, ElementRef, Renderer, OnDestroy, OnInit} from '@angular/core';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';

@Directive({
  selector: '[draggable]',
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    '(drag)': 'onDrag($event)'
  }
})
export class Draggable implements OnDestroy, OnInit {
  private Δx: number = 0;
  private Δy: number = 0;
  private _domAdapter: DomAdapter;
  private _parent: ElementRef;
  private mustBePosition: Array<string> = ['absolute', 'fixed', 'relative'];
  constructor(
    private el: ElementRef, private renderer: Renderer
  ) {
    this._domAdapter = getDOM();

    try {
      if (this.mustBePosition.indexOf(this.el.nativeElement.style.position) === -1) {
        console.warn(this.el.nativeElement, 'Must be having position attribute set to ' + this.mustBePosition.join('|'));
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  public ngOnInit(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'true');
  }
  onDragStart(event: MouseEvent) {
    this.Δx = event.x - this.el.nativeElement.offsetLeft;
    this.Δy = event.y - this.el.nativeElement.offsetTop;
  }
  onDrag(event: MouseEvent) {
    this.doTranslation(event.x, event.y);
  }
  onDragEnd(event: MouseEvent) {
    this.Δx = 0;
    this.Δy = 0;
  }
  doTranslation(x: number, y: number) {
    if (!x || !y) return;

    var boundaries = this._domAdapter.getBoundingClientRect(this._domAdapter.parentElement(this.el.nativeElement));
    console.log(boundaries);
    if (y < boundaries.top) {
      y = boundaries.top;
    }
    if (y > boundaries.bottom) {
      y = boundaries.bottom
    }

    if (x < boundaries.left) {
      x = boundaries.left
    }
    if (x > boundaries.right) {
      x = boundaries.right
    }

   

    this.renderer.setElementStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
    this.renderer.setElementStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
  }
  public ngOnDestroy(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'false');
  }

}