import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LonskayaSharedModule } from '../../shared';
import {
    SalesforceContactService,
    SalesforceContactPopupService,
    SalesforceContactComponent,
    SalesforceContactDetailComponent,
    SalesforceContactDialogComponent,
    SalesforceContactPopupComponent,
    SalesforceContactDeletePopupComponent,
    SalesforceContactDeleteDialogComponent,
    salesforceContactRoute,
    salesforceContactPopupRoute,
} from './';

const ENTITY_STATES = [
    ...salesforceContactRoute,
    ...salesforceContactPopupRoute,
];

@NgModule({
    imports: [
        LonskayaSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SalesforceContactComponent,
        SalesforceContactDetailComponent,
        SalesforceContactDialogComponent,
        SalesforceContactDeleteDialogComponent,
        SalesforceContactPopupComponent,
        SalesforceContactDeletePopupComponent,
    ],
    entryComponents: [
        SalesforceContactComponent,
        SalesforceContactDialogComponent,
        SalesforceContactPopupComponent,
        SalesforceContactDeleteDialogComponent,
        SalesforceContactDeletePopupComponent,
    ],
    providers: [
        SalesforceContactService,
        SalesforceContactPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LonskayaSalesforceContactModule {}
