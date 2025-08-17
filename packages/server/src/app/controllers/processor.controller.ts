import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { activeThreads, runWorker } from '../services/thread/thread';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as fs from 'fs';
import { SetService } from '../services/set.service';
import { MtgJsonRepository } from '../repositories/mtg-json.repository';

@Controller('processor')
export class ProcessorController {
  constructor(private readonly setService: SetService, private readonly mtgJsonRepository: MtgJsonRepository) {}

  @Post('r')
  @UseInterceptors(FileInterceptor('file'))
  run(
    @UploadedFile() file: Express.Multer.File,
    @Query('sessionId') sessionId: string,
    @Query('boosterId') boosterId: string,
    @Query('date') date: string,
    @Res() res: Response,
  ) {
    const now = Date.now();
    fs.writeFileSync(`./assets/video-${now}.webm`, file.buffer);
    runWorker({
      filename: `./assets/video-${now}.webm`,
      sessionId: sessionId,
      boosterId: parseInt(boosterId, 10),
      date: parseInt(date, 10),
    })
      .then((card) => {
        res.status(201).send(card);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  }

  @Get('thread-count')
  getThreadCount() {
    return {
      threadCount: activeThreads,
    };
  }

  @Patch('update-sets')
  async updateSets(
    @Body('sets') sets: string[],
    @Res() res: Response,
  ) {
    if (!sets || sets.length === 0) {
      res.status(400).send({ error: 'Sets attribute is required' });
      return;
    }

    const setList = Array.from(new Set(sets));

    const validSetCodes = await this.mtgJsonRepository.getDistinctSetCodes();
    const invalidSets = setList.filter((set) => !validSetCodes.includes(set));
    if (invalidSets.length > 0) {
      res.status(400).send({
        error: `Invalid set codes: ${invalidSets.join(', ')}`,
      });
      return;
    }
    this.setService.update(setList);

    res.status(202).send();
  }
}
