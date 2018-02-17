import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SkyTicket } from './sky-ticket.model';
import { SkyTicketPopupService } from './sky-ticket-popup.service';
import { SkyTicketService } from './sky-ticket.service';

@Component({
    selector: 'jhi-sky-ticket-dialog',
    templateUrl: './sky-ticket-dialog.component.html'
})
export class SkyTicketDialogComponent implements OnInit {

    skyTicket: SkyTicket;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private skyTicketService: SkyTicketService,
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
        if (this.skyTicket.id !== undefined) {
            this.subscribeToSaveResponse(
                this.skyTicketService.update(this.skyTicket));
        } else {
            this.subscribeToSaveResponse(
                this.skyTicketService.create(this.skyTicket));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<SkyTicket>>) {
        result.subscribe((res: HttpResponse<SkyTicket>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: SkyTicket) {
        this.eventManager.broadcast({ name: 'skyTicketListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-sky-ticket-popup',
    template: ''
})
export class SkyTicketPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private skyTicketPopupService: SkyTicketPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.skyTicketPopupService
                    .open(SkyTicketDialogComponent as Component, params['id']);
            } else {
                this.skyTicketPopupService
                    .open(SkyTicketDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
