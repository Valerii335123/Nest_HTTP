import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import ListNotFoundException from './exceptions/listNotFound.exception';
import SearchListDto from './dto/search-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto): Promise<List> {
    const newList = await this.listRepository.create(createListDto);
    await this.listRepository.save(newList);
    return newList;
  }

  async findAll() {
    return 'sdfs';
  }

  async findOne(id: number): Promise<List> {
    const list = await this.listRepository.findOne({
      where: {
        id: id,
      },
    });
    if (list) {
      return list;
    }
    throw new ListNotFoundException(id);
  }

  async update(id: number, updateListDto: UpdateListDto): Promise<List> {
    await this.listRepository.update(id, updateListDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deletedResponce = await this.listRepository.softDelete(id);
    if (!deletedResponce.affected) throw new ListNotFoundException(id);
  }
}
