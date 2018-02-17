import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { SkySubscription } from './sky-subscription.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<SkySubscription>;

@Injectable()
export class SkySubscriptionService {

    private resourceUrl =  SERVER_API_URL + 'api/sky-subscriptions';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/sky-subscriptions';

    constructor(private http: HttpClient) { }

    create(skySubscription: SkySubscription): Observable<EntityResponseType> {
        const copy = this.convert(skySubscription);
        return this.http.post<SkySubscription>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(skySubscription: SkySubscription): Observable<EntityResponseType> {
        const copy = this.convert(skySubscription);
        return this.http.put<SkySubscription>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<SkySubscription>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<SkySubscription[]>> {
        const options = createRequestOption(req);
        return this.http.get<SkySubscription[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SkySubscription[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<SkySubscription[]>> {
        const options = createRequestOption(req);
        return this.http.get<SkySubscription[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<SkySubscription[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: SkySubscription = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<SkySubscription[]>): HttpResponse<SkySubscription[]> {
        const jsonResponse: SkySubscription[] = res.body;
        const body: SkySubscription[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to SkySubscription.
     */
    private convertItemFromServer(skySubscription: SkySubscription): SkySubscription {
        const copy: SkySubscription = Object.assign({}, skySubscription);
        return copy;
    }

    /**
     * Convert a SkySubscription to a JSON which can be sent to the server.
     */
    private convert(skySubscription: SkySubscription): SkySubscription {
        const copy: SkySubscription = Object.assign({}, skySubscription);
        return copy;
    }
}
