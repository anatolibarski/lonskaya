import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SkyTicket } from './sky-ticket.model';
import { SkyTicketService } from './sky-ticket.service';

@Component({
    selector: 'jhi-sky-ticket-detail',
    templateUrl: './sky-ticket-detail.component.html'
})
export class SkyTicketDetailComponent implements OnInit, OnDestroy {

    skyTicket: SkyTicket;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private skyTicketService: SkyTicketService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSkyTickets();
    }

    load(id) {
        this.skyTicketService.find(id)
            .subscribe((skyTicketResponse: HttpResponse<SkyTicket>) => {
                this.skyTicket = skyTicketResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSkyTickets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'skyTicketListModification',
            (response) => this.load(this.skyTicket.id)
        );
    }
}
