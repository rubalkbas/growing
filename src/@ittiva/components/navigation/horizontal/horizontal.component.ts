import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ittivaAnimations } from '@ittiva/animations';
import { ittivaNavigationService } from '@ittiva/components/navigation/navigation.service';
import { ittivaNavigationItem } from '@ittiva/components/navigation/navigation.types';
import { ittivaUtilsService } from '@ittiva/services/utils/utils.service';
import { ReplaySubject, Subject } from 'rxjs';
import { ittivaHorizontalNavigationBasicItemComponent } from './components/basic/basic.component';
import { ittivaHorizontalNavigationBranchItemComponent } from './components/branch/branch.component';
import { ittivaHorizontalNavigationSpacerItemComponent } from './components/spacer/spacer.component';

@Component({
    selector       : 'ittiva-horizontal-navigation',
    templateUrl    : './horizontal.component.html',
    styleUrls      : ['./horizontal.component.scss'],
    animations     : ittivaAnimations,
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'ittivaHorizontalNavigation',
    standalone     : true,
    imports        : [NgFor, NgIf, ittivaHorizontalNavigationBasicItemComponent, ittivaHorizontalNavigationBranchItemComponent, ittivaHorizontalNavigationSpacerItemComponent],
})
export class ittivaHorizontalNavigationComponent implements OnChanges, OnInit, OnDestroy
{
    @Input() name: string = this._ittivaUtilsService.randomId();
    @Input() navigation: ittivaNavigationItem[];

    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ittivaNavigationService: ittivaNavigationService,
        private _ittivaUtilsService: ittivaUtilsService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Navigation
        if ( 'navigation' in changes )
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Make sure the name input is not an empty string
        if ( this.name === '' )
        {
            this.name = this._ittivaUtilsService.randomId();
        }

        // Register the navigation component
        this._ittivaNavigationService.registerComponent(this.name, this);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Deregister the navigation component from the registry
        this._ittivaNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Refresh the component to apply the changes
     */
    refresh(): void
    {
        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
