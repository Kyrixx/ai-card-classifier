import fs from 'fs';
import ffmpeg from 'ffmpeg';

export async function getFrameFromVideoBuffer(buffer: Buffer): Promise<string> {
  // Save new file
  console.log(buffer);
  fs.writeFileSync('video.webm', buffer);
  console.log('[video] File saved');

  const video = await (new ffmpeg('./video.webm'));
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
      fs.rmSync('./video.webm', { force: true });
      console.log('[video] File:', file);
      resolve(file);
    });
  });
}
