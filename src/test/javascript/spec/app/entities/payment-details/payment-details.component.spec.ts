/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LonskayaTestModule } from '../../../test.module';
import { PaymentDetailsComponent } from '../../../../../../main/webapp/app/entities/payment-details/payment-details.component';
import { PaymentDetailsService } from '../../../../../../main/webapp/app/entities/payment-details/payment-details.service';
import { PaymentDetails } from '../../../../../../main/webapp/app/entities/payment-details/payment-details.model';

describe('Component Tests', () => {

    describe('PaymentDetails Management Component', () => {
        let comp: PaymentDetailsComponent;
        let fixture: ComponentFixture<PaymentDetailsComponent>;
        let service: PaymentDetailsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [PaymentDetailsComponent],
                providers: [
                    PaymentDetailsService
                ]
            })
            .overrideTemplate(PaymentDetailsComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentDetailsComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentDetailsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new PaymentDetails(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.paymentDetails[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
