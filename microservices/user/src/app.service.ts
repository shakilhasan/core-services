import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getUser(getUserRequest: any) {
    console.log('getUserRequest:>', getUserRequest);
    return {userId: '123', stripeUserId: '43234',}
  }
}
