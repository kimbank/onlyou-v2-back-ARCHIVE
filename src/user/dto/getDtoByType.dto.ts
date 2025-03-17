import { BadRequestException } from '@nestjs/common';
import { UserInfoRequest } from 'src/type/request.type';
import {
  UserAppearanceDto,
  UserDatingstyleDto,
  UserEtcDto,
  UserLetterDto,
  UserLetterListDto,
  UserLifestyleDto,
  UserPersonalityDto,
  UserPhotosDto,
  UserValuesDto,
} from './user.dto';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

type UserDto =
  | UserLifestyleDto
  | UserPersonalityDto
  | UserValuesDto
  | UserAppearanceDto
  | UserDatingstyleDto
  | UserLetterDto
  | UserLetterListDto
  | UserPhotosDto
  | UserEtcDto;

export async function getDtoByType(
  type: UserInfoRequest,
  dto:
    | UserLifestyleDto
    | UserPersonalityDto
    | UserValuesDto
    | UserAppearanceDto
    | UserDatingstyleDto
    | UserLetterDto
    | UserLetterListDto
    | UserPhotosDto
    | UserEtcDto,
) {
  const checkValidation = async (
    originDto: ClassConstructor<UserDto>,
    dto: UserDto,
  ) => {
    const dtoClass = plainToClass(originDto, dto);
    const errors = await validate(dtoClass);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  };

  try {
    switch (type) {
      case 'lifestyle':
        await checkValidation(UserLifestyleDto, dto);
        return dto;
      case 'personality':
        await checkValidation(UserPersonalityDto, dto);
        return dto;
      case 'values':
        await checkValidation(UserValuesDto, dto);
        return dto;
      case 'appearance':
        await checkValidation(UserAppearanceDto, dto);
        return dto;
      case 'datingstyle':
        await checkValidation(UserDatingstyleDto, dto);
        return dto;
      case 'letter':
        for (const letter of dto as UserLetterListDto['letter']) {
          await checkValidation(UserLetterDto, letter);
        }
        await checkValidation(UserLetterListDto, dto);
        return dto;
      case 'photo':
        await checkValidation(UserPhotosDto, dto);
        return dto;
      case 'etc':
        await checkValidation(UserEtcDto, dto);
        return dto;
      default:
        throw new ValidationError();
    }
  } catch (err) {
    throw new BadRequestException(
      '지원하지 않는 타입이거나 DTO 형식이 일치하지 않습니다.',
    );
  }
}
