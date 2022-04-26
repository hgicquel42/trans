import { Module } from '@nestjs/common';
import { HistoryService } from 'src/db/history/history.service';
import { MatchService } from './match.service';

@Module({
	controllers: [],
	providers: [MatchService, HistoryService]
})
export class MatchModule { }
