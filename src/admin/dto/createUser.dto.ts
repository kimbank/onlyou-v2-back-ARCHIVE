import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsInt, IsNotEmpty } from 'class-validator';
import { UserPhotoDto, UserPhotosDto } from 'src/user/dto/user.dto';

export class CreateUserDto {
  @ApiProperty({ example: '유저이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '01012121212' })
  @IsString()
  @Matches(/^010[0-9]{8}$/)
  mobileNumber: string;

  @ApiProperty({ example: true })
  gender: boolean;

  @ApiProperty({ example: 'Nickname123' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ example: 1990 })
  @IsInt()
  birthYear: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  residence: number;

  @ApiProperty({ example: 'frip' })
  @IsString()
  integration: string;

  @ApiProperty({ example: '개발자' })
  @IsString()
  tmpJob: string;

  // @ApiProperty({ example: 'base64encodedImage' })
  // @IsNotEmpty()
  // photos: UserPhotosDto;
}
