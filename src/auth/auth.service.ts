import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    async register(dto: RegisterDto) {
        const existing = await this.prisma.platformUser.findUnique({ where: { username: dto.username } });
        if (existing) throw new ConflictException('Username already registered');

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.platformUser.create({
            data: { ...dto, password: hashedPassword },
        });

        return this.signToken(user.username);
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.platformUser.findUnique({ where: { username: dto.username } });
        if (!user) throw new UnauthorizedException('User not found');

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        const currentDate = new Date()

        await this.prisma.platformUser.update({ where: { username: dto.username }, data: { lastLoginTimestamp: currentDate } });

        return this.signToken(user.username);
    }

    async adminLogin(dto: LoginDto) {
        const admin = await this.prisma.adminUser.findUnique({ where: { username: dto.username } });
        if (!admin) throw new UnauthorizedException('Admin not found');

        const valid = await bcrypt.compare(dto.password, admin.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        const currentDate = new Date()

        await this.prisma.adminUser.update({ where: { username: dto.username }, data: { lastLoginTimestamp: currentDate } });

        return this.signToken(admin.username);
    }

    async signToken(username: string) {
        const payload = { username };
        const token = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '7d',
        });
        return { access_token: token };
    }
}
