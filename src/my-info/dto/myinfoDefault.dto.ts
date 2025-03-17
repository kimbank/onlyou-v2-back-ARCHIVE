import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class MyinfoDefaultDto {
  @ApiProperty({ example: 7 })
  @IsInt()
  residence: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  salary: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  visibilityUniversityName?: number[];

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  visibilityJobName?: number[];
}
