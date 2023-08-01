import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { request } from "express";

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        try {
            const cookie = request.cookies['jwt'];
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
)