/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LonskayaTestModule } from '../../../test.module';
import { BillingDetailComponent } from '../../../../../../main/webapp/app/entities/billing/billing-detail.component';
import { BillingService } from '../../../../../../main/webapp/app/entities/billing/billing.service';
import { Billing } from '../../../../../../main/webapp/app/entities/billing/billing.model';

describe('Component Tests', () => {

    describe('Billing Management Detail Component', () => {
        let comp: BillingDetailComponent;
        let fixture: ComponentFixture<BillingDetailComponent>;
        let service: BillingService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [BillingDetailComponent],
                providers: [
                    BillingService
                ]
            })
            .overrideTemplate(BillingDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BillingDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BillingService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Billing(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.billing).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
