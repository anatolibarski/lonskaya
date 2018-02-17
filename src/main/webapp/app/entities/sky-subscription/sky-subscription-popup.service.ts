import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { SkySubscription } from './sky-subscription.model';
import { SkySubscriptionService } from './sky-subscription.service';

@Injectable()
export class SkySubscriptionPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private skySubscriptionService: SkySubscriptionService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.skySubscriptionService.find(id)
                    .subscribe((skySubscriptionResponse: HttpResponse<SkySubscription>) => {
                        const skySubscription: SkySubscription = skySubscriptionResponse.body;
                        this.ngbModalRef = this.skySubscriptionModalRef(component, skySubscription);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.skySubscriptionModalRef(component, new SkySubscription());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    skySubscriptionModalRef(component: Component, skySubscription: SkySubscription): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.skySubscription = skySubscription;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
