import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { SkyTicket } from './sky-ticket.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SkyTicket>;

@Injectable()
export class SkyTicketService {

    private resourceUrl =  SERVER_API_URL + 'api/sky-tickets';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/sky-tickets';

    constructor(private http: HttpClient) { }

    create(skyTicket: SkyTicket): Observable<EntityResponseType> {
        const copy = this.convert(skyTicket);
        return this.http.post<SkyTicket>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(skyTicket: SkyTicket): Observable<EntityResponseType> {
        const copy = this.convert(skyTicket);
        return this.http.put<SkyTicket>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SkyTicket>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SkyTicket[]>> {
        const options = createRequestOption(req);
        return this.http.get<SkyTicket[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SkyTicket[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<SkyTicket[]>> {
        const options = createRequestOption(req);
        return this.http.get<SkyTicket[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SkyTicket[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SkyTicket = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SkyTicket[]>): HttpResponse<SkyTicket[]> {
        const jsonResponse: SkyTicket[] = res.body;
        const body: SkyTicket[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SkyTicket.
     */
    private convertItemFromServer(skyTicket: SkyTicket): SkyTicket {
        const copy: SkyTicket = Object.assign({}, skyTicket);
        return copy;
    }

    /**
     * Convert a SkyTicket to a JSON which can be sent to the server.
     */
    private convert(skyTicket: SkyTicket): SkyTicket {
        const copy: SkyTicket = Object.assign({}, skyTicket);
        return copy;
    }
}
