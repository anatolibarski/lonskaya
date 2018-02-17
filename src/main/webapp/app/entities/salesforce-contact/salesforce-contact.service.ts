import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { SalesforceContact } from './salesforce-contact.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SalesforceContact>;

@Injectable()
export class SalesforceContactService {

    private resourceUrl =  SERVER_API_URL + 'api/salesforce-contacts';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/salesforce-contacts';

    constructor(private http: HttpClient) { }

    create(salesforceContact: SalesforceContact): Observable<EntityResponseType> {
        const copy = this.convert(salesforceContact);
        return this.http.post<SalesforceContact>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(salesforceContact: SalesforceContact): Observable<EntityResponseType> {
        const copy = this.convert(salesforceContact);
        return this.http.put<SalesforceContact>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SalesforceContact>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SalesforceContact[]>> {
        const options = createRequestOption(req);
        return this.http.get<SalesforceContact[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SalesforceContact[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<SalesforceContact[]>> {
        const options = createRequestOption(req);
        return this.http.get<SalesforceContact[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SalesforceContact[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SalesforceContact = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SalesforceContact[]>): HttpResponse<SalesforceContact[]> {
        const jsonResponse: SalesforceContact[] = res.body;
        const body: SalesforceContact[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SalesforceContact.
     */
    private convertItemFromServer(salesforceContact: SalesforceContact): SalesforceContact {
        const copy: SalesforceContact = Object.assign({}, salesforceContact);
        return copy;
    }

    /**
     * Convert a SalesforceContact to a JSON which can be sent to the server.
     */
    private convert(salesforceContact: SalesforceContact): SalesforceContact {
        const copy: SalesforceContact = Object.assign({}, salesforceContact);
        return copy;
    }
}
