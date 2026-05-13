import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { EmployeeRole } from "@prisma/client";

export const RequiredEmployeeRoles = (...roles: EmployeeRole[]) => SetMetadata("employeeRoles", roles);

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<EmployeeRole[]>("employeeRoles", context.getHandler()) ?? [];
    if (required.length === 0) return true;
    const request = context.switchToHttp().getRequest<{ user?: { employeeRole?: EmployeeRole } }>();
    return Boolean(request.user?.employeeRole && required.includes(request.user.employeeRole));
  }
}
