import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentDetails } from './payment-details.model';
import { PaymentDetailsService } from './payment-details.service';

@Component({
    selector: 'jhi-payment-details-detail',
    templateUrl: './payment-details-detail.component.html'
})
export class PaymentDetailsDetailComponent implements OnInit, OnDestroy {

    paymentDetails: PaymentDetails;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private paymentDetailsService: PaymentDetailsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPaymentDetails();
    }

    load(id) {
        this.paymentDetailsService.find(id)
            .subscribe((paymentDetailsResponse: HttpResponse<PaymentDetails>) => {
                this.paymentDetails = paymentDetailsResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPaymentDetails() {
        this.eventSubscriber = this.eventManager.subscribe(
            'paymentDetailsListModification',
            (response) => this.load(this.paymentDetails.id)
        );
    }
}
