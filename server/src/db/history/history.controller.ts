import { Controller, UseGuards } from '@nestjs/common';
import { JwtTwoFaGuard } from 'src/db/auth/twofa-auth/guards';
import { PrismaService } from 'src/db/prisma/prisma.service';

@UseGuards(JwtTwoFaGuard)
@Controller('history')
export class HistoryController {
	constructor(private prisma: PrismaService) { }

	// Add a new field to the history
	/*@Post('new')
	async addHistory(@GetUser() payload: any, @Body() updateHistory: UpdateHistoryDto) {
		const history = await this.prisma.history.create({
			data: {
				userId: payload.sub,
				result: updateHistory.result,
				userScore: updateHistory.userScore,
				opponentScore: updateHistory.opponentScore,
				opponentId: updateHistory.opponentId,
				mode: updateHistory.mode
			}
		})

		return history
	}*/
}
