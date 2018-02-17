import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SkyTicket } from './sky-ticket.model';
import { SkyTicketService } from './sky-ticket.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-sky-ticket',
    templateUrl: './sky-ticket.component.html'
})
export class SkyTicketComponent implements OnInit, OnDestroy {
skyTickets: SkyTicket[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private skyTicketService: SkyTicketService,
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
            this.skyTicketService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<SkyTicket[]>) => this.skyTickets = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.skyTicketService.query().subscribe(
            (res: HttpResponse<SkyTicket[]>) => {
                this.skyTickets = res.body;
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
        this.registerChangeInSkyTickets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SkyTicket) {
        return item.id;
    }
    registerChangeInSkyTickets() {
        this.eventSubscriber = this.eventManager.subscribe('skyTicketListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
