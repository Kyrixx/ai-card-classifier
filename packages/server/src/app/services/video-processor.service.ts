import { Injectable, Logger } from '@nestjs/common';
import * as ffmpeg from 'ffmpeg';
import * as fs from 'fs';

@Injectable()
export class VideoProcessorService {
  private readonly logger = new Logger(VideoProcessorService.name);

  async saveVideoAndGetFrame(buffer: Buffer): Promise<string> {
    fs.writeFileSync('video.webm', buffer);
    return await this.getFrameFromBuffer('video.webm');
  }

  async getFrameFromBuffer(filename: string): Promise<string> {
    const video = await new ffmpeg(filename);
    video.addCommand('-ss', '00:00:00');
    video.addCommand('-vframes', '1');
    console.log('[video] The video is ready to be processed');

    return new Promise((resolve, reject) => {
      video.save(`assets/frame-${Date.now()}.jpg`, (error, file) => {
        if (error) {
          this.logger.error('[video] Error:', error);
          reject(error);
          return;
        }
        fs.rmSync(filename, { force: true });
        this.logger.verbose('[video] File:', file);
        resolve(file);
      });
    });
  }
}
