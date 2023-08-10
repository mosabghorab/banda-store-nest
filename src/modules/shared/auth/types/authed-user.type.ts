import { UserType } from '../../users/enums/user-type.enum';
import { AdminsRoles } from '../../../admin/admins-roles/entities/admins-roles.entity';

export type AuthedUser = {
  id: number;
  type: UserType;
  adminsRoles: AdminsRoles[];
};
