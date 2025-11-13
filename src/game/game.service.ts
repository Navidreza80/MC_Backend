import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameDto } from './dto/create-game.dto';
import { EditGameDto } from './dto/edit-game.dto';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) { }

    async createGame(dto: GameDto, author) {
        const developer = await this.prisma.platformUser.findUnique({ where: { username: author.username } })
        if (!developer) {
            throw new ForbiddenException('Youre not allowed to access this endpoint')
        }
        if (developer.role !== "developer") {
            throw new ForbiddenException('Only developers can access')
        }
        const existing = await this.prisma.game.findUnique({ where: { title: dto.title } });
        if (existing) throw new ConflictException('Game already registered');

        const game = await this.prisma.game.create({
            data: { ...dto, author: developer.username, slug: dto.title.toLowerCase().replaceAll(" ", "") },
        });


        return game
    }

    async getAllGames(params) {
        return this.prisma.game.findMany({
            skip: params.page * params.size || 0,
            take: params.size || 2,
            orderBy: {
                title: params.sortDir || 'desc',
            }
        })
    }

    async getGameById(slug) {
        return this.prisma.game.findUnique({
            where: {
                slug
            }
        })
    }

    async editGameById(slug, dto: EditGameDto) {
        return this.prisma.game.update({
            where: {
                slug
            },
            data: {
                ...dto.title && { title: dto.title },
                ...dto.description && { description: dto.description }
            }
        })
    }

    async deleteGame(slug, username) {
        const isAdmin = await this.prisma.adminUser.findUnique({
            where: {
                username
            }
        })
        if (!isAdmin) {
            throw new ForbiddenException("Youre not allowed to access this endpoint")
        }
        const existingGame = await this.prisma.game.findUnique({
            where: {
                slug
            },
        })
        if (!existingGame) {
            throw new NotFoundException('Game not found')
        }
        const deletedGame = await this.prisma.game.delete({
            where: {
                slug
            },
        })
        return { data: deletedGame, message: "Game deleted successfully" }
    }

    async getScores(slug) {
        const existingGame = await this.prisma.game.findUnique({ where: { slug } })
        if (!existingGame) {
            throw new NotFoundException('Game not found')
        }
        return this.prisma.gameScore.findMany({
            where: {
                gameSlug: slug
            }
        })
    }

    async createScore(slug, username, dto) {
        const existing = await this.prisma.platformUser.findUnique({ where: { username } })
        if (!existing) {
            throw new ForbiddenException('Youre not allowed to access this endpoint')
        }
        const existingGame = await this.prisma.game.findUnique({ where: { slug } })
        if (!existingGame) {
            throw new NotFoundException('Game not found')
        }
        return this.prisma.gameScore.create({
            data: {
                gameSlug: slug,
                platformUserUsername: username,
                score: dto.score
            },
        })
    }
}
