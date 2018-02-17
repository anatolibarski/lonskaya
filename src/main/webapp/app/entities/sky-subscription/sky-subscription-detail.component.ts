import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { SkySubscription } from './sky-subscription.model';
import { SkySubscriptionService } from './sky-subscription.service';

@Component({
    selector: 'jhi-sky-subscription-detail',
    templateUrl: './sky-subscription-detail.component.html'
})
export class SkySubscriptionDetailComponent implements OnInit, OnDestroy {

    skySubscription: SkySubscription;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private skySubscriptionService: SkySubscriptionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSkySubscriptions();
    }

    load(id) {
        this.skySubscriptionService.find(id)
            .subscribe((skySubscriptionResponse: HttpResponse<SkySubscription>) => {
                this.skySubscription = skySubscriptionResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSkySubscriptions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'skySubscriptionListModification',
            (response) => this.load(this.skySubscription.id)
        );
    }
}
