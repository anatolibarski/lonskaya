import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SkyTicketComponent } from './sky-ticket.component';
import { SkyTicketDetailComponent } from './sky-ticket-detail.component';
import { SkyTicketPopupComponent } from './sky-ticket-dialog.component';
import { SkyTicketDeletePopupComponent } from './sky-ticket-delete-dialog.component';

export const skyTicketRoute: Routes = [
    {
        path: 'sky-ticket',
        component: SkyTicketComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skyTicket.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'sky-ticket/:id',
        component: SkyTicketDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skyTicket.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const skyTicketPopupRoute: Routes = [
    {
        path: 'sky-ticket-new',
        component: SkyTicketPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skyTicket.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sky-ticket/:id/edit',
        component: SkyTicketPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skyTicket.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sky-ticket/:id/delete',
        component: SkyTicketDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'lonskayaApp.skyTicket.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
