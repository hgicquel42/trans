import { AuthGuard } from "@nestjs/passport";


export class FtAuthGuard extends AuthGuard('42') { }
