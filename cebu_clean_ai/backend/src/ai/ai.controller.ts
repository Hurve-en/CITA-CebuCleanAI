import { Body, Controller, Post } from '@nestjs/common';

type ClassificationRequest = { base64Image: string };
type ClassificationResponse = { label: string; confidence: number };

@Controller('ai')
export class AiController {
  @Post('classify')
  classify(@Body() body: ClassificationRequest): ClassificationResponse {
    // Placeholder: wire to TF Lite / SageMaker endpoint later.
    const fallback = ['plastic', 'paper', 'metal', 'organic'];
    const label = fallback[Math.floor(Math.random() * fallback.length)];
    return { label, confidence: 0.62 };
  }
}
