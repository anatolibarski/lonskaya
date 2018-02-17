/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LonskayaTestModule } from '../../../test.module';
import { SkyTicketDetailComponent } from '../../../../../../main/webapp/app/entities/sky-ticket/sky-ticket-detail.component';
import { SkyTicketService } from '../../../../../../main/webapp/app/entities/sky-ticket/sky-ticket.service';
import { SkyTicket } from '../../../../../../main/webapp/app/entities/sky-ticket/sky-ticket.model';

describe('Component Tests', () => {

    describe('SkyTicket Management Detail Component', () => {
        let comp: SkyTicketDetailComponent;
        let fixture: ComponentFixture<SkyTicketDetailComponent>;
        let service: SkyTicketService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [SkyTicketDetailComponent],
                providers: [
                    SkyTicketService
                ]
            })
            .overrideTemplate(SkyTicketDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SkyTicketDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SkyTicketService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SkyTicket(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.skyTicket).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
