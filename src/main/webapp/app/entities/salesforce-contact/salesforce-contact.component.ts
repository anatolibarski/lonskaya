import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SalesforceContact } from './salesforce-contact.model';
import { SalesforceContactService } from './salesforce-contact.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-salesforce-contact',
    templateUrl: './salesforce-contact.component.html'
})
export class SalesforceContactComponent implements OnInit, OnDestroy {
salesforceContacts: SalesforceContact[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private salesforceContactService: SalesforceContactService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.salesforceContactService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<SalesforceContact[]>) => this.salesforceContacts = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.salesforceContactService.query().subscribe(
            (res: HttpResponse<SalesforceContact[]>) => {
                this.salesforceContacts = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInSalesforceContacts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SalesforceContact) {
        return item.id;
    }
    registerChangeInSalesforceContacts() {
        this.eventSubscriber = this.eventManager.subscribe('salesforceContactListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
