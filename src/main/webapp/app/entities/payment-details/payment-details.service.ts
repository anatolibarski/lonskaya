import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { PaymentDetails } from './payment-details.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PaymentDetails>;

@Injectable()
export class PaymentDetailsService {

    private resourceUrl =  SERVER_API_URL + 'api/payment-details';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/payment-details';

    constructor(private http: HttpClient) { }

    create(paymentDetails: PaymentDetails): Observable<EntityResponseType> {
        const copy = this.convert(paymentDetails);
        return this.http.post<PaymentDetails>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(paymentDetails: PaymentDetails): Observable<EntityResponseType> {
        const copy = this.convert(paymentDetails);
        return this.http.put<PaymentDetails>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PaymentDetails>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PaymentDetails[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentDetails[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<PaymentDetails[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentDetails[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentDetails[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PaymentDetails = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PaymentDetails[]>): HttpResponse<PaymentDetails[]> {
        const jsonResponse: PaymentDetails[] = res.body;
        const body: PaymentDetails[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to PaymentDetails.
     */
    private convertItemFromServer(paymentDetails: PaymentDetails): PaymentDetails {
        const copy: PaymentDetails = Object.assign({}, paymentDetails);
        return copy;
    }

    /**
     * Convert a PaymentDetails to a JSON which can be sent to the server.
     */
    private convert(paymentDetails: PaymentDetails): PaymentDetails {
        const copy: PaymentDetails = Object.assign({}, paymentDetails);
        return copy;
    }
}
