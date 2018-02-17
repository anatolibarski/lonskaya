/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LonskayaTestModule } from '../../../test.module';
import { SkyTicketDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/sky-ticket/sky-ticket-delete-dialog.component';
import { SkyTicketService } from '../../../../../../main/webapp/app/entities/sky-ticket/sky-ticket.service';

describe('Component Tests', () => {

    describe('SkyTicket Management Delete Component', () => {
        let comp: SkyTicketDeleteDialogComponent;
        let fixture: ComponentFixture<SkyTicketDeleteDialogComponent>;
        let service: SkyTicketService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [SkyTicketDeleteDialogComponent],
                providers: [
                    SkyTicketService
                ]
            })
            .overrideTemplate(SkyTicketDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SkyTicketDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SkyTicketService);
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
