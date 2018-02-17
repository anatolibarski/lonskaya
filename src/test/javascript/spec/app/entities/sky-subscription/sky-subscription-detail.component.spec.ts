/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { LonskayaTestModule } from '../../../test.module';
import { SkySubscriptionDetailComponent } from '../../../../../../main/webapp/app/entities/sky-subscription/sky-subscription-detail.component';
import { SkySubscriptionService } from '../../../../../../main/webapp/app/entities/sky-subscription/sky-subscription.service';
import { SkySubscription } from '../../../../../../main/webapp/app/entities/sky-subscription/sky-subscription.model';

describe('Component Tests', () => {

    describe('SkySubscription Management Detail Component', () => {
        let comp: SkySubscriptionDetailComponent;
        let fixture: ComponentFixture<SkySubscriptionDetailComponent>;
        let service: SkySubscriptionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [SkySubscriptionDetailComponent],
                providers: [
                    SkySubscriptionService
                ]
            })
            .overrideTemplate(SkySubscriptionDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SkySubscriptionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SkySubscriptionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new SkySubscription(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.skySubscription).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
