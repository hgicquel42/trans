import { Injectable } from '@nestjs/common';
import { HistoryService } from 'src/db/history/history.service';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { MatchInfoDto } from './dto';

@Injectable()
export class MatchService {
	constructor(private prisma: PrismaService,
		private historyService: HistoryService) { }

	async updateWinnerInfo(userId: number) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				win: {
					increment: 1
				}
			}
		})
	}

	async updateLooserInfo(userId: number) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				loose: {
					increment: 1
				}
			}
		})
	}

	async matchEndUpdate(matchInfo: MatchInfoDto) {
		await this.updateWinnerInfo(matchInfo.winnerId)
		await this.updateLooserInfo(matchInfo.looserId)
		await this.historyService.addNewHistoy(matchInfo.winnerId, {
			result: true,
			userScore: matchInfo.winnerScore,
			opponentScore: matchInfo.looserScore,
			opponentId: matchInfo.looserId,
			mode: matchInfo.mode
		})
		await this.historyService.addNewHistoy(matchInfo.looserId, {
			result: false,
			userScore: matchInfo.looserScore,
			opponentScore: matchInfo.winnerScore,
			opponentId: matchInfo.looserId,
			mode: matchInfo.mode
		})
	}
}
