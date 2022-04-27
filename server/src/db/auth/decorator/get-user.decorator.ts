import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
	(data: string | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		//console.log(request)
		return data ? user?.[data] : user;
	},
);

export const GetUserTest = createParamDecorator(
	(data: string | undefined, ctx: ExecutionContext) => {
		const req = ctx.switchToWs().getClient()
		const user = req.user

		console.log(user)
		return data ? user?.[data] : user
	}
)