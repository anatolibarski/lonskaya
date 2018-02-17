import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { SalesforceContact } from './salesforce-contact.model';
import { SalesforceContactService } from './salesforce-contact.service';

@Injectable()
export class SalesforceContactPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private salesforceContactService: SalesforceContactService

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
                this.salesforceContactService.find(id)
                    .subscribe((salesforceContactResponse: HttpResponse<SalesforceContact>) => {
                        const salesforceContact: SalesforceContact = salesforceContactResponse.body;
                        this.ngbModalRef = this.salesforceContactModalRef(component, salesforceContact);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.salesforceContactModalRef(component, new SalesforceContact());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    salesforceContactModalRef(component: Component, salesforceContact: SalesforceContact): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.salesforceContact = salesforceContact;
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
