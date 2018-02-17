import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentDetails } from './payment-details.model';
import { PaymentDetailsPopupService } from './payment-details-popup.service';
import { PaymentDetailsService } from './payment-details.service';

@Component({
    selector: 'jhi-payment-details-dialog',
    templateUrl: './payment-details-dialog.component.html'
})
export class PaymentDetailsDialogComponent implements OnInit {

    paymentDetails: PaymentDetails;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private paymentDetailsService: PaymentDetailsService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.paymentDetails.id !== undefined) {
            this.subscribeToSaveResponse(
                this.paymentDetailsService.update(this.paymentDetails));
        } else {
            this.subscribeToSaveResponse(
                this.paymentDetailsService.create(this.paymentDetails));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<PaymentDetails>>) {
        result.subscribe((res: HttpResponse<PaymentDetails>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: PaymentDetails) {
        this.eventManager.broadcast({ name: 'paymentDetailsListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-payment-details-popup',
    template: ''
})
export class PaymentDetailsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentDetailsPopupService: PaymentDetailsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.paymentDetailsPopupService
                    .open(PaymentDetailsDialogComponent as Component, params['id']);
            } else {
                this.paymentDetailsPopupService
                    .open(PaymentDetailsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
