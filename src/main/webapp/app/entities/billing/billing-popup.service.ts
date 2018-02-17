import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Billing } from './billing.model';
import { BillingService } from './billing.service';

@Injectable()
export class BillingPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private billingService: BillingService

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
                this.billingService.find(id)
                    .subscribe((billingResponse: HttpResponse<Billing>) => {
                        const billing: Billing = billingResponse.body;
                        if (billing.dueDate) {
                            billing.dueDate = {
                                year: billing.dueDate.getFullYear(),
                                month: billing.dueDate.getMonth() + 1,
                                day: billing.dueDate.getDate()
                            };
                        }
                        this.ngbModalRef = this.billingModalRef(component, billing);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.billingModalRef(component, new Billing());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    billingModalRef(component: Component, billing: Billing): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.billing = billing;
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
