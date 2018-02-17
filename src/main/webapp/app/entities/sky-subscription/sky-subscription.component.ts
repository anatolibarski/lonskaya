import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SkySubscription } from './sky-subscription.model';
import { SkySubscriptionService } from './sky-subscription.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-sky-subscription',
    templateUrl: './sky-subscription.component.html'
})
export class SkySubscriptionComponent implements OnInit, OnDestroy {
skySubscriptions: SkySubscription[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private skySubscriptionService: SkySubscriptionService,
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
            this.skySubscriptionService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<SkySubscription[]>) => this.skySubscriptions = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.skySubscriptionService.query().subscribe(
            (res: HttpResponse<SkySubscription[]>) => {
                this.skySubscriptions = res.body;
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
        this.registerChangeInSkySubscriptions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SkySubscription) {
        return item.id;
    }
    registerChangeInSkySubscriptions() {
        this.eventSubscriber = this.eventManager.subscribe('skySubscriptionListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
