import { IsInt, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePromotionDto {
  @IsOptional()
  @IsInt()
  @ApiProperty({ description: '직장 유형', required: false })
  jobType?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '직장명', required: false })
  jobName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '직업', required: false })
  jobGroup?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: '연봉', required: false })
  salary?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: '키', required: false })
  height?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: '대학', required: false })
  university?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: '최종 학력', required: false })
  education?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '대학명', required: false })
  universityName?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: '돌싱 여부', required: false })
  divorce?: boolean;
}
