/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LonskayaTestModule } from '../../../test.module';
import { SkyTicketComponent } from '../../../../../../main/webapp/app/entities/sky-ticket/sky-ticket.component';
import { SkyTicketService } from '../../../../../../main/webapp/app/entities/sky-ticket/sky-ticket.service';
import { SkyTicket } from '../../../../../../main/webapp/app/entities/sky-ticket/sky-ticket.model';

describe('Component Tests', () => {

    describe('SkyTicket Management Component', () => {
        let comp: SkyTicketComponent;
        let fixture: ComponentFixture<SkyTicketComponent>;
        let service: SkyTicketService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [SkyTicketComponent],
                providers: [
                    SkyTicketService
                ]
            })
            .overrideTemplate(SkyTicketComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SkyTicketComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SkyTicketService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SkyTicket(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.skyTickets[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
