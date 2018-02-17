import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SalesforceContact } from './salesforce-contact.model';
import { SalesforceContactService } from './salesforce-contact.service';

@Component({
    selector: 'jhi-salesforce-contact-detail',
    templateUrl: './salesforce-contact-detail.component.html'
})
export class SalesforceContactDetailComponent implements OnInit, OnDestroy {

    salesforceContact: SalesforceContact;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private salesforceContactService: SalesforceContactService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSalesforceContacts();
    }

    load(id) {
        this.salesforceContactService.find(id)
            .subscribe((salesforceContactResponse: HttpResponse<SalesforceContact>) => {
                this.salesforceContact = salesforceContactResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSalesforceContacts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'salesforceContactListModification',
            (response) => this.load(this.salesforceContact.id)
        );
    }
}
