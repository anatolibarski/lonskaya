/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LonskayaTestModule } from '../../../test.module';
import { SalesforceContactComponent } from '../../../../../../main/webapp/app/entities/salesforce-contact/salesforce-contact.component';
import { SalesforceContactService } from '../../../../../../main/webapp/app/entities/salesforce-contact/salesforce-contact.service';
import { SalesforceContact } from '../../../../../../main/webapp/app/entities/salesforce-contact/salesforce-contact.model';

describe('Component Tests', () => {

    describe('SalesforceContact Management Component', () => {
        let comp: SalesforceContactComponent;
        let fixture: ComponentFixture<SalesforceContactComponent>;
        let service: SalesforceContactService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [SalesforceContactComponent],
                providers: [
                    SalesforceContactService
                ]
            })
            .overrideTemplate(SalesforceContactComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SalesforceContactComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SalesforceContactService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SalesforceContact(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.salesforceContacts[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
