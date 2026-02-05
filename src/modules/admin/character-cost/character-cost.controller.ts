import { Controller } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("/admin/character-cost")
@ApiBearerAuth()
export class CharacterCostController {}
