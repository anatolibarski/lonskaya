/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LonskayaTestModule } from '../../../test.module';
import { PaymentDetailsDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/payment-details/payment-details-delete-dialog.component';
import { PaymentDetailsService } from '../../../../../../main/webapp/app/entities/payment-details/payment-details.service';

describe('Component Tests', () => {

    describe('PaymentDetails Management Delete Component', () => {
        let comp: PaymentDetailsDeleteDialogComponent;
        let fixture: ComponentFixture<PaymentDetailsDeleteDialogComponent>;
        let service: PaymentDetailsService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [PaymentDetailsDeleteDialogComponent],
                providers: [
                    PaymentDetailsService
                ]
            })
            .overrideTemplate(PaymentDetailsDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentDetailsDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentDetailsService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
