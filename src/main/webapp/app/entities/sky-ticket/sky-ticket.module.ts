import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LonskayaSharedModule } from '../../shared';
import {
    SkyTicketService,
    SkyTicketPopupService,
    SkyTicketComponent,
    SkyTicketDetailComponent,
    SkyTicketDialogComponent,
    SkyTicketPopupComponent,
    SkyTicketDeletePopupComponent,
    SkyTicketDeleteDialogComponent,
    skyTicketRoute,
    skyTicketPopupRoute,
} from './';

const ENTITY_STATES = [
    ...skyTicketRoute,
    ...skyTicketPopupRoute,
];

@NgModule({
    imports: [
        LonskayaSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SkyTicketComponent,
        SkyTicketDetailComponent,
        SkyTicketDialogComponent,
        SkyTicketDeleteDialogComponent,
        SkyTicketPopupComponent,
        SkyTicketDeletePopupComponent,
    ],
    entryComponents: [
        SkyTicketComponent,
        SkyTicketDialogComponent,
        SkyTicketPopupComponent,
        SkyTicketDeleteDialogComponent,
        SkyTicketDeletePopupComponent,
    ],
    providers: [
        SkyTicketService,
        SkyTicketPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LonskayaSkyTicketModule {}
