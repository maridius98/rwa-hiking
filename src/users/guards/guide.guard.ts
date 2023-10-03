import { CanActivate, ExecutionContext } from "@nestjs/common";

export class GuideGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log(request.user.isGuide);
        if (!request['user']){
            return false;
        }
        return request.user.isGuide;
    }
}