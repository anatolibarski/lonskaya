import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LonskayaSkyTicketModule } from './sky-ticket/sky-ticket.module';
import { LonskayaSkySubscriptionModule } from './sky-subscription/sky-subscription.module';
import { LonskayaBillingModule } from './billing/billing.module';
import { LonskayaPaymentDetailsModule } from './payment-details/payment-details.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        LonskayaSkyTicketModule,
        LonskayaSkySubscriptionModule,
        LonskayaBillingModule,
        LonskayaPaymentDetailsModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LonskayaEntityModule {}
