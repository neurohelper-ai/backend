import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { ScenarioService } from './scenario.service';

@Controller('scenario')
export class ScenarioController {
    constructor(private readonly scenarioService: ScenarioService) {}

  @Post()
  create(@Body() createScenarioDto: CreateScenarioDto) {
    return this.scenarioService.create(createScenarioDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scenarioService.findOne(id);
  }

}
