import { User } from '.prisma/client';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UserService } from 'src/db/user/user.service';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { FtAuthGuard, JwtGuard } from './guards';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh.guard';
import { JwtTwoFaGuard } from "./twofa-auth/guards";

// Manage the authentification
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private prisma: PrismaService,
    private userService: UserService) { }


  @UseGuards(JwtGuard)
  @Get()
  authenticate(@GetUser() user: User) {
    return this.prisma.user.findUnique({
      where: {
        id: user.id
      }
    })
  }

  // For testing with users
  @Post('add')
  async _addUserTest(@Body() newUser: { username: string, photo: string }) {
    const user = await this.prisma.user.create({
      data: {
        username: newUser.username,
        nickname: newUser.username,
        photo: newUser.photo
      }
    })

    return this.authService.getJwtToken(user.id)
  }

  // Redirect to 42 authorizattion page
  @UseGuards(FtAuthGuard)
  @Get('login')
  login() {
  }

  @UseGuards(JwtTwoFaGuard)
  @Get('clear-cookie')
  clear_cookie(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('_intra_42_session_production')
    return res.redirect('/api/auth/logout')
  }

  @UseGuards(JwtTwoFaGuard)
  @Get('logout')
  logout(@GetUser() user: User, @Res({ passthrough: true }) res: Response) {
    res.cookie('Authentication', '')
    res.cookie('Refresh', '')
    this.userService.updateUser(user.id, { currentTokenExpirationTime: 0 })
    this.userService.logout(user.id)
    return res.redirect('/')
  }

  // Come here after gaving authorization at the authorization page
  // Add the user to the db and redirect to the index page of the site (change it later)
  //@Header('Access-Control-Allow-Origin', '*')
  @UseGuards(FtAuthGuard)
  @Get('redirect')
  async redirect(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { user } = req

    const access_token = this.authService.getJwtToken(user.id)
    res.cookie('Authentication', access_token, { httpOnly: true, sameSite: true, secure: true })
    this.authService.setCurrentTokenExpTime(user.id)

    if (user.twoFA) {
      return res.redirect('/?twofa=true')
    }

    const refresh_token = this.authService.getJwtRefreshToken(user.id)
    await this.userService.setCurrentRefreshToken(refresh_token, user.id)
    res.cookie('Refresh', refresh_token, { httpOnly: true, sameSite: true, secure: true })

    return res.redirect('/')
  }

  @UseGuards(JwtTwoFaGuard)
  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh')
  async refresh(@GetUser() user: User, @Res() res: Response) {
    const access_token = this.authService.getJwtToken(user.id, true)
    res.cookie('Authentication', access_token, { httpOnly: true, sameSite: true, secure: true })
    const update = await this.authService.setCurrentTokenExpTime(user.id)
    return res.send(update)
  }

  @Get('disconnect/:id')
  disconnect(@Param('id', ParseIntPipe) id: number) {
    this.userService.logout(id)
  }
}