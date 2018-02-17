import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Billing } from './billing.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Billing>;

@Injectable()
export class BillingService {

    private resourceUrl =  SERVER_API_URL + 'api/billings';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/billings';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(billing: Billing): Observable<EntityResponseType> {
        const copy = this.convert(billing);
        return this.http.post<Billing>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(billing: Billing): Observable<EntityResponseType> {
        const copy = this.convert(billing);
        return this.http.put<Billing>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Billing>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Billing[]>> {
        const options = createRequestOption(req);
        return this.http.get<Billing[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Billing[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Billing[]>> {
        const options = createRequestOption(req);
        return this.http.get<Billing[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Billing[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Billing = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Billing[]>): HttpResponse<Billing[]> {
        const jsonResponse: Billing[] = res.body;
        const body: Billing[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Billing.
     */
    private convertItemFromServer(billing: Billing): Billing {
        const copy: Billing = Object.assign({}, billing);
        copy.dueDate = this.dateUtils
            .convertLocalDateFromServer(billing.dueDate);
        return copy;
    }

    /**
     * Convert a Billing to a JSON which can be sent to the server.
     */
    private convert(billing: Billing): Billing {
        const copy: Billing = Object.assign({}, billing);
        copy.dueDate = this.dateUtils
            .convertLocalDateToServer(billing.dueDate);
        return copy;
    }
}
