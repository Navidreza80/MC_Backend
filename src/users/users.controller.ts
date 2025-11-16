import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';

@Controller('users')
export class UsersController {
    constructor(private usresService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers(@Req() req) {
        return this.usresService.getAllUsers(req.user.username);
    }

    @UseGuards(JwtAuthGuard)
    @Get('admins')
    getAllAdmins(@Req() req) {
        return this.usresService.getAllAdmin(req.user.username);
    }

    @Get(':id')
    getUserById(@Param() param) {
        return this.usresService.getUserById(param.id);
    }


}
