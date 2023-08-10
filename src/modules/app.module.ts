import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { User } from './shared/users/entities/user.entity';
import { UsersModule } from './shared/users/users.module';
import { Category } from './shared/categories/entities/category.entity';
import { Product } from './shared/products/entities/product.entity';
import { ProductImage } from './shared/product-images/entities/product-image.entity';
import { CategoriesModule } from './shared/categories/categories.module';
import { ProductsModule } from './shared/products/products.module';
import { ProductImagesModule } from './shared/product-images/product-images.module';
import { SettingsModule } from './shared/settings/settings.module';
import { Setting } from './shared/settings/entities/setting.entity';
import { Ad } from './shared/ads/entities/ad.entity';
import { AdsModule } from './shared/ads/ads.module';
import { FavoriteModule } from './customer/favorite/favorite.module';
import { Favorite } from './customer/favorite/entities/favorite.entity';
import { Reason } from './shared/reasons/entities/reason.entity';
import { ReasonsModule } from './shared/reasons/reasons.module';
import { ReportsModule } from './shared/reports/reports.module';
import { Report } from './shared/reports/entities/report.entity';
import { Role } from './admin/roles/entities/role.entity';
import { Permission } from './admin/permissions/entities/permission';
import { RolesPermissions } from './admin/roles-permissions/entities/roles-permissions.entity';
import { AdminsRoles } from './admin/admins-roles/entities/admins-roles.entity';
import { RolesModule } from './admin/roles/roles.module';
import { PermissionsModule } from './admin/permissions/permissions.module';
import { RolesPermissionsModule } from './admin/roles-permissions/roles-permissions.module';
import { AdminsRolesModule } from './admin/admins-roles/admins-roles.module';
import { AdminAuthModule } from './admin/auth/admin-auth.module';
import { CustomerAuthModule } from './customer/auth/customer-auth.module';
import { DriverAuthModule } from './driver/auth/driver-auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './shared/auth/guards/auth.guard';
import { NotificationsModule } from './shared/notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.' + (process.env.NODE_ENV || 'development'),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '15h' },
        };
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 10000, // time to live in mille seconds.
      // * for redis only *.
      // store: redisStore,
      // host: 'localhost',
      // port: 6379,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          database: configService.get<string>('DATABASE_NAME'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          entities: [
            User,
            Category,
            Product,
            Favorite,
            Reason,
            Report,
            ProductImage,
            Ad,
            Role,
            Permission,
            RolesPermissions,
            AdminsRoles,
            Setting,
          ],
          synchronize: true,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname.replace('/modules', '/'), '..', 'public'),
    }),
    EventEmitterModule.forRoot(),
    AdminAuthModule,
    CustomerAuthModule,
    DriverAuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    FavoriteModule,
    ReasonsModule,
    ReportsModule,
    ProductImagesModule,
    AdsModule,
    RolesModule,
    PermissionsModule,
    RolesPermissionsModule,
    AdminsRolesModule,
    SettingsModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
