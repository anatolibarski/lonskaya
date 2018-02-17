/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LonskayaTestModule } from '../../../test.module';
import { BillingComponent } from '../../../../../../main/webapp/app/entities/billing/billing.component';
import { BillingService } from '../../../../../../main/webapp/app/entities/billing/billing.service';
import { Billing } from '../../../../../../main/webapp/app/entities/billing/billing.model';

describe('Component Tests', () => {

    describe('Billing Management Component', () => {
        let comp: BillingComponent;
        let fixture: ComponentFixture<BillingComponent>;
        let service: BillingService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [BillingComponent],
                providers: [
                    BillingService
                ]
            })
            .overrideTemplate(BillingComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BillingComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BillingService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Billing(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.billings[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
