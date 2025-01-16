import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@spellen-doos/auth';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@spellen-doos/backend-user';
import { HelpButtonModule } from '@spellen-doos/backend/helpButton';
import { GameModule } from '@spellen-doos/backend/game';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          Logger.verbose('Connected to MongoDB', `${process.env.MONGO_URI}`);
        });
        connection._events.connected();
        return connection;
      },
    }),
    AuthModule,
    UserModule,
    HelpButtonModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
