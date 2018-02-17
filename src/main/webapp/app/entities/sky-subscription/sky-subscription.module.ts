import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LonskayaSharedModule } from '../../shared';
import { LonskayaAdminModule } from '../../admin/admin.module';
import {
    SkySubscriptionService,
    SkySubscriptionPopupService,
    SkySubscriptionComponent,
    SkySubscriptionDetailComponent,
    SkySubscriptionDialogComponent,
    SkySubscriptionPopupComponent,
    SkySubscriptionDeletePopupComponent,
    SkySubscriptionDeleteDialogComponent,
    skySubscriptionRoute,
    skySubscriptionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...skySubscriptionRoute,
    ...skySubscriptionPopupRoute,
];

@NgModule({
    imports: [
        LonskayaSharedModule,
        LonskayaAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SkySubscriptionComponent,
        SkySubscriptionDetailComponent,
        SkySubscriptionDialogComponent,
        SkySubscriptionDeleteDialogComponent,
        SkySubscriptionPopupComponent,
        SkySubscriptionDeletePopupComponent,
    ],
    entryComponents: [
        SkySubscriptionComponent,
        SkySubscriptionDialogComponent,
        SkySubscriptionPopupComponent,
        SkySubscriptionDeleteDialogComponent,
        SkySubscriptionDeletePopupComponent,
    ],
    providers: [
        SkySubscriptionService,
        SkySubscriptionPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LonskayaSkySubscriptionModule {}
