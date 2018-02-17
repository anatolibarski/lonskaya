import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SalesforceContact } from './salesforce-contact.model';
import { SalesforceContactPopupService } from './salesforce-contact-popup.service';
import { SalesforceContactService } from './salesforce-contact.service';

@Component({
    selector: 'jhi-salesforce-contact-delete-dialog',
    templateUrl: './salesforce-contact-delete-dialog.component.html'
})
export class SalesforceContactDeleteDialogComponent {

    salesforceContact: SalesforceContact;

    constructor(
        private salesforceContactService: SalesforceContactService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.salesforceContactService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'salesforceContactListModification',
                content: 'Deleted an salesforceContact'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-salesforce-contact-delete-popup',
    template: ''
})
export class SalesforceContactDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private salesforceContactPopupService: SalesforceContactPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.salesforceContactPopupService
                .open(SalesforceContactDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
