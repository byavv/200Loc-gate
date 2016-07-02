import { FormGroup } from "@angular/forms";
export class Plugin {
    id: string;
    name: string;
    description: string;
    order: number;
    active: boolean = false;
    options: any = {};
    config: any = {};
    form: FormGroup;
    //valid: any = false;
    constructor(name?: string, description?: string, order?: number, options?: any) {
        this.name = name;
        this.description = description;
        this.order = order;
        this.options = options;
    }
    get valid() {      
        return this.form ? this.form.valid : true;
    }
}