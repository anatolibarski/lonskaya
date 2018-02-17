/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LonskayaTestModule } from '../../../test.module';
import { PaymentDetailsDetailComponent } from '../../../../../../main/webapp/app/entities/payment-details/payment-details-detail.component';
import { PaymentDetailsService } from '../../../../../../main/webapp/app/entities/payment-details/payment-details.service';
import { PaymentDetails } from '../../../../../../main/webapp/app/entities/payment-details/payment-details.model';

describe('Component Tests', () => {

    describe('PaymentDetails Management Detail Component', () => {
        let comp: PaymentDetailsDetailComponent;
        let fixture: ComponentFixture<PaymentDetailsDetailComponent>;
        let service: PaymentDetailsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [PaymentDetailsDetailComponent],
                providers: [
                    PaymentDetailsService
                ]
            })
            .overrideTemplate(PaymentDetailsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentDetailsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentDetailsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new PaymentDetails(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.paymentDetails).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
