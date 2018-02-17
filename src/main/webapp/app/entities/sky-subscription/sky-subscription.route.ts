import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SkySubscriptionComponent } from './sky-subscription.component';
import { SkySubscriptionDetailComponent } from './sky-subscription-detail.component';
import { SkySubscriptionPopupComponent } from './sky-subscription-dialog.component';
import { SkySubscriptionDeletePopupComponent } from './sky-subscription-delete-dialog.component';

export const skySubscriptionRoute: Routes = [
    {
        path: 'sky-subscription',
        component: SkySubscriptionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skySubscription.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'sky-subscription/:id',
        component: SkySubscriptionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skySubscription.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const skySubscriptionPopupRoute: Routes = [
    {
        path: 'sky-subscription-new',
        component: SkySubscriptionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skySubscription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sky-subscription/:id/edit',
        component: SkySubscriptionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skySubscription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sky-subscription/:id/delete',
        component: SkySubscriptionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skySubscription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
