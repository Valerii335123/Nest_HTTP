import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Like, Repository, TreeRepository } from 'typeorm';
import ListNotFoundException from './exceptions/listNotFound.exception';
import SearchListDto from './dto/search-list.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    //todo repository for work with model like tree
    @InjectRepository(List)
    private listTreeRepository: TreeRepository<List>,
  ) {}

  async create(createListDto: CreateListDto, user: User): Promise<List> {
    const newList = await this.listRepository.create(createListDto);
    newList.user = user;
    await this.listRepository.save(newList);
    return newList;
  }

  async search(searchListDto: SearchListDto, user: User) {
    const lists = await this.listRepository.find({
      where: {
        title: Like(`%${searchListDto.title ?? ''}%`),
        description: Like(`%${searchListDto.description ?? ''}%`),
        priority: searchListDto.priority,
        user: { id: user.id },
      },
    });

    return lists;
  }

  async findOne(id: number, user?: User): Promise<List> {
    console.log(user);
    const list = await this.listRepository.findOne({
      where: {
        id: id,
        user: { id: user.id },
      },
    });
    if (list) {
      return list;
    }
    throw new ListNotFoundException(id);
  }

  async update(id: number, updateListDto: UpdateListDto, user: User) {
    const isUpdate = await this.listRepository.update(
      {
        id: id,
        user: { id: user.id },
      },
      updateListDto,
    );

    if (!isUpdate.affected) {
      throw new ListNotFoundException(id);
    }

    return await this.findOne(id, user);
  }

  async remove(id: number, user: User): Promise<string> {
    const deletedResponce = await this.listRepository.softDelete({
      id: id,
      user: { id: user.id },
    });

    if (!deletedResponce.affected) throw new ListNotFoundException(id);

    return 'List delete success';
  }
}
