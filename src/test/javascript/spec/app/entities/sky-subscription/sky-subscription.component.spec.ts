/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { LonskayaTestModule } from '../../../test.module';
import { SkySubscriptionComponent } from '../../../../../../main/webapp/app/entities/sky-subscription/sky-subscription.component';
import { SkySubscriptionService } from '../../../../../../main/webapp/app/entities/sky-subscription/sky-subscription.service';
import { SkySubscription } from '../../../../../../main/webapp/app/entities/sky-subscription/sky-subscription.model';

describe('Component Tests', () => {

    describe('SkySubscription Management Component', () => {
        let comp: SkySubscriptionComponent;
        let fixture: ComponentFixture<SkySubscriptionComponent>;
        let service: SkySubscriptionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [LonskayaTestModule],
                declarations: [SkySubscriptionComponent],
                providers: [
                    SkySubscriptionService
                ]
            })
            .overrideTemplate(SkySubscriptionComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SkySubscriptionComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SkySubscriptionService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new SkySubscription(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.skySubscriptions[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
