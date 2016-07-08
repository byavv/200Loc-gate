import { User } from './user';
import { Config } from './config';
import { Plugin } from './plugin';

export * from './user';
export * from './config';
export * from './plugin';

export var APP_MODELS: Array<any> = [
    User,
    Config,
    Plugin
];