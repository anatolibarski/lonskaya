import { BaseEntity } from './../../shared';

export class Billing implements BaseEntity {
    constructor(
        public id?: number,
        public amount?: number,
        public currency?: string,
        public dueDate?: any,
        public closed?: boolean,
        public details?: BaseEntity,
        public skySubscription?: BaseEntity,
    ) {
        this.closed = false;
    }
}
