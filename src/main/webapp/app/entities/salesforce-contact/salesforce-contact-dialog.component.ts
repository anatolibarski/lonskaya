import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SalesforceContact } from './salesforce-contact.model';
import { SalesforceContactPopupService } from './salesforce-contact-popup.service';
import { SalesforceContactService } from './salesforce-contact.service';

@Component({
    selector: 'jhi-salesforce-contact-dialog',
    templateUrl: './salesforce-contact-dialog.component.html'
})
export class SalesforceContactDialogComponent implements OnInit {

    salesforceContact: SalesforceContact;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private salesforceContactService: SalesforceContactService,
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
        if (this.salesforceContact.id !== undefined) {
            this.subscribeToSaveResponse(
                this.salesforceContactService.update(this.salesforceContact));
        } else {
            this.subscribeToSaveResponse(
                this.salesforceContactService.create(this.salesforceContact));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SalesforceContact>>) {
        result.subscribe((res: HttpResponse<SalesforceContact>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SalesforceContact) {
        this.eventManager.broadcast({ name: 'salesforceContactListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-salesforce-contact-popup',
    template: ''
})
export class SalesforceContactPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private salesforceContactPopupService: SalesforceContactPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.salesforceContactPopupService
                    .open(SalesforceContactDialogComponent as Component, params['id']);
            } else {
                this.salesforceContactPopupService
                    .open(SalesforceContactDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
