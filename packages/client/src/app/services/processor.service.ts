import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ApiService } from './api.service';

type MediaRecorderOrNull = MediaRecorder | null;

@Injectable({ providedIn: 'root' })
export class ProcessorService {
  static mediaRecorder: MediaRecorderOrNull = null;

  constructor(private readonly apiWebservice: ApiService) {}

  static async triggerVideo(): Promise<MediaStream> {
    if (!ProcessorService.mediaRecorder) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } } });
      ProcessorService.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm', videoBitsPerSecond: 8192000 });
    }

    return ProcessorService.mediaRecorder.stream
  }

  async getVideoBuffer(mediaRecorder: MediaRecorderOrNull): Promise<Blob> {
    if (!mediaRecorder) {
      throw new Error('MediaRecorder is not initialized');
    }
    return new Promise((resolve) => {
      mediaRecorder.start(300);
      mediaRecorder.ondataavailable = (event) => {
        mediaRecorder.stop();
        resolve(event.data);
      };
    });
  }

  async triggerRecognition(currentSession: {sessionId: string, boosterId: number, date: number}): Promise<any> {
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
      const body = await getRequestBody();
      return await lastValueFrom(this.apiWebservice.triggerDetection(body, currentSession));
    } catch (e: any) {
      throw new Error(JSON.stringify(e));
    }
  }
}
