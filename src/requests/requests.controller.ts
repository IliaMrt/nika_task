import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { RequestDto } from "./dto/request.dto";
import { IdDto } from "./dto/id.dto";

@Controller('requests')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}
  @Post()
  async createNewRequest(@Body() request: RequestDto) {
    return await this.requestsService.createNewRequest(request);
  }
  @Get(':id')
  async getRequest(@Param() id: IdDto) {
    return await this.requestsService.getRequest(id);
  }
  @Put(':id')
  async updateRequest(@Param() id: IdDto, @Body() request: RequestDto) {
    return await this.requestsService.updateRequest(id, request);
  }
}
