import { SetMetadata } from '@nestjs/common';
import { $Enums } from 'generated/prisma';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: $Enums.UserType[]) =>
  SetMetadata(ROLES_KEY, roles);
