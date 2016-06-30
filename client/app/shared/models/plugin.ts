export class Plugin {
    id: string;
    pluginName: string;
    description: string;
    order: number;
    active: boolean = false;   
    options: any = {};
    config: any = {};
    constructor(name?: string, description?: string, order?: number, options?: any) {
        this.pluginName = name;
        this.description = description;
        this.order = order;
        this.options = options;
    }
}