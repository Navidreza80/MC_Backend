import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getAllUsers(username) {
        const isAdmin = await this.prisma.adminUser.findUnique({
            where: { username }
        })
        if (!isAdmin) {
            throw new ForbiddenException('Youre not allowed to access this endpoint.')
        }
        return this.prisma.platformUser.findMany()
    }

    async getAllAdmin(username) {
        const isAdmin = await this.prisma.adminUser.findUnique({
            where: { username }
        })
        if (!isAdmin) {
            throw new ForbiddenException('Youre not allowed to access this endpoint.')
        }
        return this.prisma.adminUser.findMany()
    }
}
