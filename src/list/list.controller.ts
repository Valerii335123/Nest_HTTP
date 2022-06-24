import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import SearchListDto from './dto/search-list.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('list')
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly userServise: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async search(@Request() req, @Query() searchListDto: SearchListDto) {
    const user = await this.userServise.getById(req.user.id);
    return this.listService.search(searchListDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createListDto: CreateListDto) {
    const user = await this.userServise.getById(req.user.id);
    return this.listService.create(createListDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const user = await this.userServise.getById(req.user.id);
    return await this.listService.findOne(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    const user = await this.userServise.getById(req.user.id);
    return await this.listService.update(+id, updateListDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const user = await this.userServise.getById(req.user.id);
    return await this.listService.remove(+id, user);
  }
}
