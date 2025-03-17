import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, Length, IsArray } from 'class-validator';

export class FeedbackDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  score: number;

  @ApiProperty({ example: [0, 1] })
  @IsArray()
  @IsOptional()
  option?: number[];

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsOptional()
  @Length(1, 1000)
  comment?: string;
}
