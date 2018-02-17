/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { LonskayaTestModule } from '../../../test.module';
import { SkySubscriptionDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/sky-subscription/sky-subscription-delete-dialog.component';
import { SkySubscriptionService } from '../../../../../../main/webapp/app/entities/sky-subscription/sky-subscription.service';

describe('Component Tests', () => {

    describe('SkySubscription Management Delete Component', () => {
        let comp: SkySubscriptionDeleteDialogComponent;
        let fixture: ComponentFixture<SkySubscriptionDeleteDialogComponent>;
        let service: SkySubscriptionService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [SkySubscriptionDeleteDialogComponent],
                providers: [
                    SkySubscriptionService
                ]
            })
            .overrideTemplate(SkySubscriptionDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SkySubscriptionDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SkySubscriptionService);
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
