export class Plugin {
    id: string;
    pluginName: string;
    description: string;
    order: number;
    active: boolean = false;
    constructor(name?: string, description?: string, order?: number) {
        this.pluginName = name;
        this.description = description;
        this.order = order;
    }
}