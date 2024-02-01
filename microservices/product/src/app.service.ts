import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";

@Injectable()
export class AppService {
  constructor(
      @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  handleOrderCreated(orderCreatedEvent: {userId: string; price: number}) {
    console.log('orderCreatedEvent:>', orderCreatedEvent);
    this.authClient
        .send('get_user', JSON.stringify(orderCreatedEvent.userId))
        .subscribe((user) => {
          console.log('user:>', user);
          console.log(
              `Billing user with stripe ID ${user.stripeUserId} a price of $${orderCreatedEvent.price}...`,
          );
        });
  }
}
