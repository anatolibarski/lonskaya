import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Billing } from './billing.model';
import { BillingService } from './billing.service';

@Component({
    selector: 'jhi-billing-detail',
    templateUrl: './billing-detail.component.html'
})
export class BillingDetailComponent implements OnInit, OnDestroy {

    billing: Billing;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private billingService: BillingService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBillings();
    }

    load(id) {
        this.billingService.find(id)
            .subscribe((billingResponse: HttpResponse<Billing>) => {
                this.billing = billingResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBillings() {
        this.eventSubscriber = this.eventManager.subscribe(
            'billingListModification',
            (response) => this.load(this.billing.id)
        );
    }
}
