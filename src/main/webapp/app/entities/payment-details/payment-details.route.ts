import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaymentDetailsComponent } from './payment-details.component';
import { PaymentDetailsDetailComponent } from './payment-details-detail.component';
import { PaymentDetailsPopupComponent } from './payment-details-dialog.component';
import { PaymentDetailsDeletePopupComponent } from './payment-details-delete-dialog.component';

export const paymentDetailsRoute: Routes = [
    {
        path: 'payment-details',
        component: PaymentDetailsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.paymentDetails.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'payment-details/:id',
        component: PaymentDetailsDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.paymentDetails.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const paymentDetailsPopupRoute: Routes = [
    {
        path: 'payment-details-new',
        component: PaymentDetailsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.paymentDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-details/:id/edit',
        component: PaymentDetailsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.paymentDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'payment-details/:id/delete',
        component: PaymentDetailsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.paymentDetails.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
