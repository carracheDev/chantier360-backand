import { SetMetadata } from '@nestjs/common';
export const REQUIRED_PERMISSIONS_KEY = 'required_permissions';
export const RequirePermissions = (...permissions) => SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);
//# sourceMappingURL=permissions.decorator.js.map