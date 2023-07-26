import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Service } from './entity/service.entity';
import { CreateServiceDto } from './dto/CreateServiceDto';
import { RejectServiceDto } from './dto/RejectServiceDto';

const ApprovalTypes = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING: 'pending',
};

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async registerService(createServiceDto: CreateServiceDto): Promise<Service> {
    try {
      const createdService = await this.serviceRepository.save(
        createServiceDto,
      );

      return createdService;
    } catch (error) {
      throw new HttpException(
        'Failed to create Service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllNewServices(page: number, perPage: number): Promise<Service[]> {
    try {
      const skip = (page - 1) * perPage;
      return this.serviceRepository.find({
        order: {
          createdAt: 'DESC',
        },
        skip: skip,
        take: perPage,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch new services',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getServicesOfSeller(sellerId: number): Promise<Service[]> {
    try {
      return this.serviceRepository.find({ where: { userId: sellerId } });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch services of seller',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async approveService(id: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new HttpException(
          `Service with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      service.isApproved = ApprovalTypes.APPROVED;

      return this.serviceRepository.save(service);
    } catch (error) {
      throw new HttpException(
        `Service with ID ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async rejectService(
    id: number,
    rejectServiceDto: RejectServiceDto,
  ): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new HttpException(
          `Service with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      service.isApproved = ApprovalTypes.REJECTED;
      service.rejectionReason = rejectServiceDto.reason;

      return this.serviceRepository.save(service);
    } catch (error) {
      throw new HttpException(
        `Service with ID ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllApprovedServices(): Promise<Service[]> {
    try {
      return this.serviceRepository.find({
        where: { isApproved: ApprovalTypes.APPROVED },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch approved services',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllRejectedServices(): Promise<Service[]> {
    try {
      return this.serviceRepository.find({
        where: { isApproved: ApprovalTypes.REJECTED },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch rejected services',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async requestReApproval(id: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service) {
        throw new HttpException(
          `Service with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      service.isApproved = ApprovalTypes.PENDING;
      return this.serviceRepository.save(service);
    } catch (error) {
      throw new HttpException(
        `Service with ID ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async approveRejectedService(id: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({ where: { id } });

      if (!service || service.isApproved !== ApprovalTypes.REJECTED) {
        throw new HttpException(
          `Rejected Service with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      service.isApproved = ApprovalTypes.APPROVED;
      return this.serviceRepository.save(service);
    } catch (error) {
      throw new HttpException(
        `Rejected Service with ID ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchServicesByCategory(categoryId: number): Promise<Service[]> {
    try {
      return this.serviceRepository.find({
        where: {
          categoryId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch services by category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getServiceById(id: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!service) {
        throw new HttpException(
          `Service with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return service;
    } catch (error) {
      throw new HttpException(
        `Service with ID ${id} not found`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
