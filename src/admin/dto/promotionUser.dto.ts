import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class PromotionUserDto {
  @ApiProperty({ example: '65aff7bda2883708073fa6f1' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  residence: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  jobType: number;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  jobName: string;

  @ApiProperty({ example: 'IT' })
  @IsString()
  @IsNotEmpty()
  jobGroup: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  salary: number;

  @ApiProperty({ example: 180 })
  @IsInt()
  height: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  university: number;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  universityName: string;

  @ApiProperty({ example: 0 })
  education: number;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  divorce: boolean;
}
