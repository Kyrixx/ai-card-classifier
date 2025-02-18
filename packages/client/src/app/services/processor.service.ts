import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

type MediaRecorderOrNull = MediaRecorder | null;

@Injectable({ providedIn: 'root' })
export class ProcessorService {
  static mediaRecorder: MediaRecorderOrNull = null;

  constructor(private readonly http: HttpClient) {}

  static async triggerVideo(): Promise<MediaStream> {
    if (!ProcessorService.mediaRecorder) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      ProcessorService.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    }

    return ProcessorService.mediaRecorder.stream
  }

  async getVideoBuffer(mediaRecorder: MediaRecorderOrNull): Promise<Blob> {
    if (!mediaRecorder) {
      throw new Error('MediaRecorder is not initialized');
    }
    return new Promise((resolve) => {
      mediaRecorder.start(200);
      mediaRecorder.ondataavailable = (event) => {
        mediaRecorder.stop();
        resolve(event.data);
      };
    });
  }

  async triggerRecognition(): Promise<any> {
    const getRequestBody = async(): Promise<FormData> => {
      let formData = new FormData();
      formData.append(
        'file',
        new Blob([await this.getVideoBuffer(ProcessorService.mediaRecorder)], { type: 'video/webm' }),
        'video.webm'
      );
      return formData;
    }

    try {
      return await lastValueFrom(
        this.http.post(
          'http://localhost:3100/record',
          await getRequestBody(),
          { responseType: 'json' }
        )
      );
    } catch (e: any) {
      throw new Error(JSON.stringify(e));
    }
  }
}
