const fs = require('fs');
const ffmpeg = require('ffmpeg');

async function getFrame(buffer) {
  // Save new file
  fs.writeFileSync('video.webm', buffer);
  console.log('File saved');

  const video = await (new ffmpeg('./video.webm'));
  console.log('The video is ready to be processed');
  video.addCommand('-ss', '00:00:00');
  video.addCommand('-vframes', '1');
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

module.exports = { getFrameFromVideoBuffer: getFrame };
