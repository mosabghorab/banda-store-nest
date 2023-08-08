import { UserType } from '../../users/enums/user-type.enum';
import { AdminsRoles } from '../../../admin/admins-roles/entities/admins-roles.entity';

export type AuthUser = {
  id: number;
  type: UserType;
  adminsRoles: AdminsRoles[];
};
