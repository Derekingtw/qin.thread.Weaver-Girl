import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./modules/app.controller";
import { AuthService } from "./modules/auth.service";
import { BusinessService } from "./modules/business.service";
import { PaymentService } from "./modules/payment.service";
import { PrismaService } from "./common/prisma.service";
import { RbacGuard } from "./common/rbac.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "dev_jwt_secret_change_me",
      signOptions: { expiresIn: "7d" }
    })
  ],
  controllers: [AppController],
  providers: [PrismaService, AuthService, BusinessService, PaymentService, RbacGuard]
})
export class AppModule {}
