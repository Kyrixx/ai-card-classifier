import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProcessorService } from '../services/processor.service';

@Component({
  selector: 'app-root',
  providers: [ProcessorService],
  template: `
    <video id="feedback" [srcObject]="stream" autoplay></video>
  `,
  standalone: true,
})
export class FeedbackComponent implements OnInit {
  stream: MediaStream | null = null;
  imgUrl: string | null = null;
  price: string = "N/A";

  constructor(private readonly processorService: ProcessorService) {
  }

  async ngOnInit() {
    this.stream = await ProcessorService.triggerVideo();
  }

  async onClick() {
    let message = await this.processorService.triggerRecognition();
    this.imgUrl = message.imageUrl;
    this.price = message.price;
    console.log(message);
  }
}
