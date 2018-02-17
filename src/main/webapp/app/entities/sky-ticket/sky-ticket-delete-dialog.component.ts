import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { SkyTicket } from './sky-ticket.model';
import { SkyTicketPopupService } from './sky-ticket-popup.service';
import { SkyTicketService } from './sky-ticket.service';

@Component({
    selector: 'jhi-sky-ticket-delete-dialog',
    templateUrl: './sky-ticket-delete-dialog.component.html'
})
export class SkyTicketDeleteDialogComponent {

    skyTicket: SkyTicket;

    constructor(
        private skyTicketService: SkyTicketService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.skyTicketService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'skyTicketListModification',
                content: 'Deleted an skyTicket'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sky-ticket-delete-popup',
    template: ''
})
export class SkyTicketDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private skyTicketPopupService: SkyTicketPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.skyTicketPopupService
                .open(SkyTicketDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
