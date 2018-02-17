import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { PaymentDetails } from './payment-details.model';
import { PaymentDetailsPopupService } from './payment-details-popup.service';
import { PaymentDetailsService } from './payment-details.service';

@Component({
    selector: 'jhi-payment-details-delete-dialog',
    templateUrl: './payment-details-delete-dialog.component.html'
})
export class PaymentDetailsDeleteDialogComponent {

    paymentDetails: PaymentDetails;

    constructor(
        private paymentDetailsService: PaymentDetailsService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.paymentDetailsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'paymentDetailsListModification',
                content: 'Deleted an paymentDetails'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-payment-details-delete-popup',
    template: ''
})
export class PaymentDetailsDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private paymentDetailsPopupService: PaymentDetailsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.paymentDetailsPopupService
                .open(PaymentDetailsDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
