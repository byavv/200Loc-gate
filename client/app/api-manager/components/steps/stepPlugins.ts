import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, Optional } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { } from '@angular/common'
import { ShowError, Draggable } from '../../directives';
import { DynamicForm } from '../../controls';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/forms';
import { RegExpWrapper, print, isPresent, isFunction } from '@angular/compiler/src/facade/lang';
import { Config, Plugin } from '../../../shared/models';
import { BackEnd, AppController } from '../../../shared/services';

import { MasterController } from '../../services/masterController';
import { Observable } from 'rxjs';

@Component({
    selector: 'step-plugins',
    template: require("./templates/stepPlugins.html"),
    directives: [REACTIVE_FORM_DIRECTIVES, ShowError, Draggable, DynamicForm],
    styles: [require('./styles/stepPlugins.scss')]
})
export class StepPlugins implements OnInit {
    @Output()
    next: EventEmitter<any> = new EventEmitter();

    appliedPlugins: Array<Plugin> = [];
    allPlugins: Array<Plugin> = [];
    loading: boolean = false;
    submitted: boolean = false;
    options: Array<any> = [];
    constructor(
        private master: MasterController,
        fb: FormBuilder,
        private backEnd: BackEnd,
        private appController: AppController) {

    }

    ngOnInit() {
        this.appController.init$.subscribe(defaults => {
            this.allPlugins = defaults.plugins;
        })
    }
    addNewPlugin() {
        var plugin;
        if (this.appliedPlugins.length > 0) {
            var lastPlugin = this.appliedPlugins.reduce((prev: Plugin, current: Plugin) => {
                return prev.order < current.order ? current : prev;
            });
            plugin = new Plugin("DEF" + Math.random() * 10, "dsfs", lastPlugin.order + 1)
        } else {
            plugin = new Plugin("default", "dsfs", 1)
        }
        this.setActive(plugin);
        this.appliedPlugins.push(plugin);
    }

    onSelectPlugin(plugin: Plugin) {
        this.appliedPlugins.map((p) => {
            p.active = false;
        })
        plugin.active = true;



        Observable.of([
            {
                key: "fff",
                required: "true",
                value: "sdfsd",

            },
            {
                key: "wwww4",
                required: "true",
                value: "tyhtyht"
            }
        ]).subscribe((defaults) => {
            console.log(defaults)
            this.options = defaults;
        })






    }

    pluginUp(plugin: Plugin) {
        this.setActive(plugin);

        if (!this.isLast(plugin)) {
            var next = this.appliedPlugins[this.appliedPlugins.indexOf(plugin) + 1];
            console.log(plugin, next)
            plugin.order++;
            next.order--;
            this.appliedPlugins.sort((a, b) => {
                return a.order - b.order;
            })
        }
    }

    pluginDown(plugin: Plugin) {
        this.setActive(plugin);

        if (!this.isLast(plugin)) {
            var prev = this.appliedPlugins[this.appliedPlugins.indexOf(plugin) - 1];
            console.log(plugin, prev)
            plugin.order--;
            prev.order++;
            this.appliedPlugins.sort((a, b) => {
                return a.order - b.order;
            })
        }
    }

    private setActive(plugin: Plugin) {
        this.appliedPlugins.map((p) => {
            p.active = false;
        })
        plugin.active = true;
    }

    private isLast(plugin): boolean {
        return (plugin === this.appliedPlugins
            .reduce((prev: Plugin, current: Plugin) => {
                return prev.order < current.order ? current : prev;
            }));
    }
    private isFirst(plugin) {
        return (plugin === this.appliedPlugins
            .reduce((prev: Plugin, current: Plugin) => {
                return prev.order > current.order ? current : prev;
            }));
    }
}