import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { BillingComponent } from './billing.component';
import { BillingDetailComponent } from './billing-detail.component';
import { BillingPopupComponent } from './billing-dialog.component';
import { BillingDeletePopupComponent } from './billing-delete-dialog.component';

export const billingRoute: Routes = [
    {
        path: 'billing',
        component: BillingComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.billing.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'billing/:id',
        component: BillingDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.billing.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const billingPopupRoute: Routes = [
    {
        path: 'billing-new',
        component: BillingPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.billing.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'billing/:id/edit',
        component: BillingPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.billing.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'billing/:id/delete',
        component: BillingDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.billing.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
