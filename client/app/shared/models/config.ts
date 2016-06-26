import { Plugin } from "./plugin";

export class Config {
    id: string;
    name: string;
    description: string;
    entry: string;
    config: any = {};
    methods: Array<string> = ["GET", "POST"];
    plugins: Array<Plugin> = [];
}