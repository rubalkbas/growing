import { Injectable } from '@angular/core';
import { ittivaNavigationItem } from '@ittiva/components/navigation';
import { IttivaMockApiService } from '@ittiva/lib/mock-api';
import {  defaultNavigation,  } from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';

@Injectable({providedIn: 'root'})
export class NavigationMockApi
{
    private readonly _defaultNavigation: ittivaNavigationItem[] = defaultNavigation;

    /**
     * Constructor
     */
    constructor(private _IttivaMockApiService: IttivaMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._IttivaMockApiService
            .onGet('api/common/navigation')
            .reply(() =>
            {
                // Fill compact navigation children using the default navigation

                // Return the response
                return [
                    200,
                    {

                        default   : cloneDeep(this._defaultNavigation),

                    },
                ];
            });
    }
}
