import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ParentListExistValidator } from './validator/parentListExist.validator';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([List]), UserModule],
  controllers: [ListController],
  providers: [ListService, ParentListExistValidator],
})
export class ListModule {}
