import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, Host, Optional, ViewContainerRef } from '@angular/core';
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
    plugins: Array<Plugin> = [];
    loading: boolean = false;
    submitted: boolean = false;
    selectedPlugin;
    constructor(
        private master: MasterController,
        fb: FormBuilder,
        private backEnd: BackEnd,
        private appController: AppController) {
    }

    ngOnInit() {
        this.appController.init$.subscribe(defaults => {
            this.plugins = defaults.plugins;
            console.log(this.plugins)
        })
    }

    addNewPlugin(pl) {
        var plugin;
        var lastOrder = 0;
        this.backEnd.getPluginConfig(pl.name).subscribe((config) => {
            if (this.appliedPlugins.length > 0) {
                lastOrder = this.appliedPlugins.reduce((prev: Plugin, current: Plugin) => {
                    return prev.order < current.order ? current : prev;
                }).order;
            }
            plugin = new Plugin(pl.name, pl.description, lastOrder + 1, config);
            this.selectPlugin(plugin);
            this.appliedPlugins.push(plugin);
        }, (err) => {
            console.error(err)
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
            console.log(plugin, next)
            plugin.order++;
            next.order--;
            this.appliedPlugins.sort((a, b) => {
                return a.order - b.order;
            })
        }
    }

    pluginDown(plugin: Plugin) {
        this.selectPlugin(plugin);
        if (!this.isLast(plugin)) {
            var prev = this.appliedPlugins[this.appliedPlugins.indexOf(plugin) - 1];
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

    select(plugin) {
        this.plugins.forEach(plugin=>{
            plugin.active =false;
        })
        this.selectedPlugin = plugin; 
        this.selectedPlugin.active = true;
    }

    onSubmit() {
        this.master.setValidity('plugins', this.appliedPlugins.length > 0);
        var plugins = this.appliedPlugins.map((ap) => {
            var plugin = {};
            plugin[ap.pluginName] = ap.config;
            return plugin;
        })
        this.master.config.plugins = plugins;
        console.log(this.master.config);
        this.next.next('preview');
    }
}