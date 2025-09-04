import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';
import { Response } from '../common/utils/response.util';
import { DefaultMessages } from '../common/constants/message.constants';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async checkHealth() {
    const status = await this.healthService.getHealthStatus();
    return Response.success(DefaultMessages.COMMON.OK, status);
  }
}
