import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SkySubscription } from './sky-subscription.model';
import { SkySubscriptionPopupService } from './sky-subscription-popup.service';
import { SkySubscriptionService } from './sky-subscription.service';
import { SkyTicket, SkyTicketService } from '../sky-ticket';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-sky-subscription-dialog',
    templateUrl: './sky-subscription-dialog.component.html'
})
export class SkySubscriptionDialogComponent implements OnInit {

    skySubscription: SkySubscription;
    isSaving: boolean;

    tickets: SkyTicket[];

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private skySubscriptionService: SkySubscriptionService,
        private skyTicketService: SkyTicketService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.skyTicketService
            .query({filter: 'skysubscription-is-null'})
            .subscribe((res: HttpResponse<SkyTicket[]>) => {
                if (!this.skySubscription.ticketId) {
                    this.tickets = res.body;
                } else {
                    this.skyTicketService
                        .find(this.skySubscription.ticketId)
                        .subscribe((subRes: HttpResponse<SkyTicket>) => {
                            this.tickets = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.skySubscription.id !== undefined) {
            this.subscribeToSaveResponse(
                this.skySubscriptionService.update(this.skySubscription));
        } else {
            this.subscribeToSaveResponse(
                this.skySubscriptionService.create(this.skySubscription));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SkySubscription>>) {
        result.subscribe((res: HttpResponse<SkySubscription>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SkySubscription) {
        this.eventManager.broadcast({ name: 'skySubscriptionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackSkyTicketById(index: number, item: SkyTicket) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-sky-subscription-popup',
    template: ''
})
export class SkySubscriptionPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private skySubscriptionPopupService: SkySubscriptionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.skySubscriptionPopupService
                    .open(SkySubscriptionDialogComponent as Component, params['id']);
            } else {
                this.skySubscriptionPopupService
                    .open(SkySubscriptionDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
