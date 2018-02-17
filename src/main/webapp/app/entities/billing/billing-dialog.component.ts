import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Billing } from './billing.model';
import { BillingPopupService } from './billing-popup.service';
import { BillingService } from './billing.service';
import { PaymentDetails, PaymentDetailsService } from '../payment-details';
import { SkySubscription, SkySubscriptionService } from '../sky-subscription';

@Component({
    selector: 'jhi-billing-dialog',
    templateUrl: './billing-dialog.component.html'
})
export class BillingDialogComponent implements OnInit {

    billing: Billing;
    isSaving: boolean;

    details: PaymentDetails[];

    skysubscriptions: SkySubscription[];
    dueDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private billingService: BillingService,
        private paymentDetailsService: PaymentDetailsService,
        private skySubscriptionService: SkySubscriptionService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.paymentDetailsService
            .query({filter: 'billing-is-null'})
            .subscribe((res: HttpResponse<PaymentDetails[]>) => {
                if (!this.billing.details || !this.billing.details.id) {
                    this.details = res.body;
                } else {
                    this.paymentDetailsService
                        .find(this.billing.details.id)
                        .subscribe((subRes: HttpResponse<PaymentDetails>) => {
                            this.details = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.skySubscriptionService.query()
            .subscribe((res: HttpResponse<SkySubscription[]>) => { this.skysubscriptions = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.billing.id !== undefined) {
            this.subscribeToSaveResponse(
                this.billingService.update(this.billing));
        } else {
            this.subscribeToSaveResponse(
                this.billingService.create(this.billing));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Billing>>) {
        result.subscribe((res: HttpResponse<Billing>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Billing) {
        this.eventManager.broadcast({ name: 'billingListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackPaymentDetailsById(index: number, item: PaymentDetails) {
        return item.id;
    }

    trackSkySubscriptionById(index: number, item: SkySubscription) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-billing-popup',
    template: ''
})
export class BillingPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private billingPopupService: BillingPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.billingPopupService
                    .open(BillingDialogComponent as Component, params['id']);
            } else {
                this.billingPopupService
                    .open(BillingDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
