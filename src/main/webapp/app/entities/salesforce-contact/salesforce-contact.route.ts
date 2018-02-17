import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SalesforceContactComponent } from './salesforce-contact.component';
import { SalesforceContactDetailComponent } from './salesforce-contact-detail.component';
import { SalesforceContactPopupComponent } from './salesforce-contact-dialog.component';
import { SalesforceContactDeletePopupComponent } from './salesforce-contact-delete-dialog.component';

export const salesforceContactRoute: Routes = [
    {
        path: 'salesforce-contact',
        component: SalesforceContactComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.salesforceContact.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'salesforce-contact/:id',
        component: SalesforceContactDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.salesforceContact.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const salesforceContactPopupRoute: Routes = [
    {
        path: 'salesforce-contact-new',
        component: SalesforceContactPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.salesforceContact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'salesforce-contact/:id/edit',
        component: SalesforceContactPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.salesforceContact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'salesforce-contact/:id/delete',
        component: SalesforceContactDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.salesforceContact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
