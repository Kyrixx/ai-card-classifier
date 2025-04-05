import fs from 'fs';
import ffmpeg from 'ffmpeg';

export async function saveVideoAndGetFrame(buffer: Buffer): Promise<string> {
  fs.writeFileSync('video.webm', buffer);
  return await getFrameFromVideoBuffer('video.webm');
}

export async function getFrameFromVideoBuffer(filename: string): Promise<string> {
  console.log('[video] File saved');

  const video = await (new ffmpeg(filename));
  video.addCommand('-ss', '00:00:00');
  video.addCommand('-vframes', '1');
  console.log('[video] The video is ready to be processed');

  return new Promise((resolve, reject) => {
    video.save(`assets/frame-${Date.now()}.jpg`, (error, file) => {
      if (error) {
        console.log('[video] Error:', error);
        reject(error);
        return;
      }
      fs.rmSync(filename, { force: true });
      console.log('[video] File:', file);
      resolve(file);
    });
  });
}
