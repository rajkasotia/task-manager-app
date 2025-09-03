import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  checkHealth() {
    return this.healthService.getHealthStatus();
  }
}
