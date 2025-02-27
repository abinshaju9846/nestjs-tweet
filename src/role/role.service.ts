import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role)
  private roleRepository: Repository<Role>) { }
  async create(createRoleDto: CreateRoleDto) {
    const role = createRoleDto.role
    const roleExists = await this.roleRepository.findOne({ where: { role: ILike(role) } })
    if (roleExists) {
      throw new ConflictException("Role already exists ")
    }
    const newRole = this.roleRepository.create({ role })
    return await this.roleRepository.save(newRole)
  }

  async findAll() {
    return await this.roleRepository.find();
  }


  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = updateRoleDto.role
    const roleExists = await this.roleRepository.findOne({ where: { id } })
    if (!roleExists) {
      throw new ConflictException("Role not found ")
    }
    // console.log("updaed value",updateRoleDto);

    const updated = await this.roleRepository.update({ id }, { role: role })
    // console.log(updated);

    return this.roleRepository.findOne({ where: { id } })
  }

  async remove(id: number) {

    await this.roleRepository.delete(id);
    return {
      message: 'Role deleted successfully.',
      statusCode: HttpStatus.OK,
    }

  }
}
