import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestDto } from './dto/request.dto';
import { IdDto } from './dto/id.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('requests')
@ApiTags('API клиентских заявок')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}
  @Post()
  @ApiOperation({ summary: 'Создание заявки' })
  async createNewRequest(@Body() request: RequestDto) {
    return await this.requestsService.createNewRequest(request);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Получение заявки по id' })
  async getRequest(@Param() id: IdDto) {
    return await this.requestsService.getRequest(id);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Редактирование заявки по id' })
  async updateRequest(@Param() id: IdDto, @Body() request: RequestDto) {
    return await this.requestsService.updateRequest(id, request);
  }
}
