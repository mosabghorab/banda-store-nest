import { SetMetadata } from '@nestjs/common';
import { PermissionsGroups } from '../enums/permissions-groups.enum';

export const PERMISSIONS_TARGET_KEY = 'permissionsTarget';

export const PermissionsTarget = (permissionsGroups: PermissionsGroups) =>
  SetMetadata(PERMISSIONS_TARGET_KEY, permissionsGroups);
