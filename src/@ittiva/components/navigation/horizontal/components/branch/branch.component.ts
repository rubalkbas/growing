import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ittivaHorizontalNavigationBasicItemComponent } from '@ittiva/components/navigation/horizontal/components/basic/basic.component';
import { ittivaHorizontalNavigationDividerItemComponent } from '@ittiva/components/navigation/horizontal/components/divider/divider.component';
import { ittivaHorizontalNavigationComponent } from '@ittiva/components/navigation/horizontal/horizontal.component';
import { ittivaNavigationService } from '@ittiva/components/navigation/navigation.service';
import { ittivaNavigationItem } from '@ittiva/components/navigation/navigation.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector       : 'ittiva-horizontal-navigation-branch-item',
    templateUrl    : './branch.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgIf, NgClass, MatMenuModule, NgTemplateOutlet, NgFor, ittivaHorizontalNavigationBasicItemComponent, forwardRef(() => ittivaHorizontalNavigationBranchItemComponent), ittivaHorizontalNavigationDividerItemComponent, MatTooltipModule, MatIconModule],
})
export class ittivaHorizontalNavigationBranchItemComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_child: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() child: boolean = false;
    @Input() item: ittivaNavigationItem;
    @Input() name: string;
    @ViewChild('matMenu', {static: true}) matMenu: MatMenu;

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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Trigger the change detection
     */
    triggerChangeDetection(): void
    {
        // Mark for check
        this._changeDetectorRef.markForCheck();
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
