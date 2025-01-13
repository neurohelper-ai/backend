import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { CreateScenarioDto } from './dto/create-scenario.dto';
import { ScenarioService } from './scenario.service';

@Controller('scenario')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Post()
  create(@Body() createScenarioDto: CreateScenarioDto, @Req() req) {
    console.log(req.user);
    return this.scenarioService.create(createScenarioDto);
  }

  //для работы с параметрами и категориями
  @Get()
  async findAll(@Query('categoryId') categoryId?: string) {
    return this.scenarioService.findAll(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scenarioService.findOne(id);
  }
}
