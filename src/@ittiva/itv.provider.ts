import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ENVIRONMENT_INITIALIZER, EnvironmentProviders, importProvidersFrom, inject, Provider } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ittiva_MOCK_API_DEFAULT_DELAY, mockApiInterceptor } from '@ittiva/lib/mock-api';
import { ittivaConfig } from '@ittiva/services/config';
import { ittiva_CONFIG } from '@ittiva/services/config/config.constants';
import { ittivaConfirmationService } from '@ittiva/services/confirmation';
import { ittivaLoadingInterceptor, IttivaLoadingService } from '@ittiva/services/loading';
import { ittivaMediaWatcherService } from '@ittiva/services/media-watcher';
import { ittivaPlatformService } from '@ittiva/services/platform';
import { ittivaSplashScreenService } from '@ittiva/services/splash-screen';
import { ittivaUtilsService } from '@ittiva/services/utils';

export type ittivaProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    },
    ittiva?: ittivaConfig
}

/**
 * ittiva provider
 */
export const provideittiva = (config: ittivaProviderConfig): Array<Provider | EnvironmentProviders> =>
{
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true,
            },
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        {
            provide : ittiva_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide : ittiva_CONFIG,
            useValue: config?.ittiva ?? {},
        },

        importProvidersFrom(MatDialogModule),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ittivaConfirmationService),
            multi   : true,
        },

        provideHttpClient(withInterceptors([ittivaLoadingInterceptor])),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(IttivaLoadingService),
            multi   : true,
        },

        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ittivaMediaWatcherService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ittivaPlatformService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ittivaSplashScreenService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(ittivaUtilsService),
            multi   : true,
        },
    ];

    // Mock Api services
    if ( config?.mockApi?.services )
    {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide   : APP_INITIALIZER,
                deps      : [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi     : true,
            },
        );
    }

    // Return the providers
    return providers;
};
