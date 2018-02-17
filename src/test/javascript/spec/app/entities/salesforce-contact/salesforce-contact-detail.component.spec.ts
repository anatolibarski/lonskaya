/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LonskayaTestModule } from '../../../test.module';
import { SalesforceContactDetailComponent } from '../../../../../../main/webapp/app/entities/salesforce-contact/salesforce-contact-detail.component';
import { SalesforceContactService } from '../../../../../../main/webapp/app/entities/salesforce-contact/salesforce-contact.service';
import { SalesforceContact } from '../../../../../../main/webapp/app/entities/salesforce-contact/salesforce-contact.model';

describe('Component Tests', () => {

    describe('SalesforceContact Management Detail Component', () => {
        let comp: SalesforceContactDetailComponent;
        let fixture: ComponentFixture<SalesforceContactDetailComponent>;
        let service: SalesforceContactService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [SalesforceContactDetailComponent],
                providers: [
                    SalesforceContactService
                ]
            })
            .overrideTemplate(SalesforceContactDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SalesforceContactDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SalesforceContactService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SalesforceContact(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.salesforceContact).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
