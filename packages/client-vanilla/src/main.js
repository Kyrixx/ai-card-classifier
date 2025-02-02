let mediaRecorder;
let loading = false;

const feedback = document.getElementById('feedback');
navigator.mediaDevices.getUserMedia({ video: true }).then(_stream => {
  if(feedback) {
    feedback.srcObject = _stream;
  }
  mediaRecorder = new MediaRecorder(_stream, { mimeType: 'video/webm' });
});

async function getVideoBuffer() {
  return new Promise((resolve) => {
    mediaRecorder.start(200);
    mediaRecorder.ondataavailable = (event) => {
      mediaRecorder.stop();
      resolve(event.data);
    };
  });
}

async function triggerRecognition() {
  function deleteCurrentImageFromDOM() {
    const oldImage = document.getElementById('card');
    if(oldImage) {
      oldImage.remove();
    }
  }

  async function getRequestBody() {
    let formData = new FormData();
    formData.append(
      'file',
      new Blob([await getVideoBuffer()], { type: 'video/webm' }),
      'video.webm'
    );
    return formData;
  }

  function addImageToDOM(imgUrl) {
    const newImage = document.createElement('img');
    newImage.id = 'card';
    newImage.src = imgUrl;
    newImage.alt = 'Example Image';
    newImage.width = 488;
    newImage.height = 680;
    document.body.appendChild(newImage);
  }

  deleteCurrentImageFromDOM();
  loading = true;
  const imgUrl = await fetch(
    'http://localhost:3100/record',
    { method: 'POST', body: await getRequestBody() }
  ).then((response) => response.text());
  loading = false;
  addImageToDOM(imgUrl);
}
