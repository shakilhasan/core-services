import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";

@Injectable()
export class AppService {
    constructor(
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
    ) {
    }

    getHello(): string {
        const data = JSON.stringify({orderId: '123', userId: '1404', price: 100});
        console.log('data:>', data);
        this.billingClient.emit(
            'item_created',
            data,
        );
        return 'Hello World!';
    }
}
