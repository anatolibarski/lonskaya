import { BaseEntity } from './../../shared';

export class PaymentDetails implements BaseEntity {
    constructor(
        public id?: number,
        public invoiceUrl?: string,
        public paymentMethod?: string,
        public detailsJson?: string,
    ) {
    }
}
