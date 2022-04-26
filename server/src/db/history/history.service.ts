import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { UpdateHistoryDto } from './dto';

@Injectable()
export class HistoryService {
	constructor(private prisma: PrismaService) { }

	async addNewHistoy(userId: number, updateHistory: UpdateHistoryDto) {
		await this.prisma.history.create({
			data: {
				userId: userId,
				result: updateHistory.result,
				userScore: updateHistory.userScore,
				opponentScore: updateHistory.opponentScore,
				opponentId: updateHistory.opponentId,
				mode: updateHistory.mode
			}
		})
	}
}
