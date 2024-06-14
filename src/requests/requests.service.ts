import { Injectable } from '@nestjs/common';
import { RequestDto } from './dto/request.dto';
import { IdDto } from './dto/id.dto';

@Injectable()
export class RequestsService {
  async createNewRequest(request: RequestDto) {
    return `newRequest, ${request}`;
  }

  async getRequest(id: IdDto) {
    return `getRequest ${id}`;
  }

  async updateRequest(id: IdDto, request: RequestDto) {
    return `updateRequest ${id.id} ${JSON.stringify(request)}`;
  }
}
