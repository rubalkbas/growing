import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ittivaHorizontalNavigationComponent } from '@ittiva/components/navigation/horizontal/horizontal.component';
import { ittivaNavigationService } from '@ittiva/components/navigation/navigation.service';
import { ittivaNavigationItem } from '@ittiva/components/navigation/navigation.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'ittiva-horizontal-navigation-divider-item',
    templateUrl    : './divider.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgClass],
})
export class ittivaHorizontalNavigationDividerItemComponent implements OnInit, OnDestroy
{
    @Input() item: ittivaNavigationItem;
    @Input() name: string;

    private _ittivaHorizontalNavigationComponent: ittivaHorizontalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ittivaNavigationService: ittivaNavigationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._ittivaHorizontalNavigationComponent = this._ittivaNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._ittivaHorizontalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll),
        ).subscribe(() =>
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
