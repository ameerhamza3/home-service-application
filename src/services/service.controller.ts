import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/CreateServiceDto';
import { ApproveServiceDto } from './dto/ApproveServiceDto';
import { RejectServiceDto } from './dto/RejectServiceDto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('add-service')
  registerService(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.registerService(createServiceDto);
  }

  @Get('new')
  getAllNewServices(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ) {
    return this.serviceService.getAllNewServices(page, perPage);
  }

  @Get('seller/:sellerId')
  getServicesOfSeller(@Param('sellerId') sellerId: number) {
    return this.serviceService.getServicesOfSeller(sellerId);
  }

  @Put('approve/:id')
  approveService(
    @Param('id') id: number,
    @Body() approveServiceDto: ApproveServiceDto,
  ) {
    return this.serviceService.approveService(id);
  }

  @Put('reject/:id')
  rejectService(
    @Param('id') id: number,
    @Body() rejectServiceDto: RejectServiceDto,
  ) {
    return this.serviceService.rejectService(id, rejectServiceDto);
  }

  @Get('approved')
  getAllApprovedServices() {
    return this.serviceService.getAllApprovedServices();
  }

  @Get('rejected')
  getAllRejectedServices() {
    return this.serviceService.getAllRejectedServices();
  }

  @Put('request-reapproval/:id')
  requestReApproval(@Param('id') id: number) {
    return this.serviceService.requestReApproval(id);
  }

  @Put('approve-rejected/:id')
  approveRejectedService(@Param('id') id: number) {
    return this.serviceService.approveRejectedService(id);
  }

  @Get('search')
  searchServicesByCategory(@Query('categoryId') categoryId: number) {
    return this.serviceService.searchServicesByCategory(categoryId);
  }

  @Get(':id')
  getServiceById(@Param('id') id: number) {
    return this.serviceService.getServiceById(id);
  }
}
