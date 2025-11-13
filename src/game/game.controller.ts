import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { GameDto } from './dto/create-game.dto';
import { EditGameDto } from './dto/edit-game.dto';
import { GameService } from './game.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('games')
export class GameController {
    constructor(private gameService: GameService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createGamee(@Body() dto: GameDto, @Req() req) {
        const { title, description } = dto
        return this.gameService.createGame({ title, description }, req.user);
    }

    @Get()
    getAllGames(@Query() query) {
        return this.gameService.getAllGames({ size: +query.size, page: +query.page, sortDir: query.sortDir });
    }

    @Get(':slug')
    getGameById(@Param() { slug }) {
        return this.gameService.getGameById(slug);
    }

    @Put(':slug')
    editGameById(@Param() { slug }, @Body() dto: EditGameDto) {
        return this.gameService.editGameById(slug, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':slug')
    deleteGameById(@Param() { slug }, @Req() req) {
        return this.gameService.deleteGame(slug, req.user.username);
    }

    @Get(':slug/scores')
    getGameScores(@Param() { slug }) {
        return this.gameService.getScores(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':slug/scores')
    createGameScore(@Param() { slug }, @Req() req, @Body() dto: CreateScoreDto) {
        return this.gameService.createScore(slug, req.user.username, dto);
    }

}
