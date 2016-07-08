import { FormGroup } from "@angular/forms";
export class Plugin {
    id: string;
    name: string;
    description: string;
    order: number;
    active: boolean = false;
    settings: any = {};    
    form: FormGroup;   
    value: any;
    constructor(name?: string, description?: string, order?: number, settings?: any, value?: any) {
        this.name = name;
        this.description = description;
        this.order = order;
        this.settings = settings;
        this.value = value;
    }
    get valid() {      
        return this.form ? this.form.valid : false;
    }
}