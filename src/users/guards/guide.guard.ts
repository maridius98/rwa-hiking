import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class GuideGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request['user']){
            return false;
        }
        
        return request.user.isGuide;
    }
}