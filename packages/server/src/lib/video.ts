import fs from 'fs';
import ffmpeg from 'ffmpeg';

export async function getFrameFromVideoBuffer(buffer: Buffer): Promise<string> {
  // Save new file
  fs.writeFileSync('video.webm', buffer);
  console.log('File saved');

  const video = await (new ffmpeg('./video.webm'));
  video.addCommand('-ss', '00:00:00');
  video.addCommand('-vframes', '1');
  console.log('The video is ready to be processed');

  return new Promise((resolve, reject) => {
    video.save(`assets/frame-${Date.now()}.jpg`, (error, file) => {
      if (error) {
        console.log('Error:', error);
        reject(error);
      }
      fs.rmSync('./video.webm', { force: true });
      console.log('File:', file);
      resolve(file);
    });
  });
}
