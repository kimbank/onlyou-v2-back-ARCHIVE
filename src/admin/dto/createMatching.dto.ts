import { ApiProperty } from '@nestjs/swagger';
import {
  ValidateIf,
  IsString,
  IsInt,
  IsNotEmpty,
  isDate,
  IsDateString,
} from 'class-validator';

export class CreateMatchingDto {
  @ApiProperty({ example: '23k4h32k4h23443k234hk' })
  @IsString()
  @IsNotEmpty()
  femaleId: string;

  @ApiProperty({ example: '23k4h32k4h23443k234hk' })
  @IsString()
  @IsNotEmpty()
  maleId: string;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: '2024-02-26 21:00:00' })
  @ValidateIf((o) => o.deadline instanceof Date || isDate(o.deadline))
  @IsDateString()
  @IsNotEmpty()
  deadline: Date;

  @ApiProperty({ example: 50 })
  @IsInt()
  @IsNotEmpty()
  phase: number;

  @ApiProperty({ example: 'system-0.0.0' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
