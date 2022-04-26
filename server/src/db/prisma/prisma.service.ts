import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';


// Allow us to use the db in an easier way
@Injectable()
export class PrismaService extends PrismaClient {
	constructor(private config: ConfigService) {
		super({
			datasources: {
				db: {
					url: config.get('DATABASE_URL')
				}
			}
		})
		console.log(config.get('DATABASE_URL'))
	}
}
