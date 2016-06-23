import { User } from './user';
import { Config } from './config';

export * from './user';
export * from './config';

export var APP_MODELS: Array<any> = [
    User,
    Config
];