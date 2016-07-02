import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
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
import { MODAL_DIRECTVES, BS_VIEW_PROVIDERS } from 'ng2-bootstrap/ng2-bootstrap';
import { Subject } from 'rxjs'

@Component({
    selector: 'step-plugins',
    template: require("./templates/stepPlugins.html"),
    directives: [REACTIVE_FORM_DIRECTIVES, ShowError, Draggable, DynamicForm, MODAL_DIRECTVES],
    viewProviders: [BS_VIEW_PROVIDERS],
    styles: [require('./styles/stepPlugins.scss')]
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
        this.appController.init$.subscribe(defaults => {
            this.plugins = defaults.plugins;

            this.master.init$.subscribe((config) => {
                this.loading = false;
                console.log('INIT AT SECOND', config);
                (config.plugins || []).forEach((plugin) => {
                    let name = Object.keys(plugin)[0];
                    let pluginToAdd = this.plugins.find((plugin: any) => plugin.name === name);

                    // this.addNewPlugin(new Plugin(
                    //     pluginToAdd.name, 
                    //     pluginToAdd.description, 
                    //     0, 
                    //     plugin[name]));
                    var fpluginToAdd = new Plugin(pluginToAdd.name,
                        pluginToAdd.description,
                        0,
                        plugin[name]);
                    // console.log(tt)
                    //  this.addNewPlugin(fpluginToAdd, "");

                    this.mapPlugin(fpluginToAdd);
                })
            });
        });
    }

    get _validateAll(): boolean {
        var validationOb = {};
        let valid = true;
        this.appliedPlugins.forEach((plugin) => {
            validationOb[plugin.name] = plugin.valid;
            if (!plugin.valid) {
                valid = false;
            }
        });
        console.log(validationOb);
        return valid;
    }

    mapPlugin(pl) {
        var plugin;
        var lastOrder = 0;

        this.backEnd.getPluginConfig(pl.name).subscribe((config) => {
            console.log(`CURRENT CONFIGURATION FOR ! ${pl.name.toUpperCase()} !`, pl.options)
            console.log(`BASIC CONFIG FOR ! ${pl.name.toUpperCase()} !`, config);

            Object.keys(pl.options).forEach(key => {
                config[key].value = pl.options[key];
            })

            console.log(`AFTER TR FOR ! ${pl.name.toUpperCase()} !`, config);

            if (this.appliedPlugins.length > 0) {
                lastOrder = this.appliedPlugins.reduce((prev: Plugin, current: Plugin) => {
                    return prev.order < current.order ? current : prev;
                }).order;
            }
            plugin = new Plugin(pl.name, pl.description, lastOrder + 1, config);
            this.selectPlugin(plugin);
            console.log("ADD", plugin)
            this.appliedPlugins.push(plugin);
        }, (err) => {
            console.error(err);
        });
    }

    addNewPlugin(pl, conf?) {
        var plugin;
        var lastOrder = 0;
        this.backEnd.getPluginConfig(pl.name).subscribe((config) => {
            console.log("BASIC CONFIG", config)
            if (this.appliedPlugins.length > 0) {
                lastOrder = this.appliedPlugins.reduce((prev: Plugin, current: Plugin) => {
                    return prev.order < current.order ? current : prev;
                }).order;
            }
            plugin = new Plugin(pl.name, pl.description, lastOrder + 1, config);
            this.selectPlugin(plugin);
            console.log("ADD", plugin)
            this.appliedPlugins.push(plugin);
        }, (err) => {
            console.error(err);
        });
    }

    selectPlugin(plugin: Plugin) {
        this.appliedPlugins.map((p) => {
            p.active = false;
        })
        plugin.active = true;
        this.activePlugin = plugin;
    }

    pluginUp(plugin: Plugin) {
        this.selectPlugin(plugin);
        if (!this.isLast(plugin)) {
            var next = this.appliedPlugins[this.appliedPlugins.indexOf(plugin) + 1];
            plugin.order++;
            next.order--;
            this._sort();
        }
    }

    pluginDown(plugin: Plugin) {
        this.selectPlugin(plugin);
        if (!this.isFirst(plugin)) {
            var prev = this.appliedPlugins[this.appliedPlugins.indexOf(plugin) - 1];
            plugin.order--;
            prev.order++;
            this._sort();
        }
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
            var plugins = this.appliedPlugins.map((ap) => {
                var plugin = {};
                plugin[ap.name] = ap.config;
                return plugin;
            })
            this.master.config.plugins = plugins;
            console.log(this.master.config);
            this.next.next('preview');
        }
    }
    onDelete() {
        var index = this.appliedPlugins.indexOf(this.activePlugin);
        // var currentIndex = this.selectedPlugin.order;
        this.appliedPlugins.splice(index, 1);
        if (this.appliedPlugins[0])
            this.setActive(this.appliedPlugins[0])
        //  this.selectedPlugin = this.appliedPlugins
    }

}