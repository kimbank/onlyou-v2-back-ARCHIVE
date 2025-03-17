import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UserSendCodeDto {
  @ApiProperty({ example: '01012121212' })
  @IsString()
  @Matches(/^010[0-9]{8}$/)
  mobileNumber: string;

  @ApiProperty({ example: '000000' })
  @IsString()
  @Matches(/^\d{6}$/)
  code: string;
}

export class UserVerifyCodeDto {
  @ApiProperty({ example: '01012121212' })
  @IsString()
  @Matches(/^010[0-9]{8}$/)
  mobileNumber: string;

  @ApiProperty({ example: '121212' })
  @IsString()
  @Matches(/^\d{6}$/)
  code: string;
}
