import { BadRequestException, ValidationError } from '@nestjs/common';
import { validate } from 'class-validator';
import { randomBytes } from 'crypto';
import * as fs from 'fs-extra';
import { PermissionsActions } from '../modules/admin/permissions/enums/permissions-actions.enum';
import { PermissionsGroups } from '../modules/admin/permissions/enums/permissions-groups.enum';
import { AdminsRoles } from '../modules/admin/admins-roles/entities/admins-roles.entity';

export const extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const [type, token] = request.headers['authorization']?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export const extractErrorMessages = (errors: ValidationError[]): string[] => {
  let errorMessages: string[] = [];
  for (const error of errors) {
    if (error.constraints) {
      const constraints = Object.values(error.constraints);
      errorMessages = errorMessages.concat(constraints);
    }
    if (error.children && error.children.length > 0) {
      const childErrorMessages = extractErrorMessages(error.children);
      errorMessages = errorMessages.concat(childErrorMessages);
    }
  }
  return errorMessages;
};

export const validateDto = async (dto: any) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    throw new BadRequestException(extractErrorMessages(errors));
  }
  return true;
};

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = randomBytes(8).toString('hex');
  const fileExtension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${fileExtension}`;
};

export const saveFile = async (
  filepath: string,
  filename: string,
  file: any,
): Promise<boolean> => {
  await fs.ensureDir(filepath);
  await file.mv(filepath + filename);
  return true;
};

export const can = (
  action: PermissionsActions,
  group: PermissionsGroups,
  adminsRoles: AdminsRoles[],
) => {
  return adminsRoles.some((e) =>
    e.role.rolesPermissions.some(
      (p) => p.permission.action === action && p.permission.group === group,
    ),
  );
};
