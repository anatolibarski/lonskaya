import { BaseEntity } from './../../shared';

export class SkyTicket implements BaseEntity {
    constructor(
        public id?: number,
        public detailsJson?: string,
    ) {
    }
}
