import { Injectable } from '@angular/core';
import { IttivaMockApiService } from '@ittiva/lib/mock-api';
import { finance as financeData } from 'app/mock-api/dashboards/finance/data';
import { cloneDeep } from 'lodash-es';

@Injectable({providedIn: 'root'})
export class FinanceMockApi
{
    private _finance: any = financeData;

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
        // @ Sales - GET
        // -----------------------------------------------------------------------------------------------------
        this._IttivaMockApiService
            .onGet('api/dashboards/finance')
            .reply(() => [200, cloneDeep(this._finance)]);
    }
}
