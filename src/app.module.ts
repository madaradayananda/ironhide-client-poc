import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from './auth/rbac/roles.guard';
import { AuthzModule } from './authz/authz.module';
import { AuthzMiddleware } from './authz/authz.middleware';

@Module({
  imports: [EmployeeModule, UsersModule, AuthModule, AuthzModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthzMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
