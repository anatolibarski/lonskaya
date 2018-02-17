import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SkySubscription } from './sky-subscription.model';
import { SkySubscriptionPopupService } from './sky-subscription-popup.service';
import { SkySubscriptionService } from './sky-subscription.service';

@Component({
    selector: 'jhi-sky-subscription-delete-dialog',
    templateUrl: './sky-subscription-delete-dialog.component.html'
})
export class SkySubscriptionDeleteDialogComponent {

    skySubscription: SkySubscription;

    constructor(
        private skySubscriptionService: SkySubscriptionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.skySubscriptionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'skySubscriptionListModification',
                content: 'Deleted an skySubscription'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sky-subscription-delete-popup',
    template: ''
})
export class SkySubscriptionDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private skySubscriptionPopupService: SkySubscriptionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.skySubscriptionPopupService
                .open(SkySubscriptionDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
