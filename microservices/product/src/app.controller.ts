import {Controller, Get, Inject} from '@nestjs/common';
import {AppService} from './app.service';
import {ClientKafka, EventPattern, MessagePattern, Payload} from "@nestjs/microservices";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    ) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @EventPattern('item_created')
    create(@Payload() data: any) {
        console.log("EventPattern data:>",data);
        this.appService.handleOrderCreated(data);
    }

    onModuleInit() {
        this.authClient.subscribeToResponseOf('get_user');
    }

}
