import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCategoryDto } from './dto/addCategory.dto';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(addCategoryDto: AddCategoryDto): Promise<Category> {
    try {
      const createdCategory = await this.categoryRepository.save(
        addCategoryDto,
      );
      return createdCategory;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException(
          `Category with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        `Failed to delete category`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
