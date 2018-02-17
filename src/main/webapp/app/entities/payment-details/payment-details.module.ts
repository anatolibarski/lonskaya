import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LonskayaSharedModule } from '../../shared';
import {
    PaymentDetailsService,
    PaymentDetailsPopupService,
    PaymentDetailsComponent,
    PaymentDetailsDetailComponent,
    PaymentDetailsDialogComponent,
    PaymentDetailsPopupComponent,
    PaymentDetailsDeletePopupComponent,
    PaymentDetailsDeleteDialogComponent,
    paymentDetailsRoute,
    paymentDetailsPopupRoute,
} from './';

const ENTITY_STATES = [
    ...paymentDetailsRoute,
    ...paymentDetailsPopupRoute,
];

@NgModule({
    imports: [
        LonskayaSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PaymentDetailsComponent,
        PaymentDetailsDetailComponent,
        PaymentDetailsDialogComponent,
        PaymentDetailsDeleteDialogComponent,
        PaymentDetailsPopupComponent,
        PaymentDetailsDeletePopupComponent,
    ],
    entryComponents: [
        PaymentDetailsComponent,
        PaymentDetailsDialogComponent,
        PaymentDetailsPopupComponent,
        PaymentDetailsDeleteDialogComponent,
        PaymentDetailsDeletePopupComponent,
    ],
    providers: [
        PaymentDetailsService,
        PaymentDetailsPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LonskayaPaymentDetailsModule {}
