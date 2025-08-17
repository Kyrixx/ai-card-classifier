import { Module } from '@nestjs/common';
import { SessionController } from './controllers/session.controller';
import { CardController } from './controllers/card.controller';
import { CollectionController } from './controllers/collection.controller';
import { SetController } from './controllers/set.controller';
import { MtgJsonRepository } from './repositories/mtg-json.repository';
import { DbRepository } from './repositories/db.repository';
import { CardService } from './services/card.service';
import { AiService } from './services/ai.service';
import { SetService } from './services/set.service';
import { VideoProcessorService } from './services/video-processor.service';
import { ProcessorController } from './controllers/processor.controller';
import { CollectionService } from './services/collection.service';

@Module({
  controllers: [
    SessionController,
    CardController,
    CollectionController,
    SetController,
    ProcessorController,
  ],
  providers: [
    MtgJsonRepository,
    DbRepository,
    CardService,
    AiService,
    SetService,
    VideoProcessorService,
    CollectionService,
  ],
})
export class AppModule {}
