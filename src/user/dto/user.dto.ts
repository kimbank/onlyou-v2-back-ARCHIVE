import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

export class UserLifestyleDto {
  // @ApiProperty({ description: '기입 상태', example: 1 })
  // @IsInt()
  // fillStatus?: number;

  @ApiProperty({ description: '근무 형태', example: 1 })
  @IsInt()
  workType?: number;

  @ApiProperty({ description: '흡연 경력', example: 1 })
  @IsInt()
  smoking?: number;

  @ApiProperty({ description: '음주 생활', example: 1 })
  @IsInt()
  drinking?: number;

  @ApiProperty({ description: '관심사', example: [1, 2, 3] })
  @IsArray()
  interest?: number[];

  @ApiProperty({ description: '연애 횟수', example: 1 })
  @IsInt()
  numberDating?: number;

  @ApiProperty({ description: '운동 생활', example: 1 })
  @IsInt()
  athleticLife?: number;

  @ApiProperty({ description: '반려동물', example: 1 })
  @IsInt()
  petAnimal?: number;

  @ApiProperty({ description: '종교', example: 1 })
  @IsInt()
  religion?: number;
}

export class UserPersonalityDto {
  // @ApiProperty({ description: '기입 상태', example: 1 })
  // @IsInt()
  // fillStatus?: number;

  @ApiProperty({ description: '외향/내향', example: 1 })
  @IsInt()
  extrovert_introvert?: number;

  @ApiProperty({ description: '직관/현실', example: 1 })
  @IsInt()
  intuition_reality?: number;

  @ApiProperty({ description: '감정/이성', example: 1 })
  @IsInt()
  emotion_reason?: number;

  @ApiProperty({ description: '즉흥/계획', example: 1 })
  @IsInt()
  impromptu_plan?: number;

  @ApiProperty({ description: '성격 매력', example: [1, 2, 3] })
  @IsArray()
  personalityCharm: number[];
}

export class UserValuesDto {
  // @ApiProperty({ description: '기입 상태', example: 1 })
  // @IsInt()
  // fillStatus?: number;

  @ApiProperty({ description: '결혼 가치관', example: 1 })
  @IsInt()
  marriageValues?: number;

  @ApiProperty({ description: '이성 친구 가치관', example: 1 })
  @IsInt()
  oppositeSexFriendValues?: number;

  @ApiProperty({ description: '정치 성향', example: 1 })
  @IsInt()
  politicalValues?: number;

  @ApiProperty({ description: '소비 가치관', example: 1 })
  @IsInt()
  consumptionValues?: number;

  @ApiProperty({ description: '커리어와 가정 가치관', example: 1 })
  @IsInt()
  careerFamilyValues?: number;

  @ApiProperty({ description: '자녀 가치관', example: 1 })
  @IsInt()
  childrenValues?: number;
}

export class UserAppearanceDto {
  // @ApiProperty({ description: '기입 상태', example: 1 })
  // @IsInt()
  // fillStatus?: number;

  @ApiProperty({ description: '동물 이미지', example: 1 })
  @IsInt()
  animalImage?: number;

  @ApiProperty({ description: '쌍꺼풀', example: 1 })
  @IsInt()
  doubleEyelid?: number;

  @ApiProperty({ description: '체형', example: 1 })
  @IsInt()
  bodyType?: number;

  @ApiProperty({ description: '외적 매력', example: [1, 2, 3] })
  @IsArray()
  externalCharm?: number[];

  @ApiProperty({ description: '문신 유무', example: 1 })
  @IsInt()
  tattoo?: number;
}

export class UserDatingstyleDto {
  // @ApiProperty({ description: '기입 상태', example: 1 })
  // @IsInt()
  // fillStatus?: number;

  @ApiProperty({ description: '선호 데이트', example: 1 })
  @IsInt()
  preferredDate?: number;

  @ApiProperty({ description: '선호 연락 수단', example: 1 })
  @IsInt()
  preferredContactMethod?: number;

  @ApiProperty({ description: '연애 주도성', example: 1 })
  @IsInt()
  loveInitiative?: number;

  @ApiProperty({ description: '데이트 빈도', example: 1 })
  @IsInt()
  datingFrequency?: number;

  @ApiProperty({ description: '연락 스타일', example: 1 })
  @IsInt()
  contactStyle?: number;

  @ApiProperty({ description: '혼전 순결', example: 1 })
  @IsInt()
  premaritalPurity?: number;

  @ApiProperty({ description: '갈등 해결 방법', example: 1 })
  @IsInt()
  conflictResolutionMethod?: number;
}

export class UserEtcDto {
  @ApiProperty({ description: '만나기 전 정보', example: 1, required: false })
  informationBeforeMeeting?: number;

  @ApiProperty({ description: '카카오 아이디', example: 'kakao123' })
  kakaoId?: string;
}

export class UserLetterDto {
  @ApiProperty({ description: '편지 인덱스', example: 0 })
  @IsInt()
  index: number;

  @ApiProperty({ description: '공개 여부', example: 1 })
  @IsInt()
  status: number;

  @ApiProperty({ description: '편지 내용', example: '안녕하세요' })
  @IsString()
  content: string;

  @ApiProperty({ description: '생성 일자', example: '2022-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일자', example: '2022-01-01T12:00:00Z' })
  updatedAt: Date;
}

export class UserLetterListDto {
  @ApiProperty({
    description: '편지 목록',
    type: [UserLetterDto],
    required: true,
  })
  letter: UserLetterDto[];
}

export class UserPhotoDto {
  @ApiProperty({ description: '사진 ID', example: 'some_id' })
  id: string;

  @ApiProperty({
    description: '사진 URL',
    example: 'https://example.com/photo.jpg',
  })
  url: string;

  @ApiProperty({ description: '생성 일자', example: '2022-01-01T12:00:00Z' })
  createdAt: Date;
}

export class UserPhotosDto {
  @ApiProperty({ description: '기입 상태', example: 1 })
  fillStatus: number;

  @ApiProperty({ description: '포토 목록', type: [UserPhotoDto] })
  photo: UserPhotoDto[];
}

export class DynamicUserDto {
  @ApiProperty({ type: UserLifestyleDto })
  lifestyle?: UserLifestyleDto;

  @ApiProperty({ type: UserPersonalityDto })
  personality?: UserPersonalityDto;

  @ApiProperty({ type: UserValuesDto })
  values?: UserValuesDto;

  @ApiProperty({ type: UserAppearanceDto })
  appearance?: UserAppearanceDto;

  @ApiProperty({ type: UserDatingstyleDto })
  datingStyle?: UserDatingstyleDto;

  @ApiProperty({ type: UserLetterDto })
  letter?: UserLetterDto;

  @ApiProperty({ type: UserPhotosDto })
  photos?: UserPhotosDto;

  @ApiProperty({ type: UserEtcDto })
  etc?: UserEtcDto;
}
