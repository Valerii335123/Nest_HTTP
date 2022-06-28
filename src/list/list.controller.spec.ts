import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { List } from './entities/list.entity';
import SearchListDto from './dto/search-list.dto';
import createListDto, { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
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

const requestWithUser = {
  user: {
    id: 1,
  },
};

describe('ListController', () => {
  let controller: ListController;
  let listService: ListService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getById: jest.fn().mockImplementation((id: number) => {
              Promise.resolve(user);
            }),
          },
        },
        {
          provide: ListService,
          useValue: {
            search: jest.fn().mockResolvedValue(listArray),
            findOne: jest.fn().mockResolvedValue(newList),
            create: jest.fn().mockResolvedValue(newList),
            update: jest.fn().mockResolvedValue(newList),
            remove: jest.fn().mockResolvedValue('List delete success'),
          },
        },
      ],
    }).compile();

    controller = module.get<ListController>(ListController);
    listService = module.get<ListService>(ListService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should return array of lists', async function () {
      const searchDto = new SearchListDto({
        title: 'title',
      });
      const lists = await controller.search(requestWithUser, searchDto);
      await expect(lists).toEqual(listArray);
      expect(userService.getById).toBeCalledTimes(1);
      expect(listService.search).toBeCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create list', async function () {
      const createListDto = new CreateListDto({
        title: 'title',
        description: 'desk',
        priority: 1,
      });
      const newList = await controller.create(requestWithUser, createListDto);
      expect(newList).toEqual(newList);
      expect(userService.getById).toBeCalledTimes(1);
      expect(listService.create).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return one list By id', async function () {
      const oneList = await controller.findOne(requestWithUser, '1');
      expect(oneList).toEqual(newList);
      expect(userService.getById).toBeCalledTimes(1);
      expect(listService.findOne).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    const updateListDto = new UpdateListDto({
      title: 'title',
      description: 'desk',
      priority: 1,
    });
    it('should update success', async function () {
      const listUpdate = await controller.update(
        requestWithUser,
        '1',
        updateListDto,
      );
      expect(listUpdate).toEqual(newList);
      expect(userService.getById).toBeCalledTimes(1);
      expect(listService.update).toBeCalledTimes(1);
    });

    it('should return error update', async function () {
      jest
        .spyOn(listService, 'update')
        .mockRejectedValueOnce(new ListNotFoundException(1));

      expect(
        controller.update(requestWithUser, '1', updateListDto),
      ).rejects.toEqual(new ListNotFoundException(1));
    });
  });

  describe('remove', () => {
    it('should remove success', async function () {
      const listremove = await controller.remove(requestWithUser, '1');
      expect(listremove).toEqual('List delete success');
      expect(userService.getById).toBeCalledTimes(1);
      expect(listService.remove).toBeCalledTimes(1);
    });

    it('should return error update', async function () {
      jest
        .spyOn(listService, 'remove')
        .mockRejectedValueOnce(new ListNotFoundException(1));

      expect(controller.remove(requestWithUser, '1')).rejects.toEqual(
        new ListNotFoundException(1),
      );
      expect(userService.getById).toBeCalledTimes(1);
    });
  });
});
