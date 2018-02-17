import { BaseEntity } from './../../shared';

export class SkySubscription implements BaseEntity {
    constructor(
        public id?: number,
        public detailsJson?: string,
        public ticketId?: number,
        public userId?: number,
    ) {
    }
}
