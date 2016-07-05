import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ShowError, Draggable } from '../../directives';
import { DynamicForm } from '../../controls';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/forms';
import { RegExpWrapper, print, isPresent, isFunction } from '@angular/compiler/src/facade/lang';
import { Config, Plugin } from '../../../shared/models';
import { BackEnd, AppController } from '../../../shared/services';

import { MasterController } from '../../services/masterController';
import { Observable } from 'rxjs';
import { MODAL_DIRECTVES, BS_VIEW_PROVIDERS } from 'ng2-bootstrap/ng2-bootstrap';
import { Subject } from 'rxjs';

@Component({
    selector: 'step-plugins',
    template: require("./templates/stepPlugins.html"),
    directives: [REACTIVE_FORM_DIRECTIVES, ShowError, Draggable, DynamicForm, MODAL_DIRECTVES],
    viewProviders: [BS_VIEW_PROVIDERS],
    styles: [require('./styles/stepPlugins.scss'),
        `
     :host {
        flex:1;
        display: flex;
        flex-direction: column;
    }
    `]
})
export class StepPlugins implements OnInit {
    @Output()
    next: EventEmitter<any> = new EventEmitter();
    activePlugin: Plugin;
    appliedPlugins: Array<Plugin> = [];
    plugins: Array<any> = [];
    loading: boolean = false;
    submitted: boolean = false;
    valid$: Subject<any> = new Subject()
    selectedPlugin: Plugin;
    plugins_valid = false;

    constructor(
        private master: MasterController,
        fb: FormBuilder,
        private backEnd: BackEnd,
        private appController: AppController) {
    }

    ngOnInit() {
        this.applyValidation();
        this.appController.init$.subscribe(defaults => {
            this.plugins = defaults.plugins;
            this.master.init$.subscribe((config) => {
                this.loading = false;
                (config.plugins || []).forEach((plugin) => {
                    let name = Object.keys(plugin)[0];
                    let pluginToAdd = this.plugins.find((plugin: any) => plugin.name === name);
                    var fpluginToAdd = new Plugin(pluginToAdd.name,
                        pluginToAdd.description,
                        0,
                        plugin[name]);
                    this.addNewPlugin(fpluginToAdd);
                })
            });
        });
    }

    get _validateAll(): boolean {
        let valid = true;
        if (this.appliedPlugins && this.appliedPlugins.length > 0) {
            this.appliedPlugins.forEach((plugin) => {
                if (!plugin.valid) {
                    valid = false;
                }
            });
            return valid;
        } else {
            return false;
        }
    }

    applyValidation() {
        this._validateAll
            ? this.master.setValidity('plugins', true)
            : this.master.setValidity('plugins', false);
    }

    applyPlugins() {

        var plugins = this.appliedPlugins.map((ap) => {
            var plugin = {};
            plugin[ap.name] = ap.config;
            return plugin;
        });
        console.log("APPLY PLUGINS", plugins)
        this.master.config.plugins = plugins;
    }

    addNewPlugin(pl) {
        var plugin: Plugin;
        var lastOrder = 0;
        this.backEnd.getPluginConfig(pl.name).subscribe((config) => {
            if (pl.options)
                Object.keys(pl.options).forEach(key => {
                    if (pl.options[key]) {
                        config[key].value = pl.options[key];
                    }
                });
            if (this.appliedPlugins.length > 0) {
                lastOrder = this.appliedPlugins.reduce((prev: Plugin, current: Plugin) => {
                    return prev.order < current.order ? current : prev;
                }).order;
            }
            plugin = new Plugin(pl.name, pl.description, lastOrder + 1, config);
            this.selectPipeItem(plugin);
            this.appliedPlugins.push(plugin);            
            this.applyValidation();
            this.applyPlugins();

        }, (err) => {
            console.error(err);
        });
    }

    selectPipeItem(plugin: Plugin) {
        this.appliedPlugins.map((p) => {
            p.active = false;
        })
        plugin.active = true;
        this.activePlugin = plugin;
    }

    pluginUp(plugin: Plugin) {
        this.selectPipeItem(plugin);
        if (!this.isLast(plugin)) {
            var next = this.appliedPlugins[this.appliedPlugins.indexOf(plugin) + 1];
            plugin.order++;
            next.order--;
            this._sort();
        }
    }

    pluginDown(plugin: Plugin) {
        this.selectPipeItem(plugin);
        if (!this.isFirst(plugin)) {
            var prev = this.appliedPlugins[this.appliedPlugins.indexOf(plugin) - 1];
            plugin.order--;
            prev.order++;
            this._sort();
        }
    }

    pluginDelete(plugin) {
        var index = this.appliedPlugins.indexOf(plugin);
        this.appliedPlugins.splice(index, 1);
        this.applyValidation();
        if (this.appliedPlugins[0])
            this.setActive(this.appliedPlugins[0]);
    }

    _sort() {
        this.appliedPlugins.sort((a, b) => {
            return a.order - b.order;
        })
    }

    private setActive(plugin: Plugin) {
        this.appliedPlugins.map((p) => {
            p.active = false;
        })
        plugin.active = true;
    }

    isLast(plugin): boolean {
        return (plugin === this.appliedPlugins
            .reduce((prev: Plugin, current: Plugin) => {
                return prev.order < current.order ? current : prev;
            }));
    }
    isFirst(plugin) {
        return (plugin === this.appliedPlugins
            .reduce((prev: Plugin, current: Plugin) => {
                return prev.order > current.order ? current : prev;
            }));
    }

    select(plugin) {
        this.plugins.forEach(plugin => {
            plugin.active = false;
        })
        this.selectedPlugin = plugin;
        this.selectedPlugin.active = true;
    }
    isValid(plugin: Plugin) {
        return plugin.valid;
    }


    onSubmit() {
        this.submitted = true;
        this.master.setValidity('plugins', this.appliedPlugins.length > 0);
        if (this._validateAll) {
            this.applyPlugins();
            this.next.next('preview');
        }
    }

}