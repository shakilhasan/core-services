import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";

@Injectable()
export class AppService {
  constructor(
      @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
  ) {}
  getHello(): string {
    const data={name: 'test', price: 100};
    console.log('data:>', data);
    this.billingClient.emit(
        'item_created',
        data,
    );
    return 'Hello World!';
  }
}
