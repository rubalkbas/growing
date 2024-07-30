import { Injectable } from '@angular/core';
import { ittivaDrawerComponent } from '@ittiva/components/drawer/drawer.component';

@Injectable({providedIn: 'root'})
export class ittivaDrawerService
{
    private _componentRegistry: Map<string, ittivaDrawerComponent> = new Map<string, ittivaDrawerComponent>();

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register drawer component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: ittivaDrawerComponent): void
    {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister drawer component
     *
     * @param name
     */
    deregisterComponent(name: string): void
    {
        this._componentRegistry.delete(name);
    }

    /**
     * Get drawer component from the registry
     *
     * @param name
     */
    getComponent(name: string): ittivaDrawerComponent | undefined
    {
        return this._componentRegistry.get(name);
    }
}
