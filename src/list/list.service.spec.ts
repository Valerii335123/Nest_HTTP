import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import searchListDto from './dto/search-list.dto';
import ListNotFoundException from './exceptions/listNotFound.exception';

const user = new User({
  id: 1,
  name: 'name',
  email: 'email@email.com',
});

const newList = new List({
  title: 'title',
  description: 'desk',
  priority: 1,
  user: user,
});

const listArray = [
  new List({ title: 'title', description: 'desk', priority: 1, user: user }),
  new List({ title: 'title2', description: 'desk2', priority: 2, user: user }),
  new List({ title: 'title3', description: 'desk3', priority: 3, user: user }),
];

describe('ListService', () => {
  let service: ListService;
  let repository: Repository<List>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: getRepositoryToken(List),
          useValue: {
            create: jest.fn().mockReturnValue(newList),
            save: jest.fn(),
            find: jest.fn().mockReturnValue(listArray),
            findOne: jest.fn().mockReturnValue(newList),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
    repository = module.get<Repository<List>>(getRepositoryToken(List));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create list successfully', () => {
      expect(
        service.create(
          {
            title: 'title',
            description: 'desk',
            priority: 1,
            parent_id: null,
          },
          user,
        ),
      )
        .resolves.toEqual(newList)
        .then(() => {
          expect(repository.create).toBeCalledTimes(1);
          expect(repository.create).toBeCalledWith({
            title: 'title',
            description: 'desk',
            priority: 1,
            parent_id: null,
          });
          expect(repository.save).toBeCalledTimes(1);
        });
    });
  });

  describe('search', () => {
    it('should search list', async function () {
      const lists = await service.search({} as searchListDto, user);
      expect(lists).toEqual(listArray);
    });
  });

  describe('find One', () => {
    it('should findOne by id', async function () {
      const list = await service.findOne(1, user);
      expect(list).toEqual(newList);
    });
    it('should return error', async function () {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValueOnce(new ListNotFoundException(1));
      expect(service.findOne(1, user)).rejects.toEqual(
        new ListNotFoundException(1),
      );
    });
  });

  describe('update', () => {
    it('should update successfully', async function () {
      expect(
        service.update(
          335,
          {
            title: 'title',
            description: 'desk',
            priority: 1,
          },
          user,
        ),
      )
        .resolves.toEqual(newList)
        .then(() => {
          expect(repository.update).toBeCalledTimes(1);
          expect(repository.update).toBeCalledWith(
            {
              id: 335,
              user: {
                id: 1,
              },
            },
            {
              title: 'title',
              description: 'desk',
              priority: 1,
            },
          );
        });
    });
    it('should return error', async function () {
      jest
        .spyOn(repository, 'update')
        .mockRejectedValueOnce(new ListNotFoundException(1));

      const list = service.update(
        335,
        {
          title: 'title',
          description: 'desk',
          priority: 1,
        },
        user,
      );

      expect(list).rejects.toEqual(new ListNotFoundException(1));
    });
  });

  describe('remove', () => {
    it('should remove successfully', async function () {
      expect(service.remove(335, user))
        .resolves.toEqual('List delete success')
        .then(() => {
          expect(repository.softDelete).toBeCalledTimes(1);
          expect(repository.softDelete).toBeCalledWith({
            id: 335,
            user: {
              id: 1,
            },
          });
        });
    });
    it('should return error', async function () {
      jest
        .spyOn(repository, 'softDelete')
        .mockRejectedValueOnce(new ListNotFoundException(1));

      const list = service.remove(335, user);

      expect(list).rejects.toEqual(new ListNotFoundException(1));
    });
  });
});
