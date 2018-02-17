import { BaseEntity } from './../../shared';

export class SalesforceContact implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
    ) {
    }
}
