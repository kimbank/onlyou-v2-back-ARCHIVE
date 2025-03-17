// import { IsArray, IsInt, IsOptional } from 'class-validator';
import { TargetingFieldDto } from './targetingFieldDto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTargetDto {
  // 가입
  @ApiProperty({
    description: '입력 상태',
  })
  fillStatus?: number;
  @ApiProperty({
    description: '매칭 유형',
  })
  matchingType?: TargetingFieldDto;
  // 가입
  @ApiProperty({
    description: '생년월일 정보',
  })
  birthYear?: TargetingFieldDto;

  @ApiProperty({
    description: '거주지 정보',
  })
  residence?: TargetingFieldDto;

  // 심사
  @ApiProperty({
    description: '직업 정보',
  })
  jobType?: TargetingFieldDto;

  @ApiProperty({
    description: '연봉 정보',
  })
  salary?: TargetingFieldDto;

  @ApiProperty({
    description: '키 정보',
  })
  height?: TargetingFieldDto;

  @ApiProperty({
    description: '대학 정보',
  })
  university?: TargetingFieldDto;

  @ApiProperty({
    description: '이혼 여부 정보',
  })
  divorce?: TargetingFieldDto;

  // 생활
  @ApiProperty({
    description: '직업 유형 정보',
  })
  workType?: TargetingFieldDto;

  @ApiProperty({
    description: '흡연 여부 정보',
  })
  smoking?: TargetingFieldDto;

  @ApiProperty({
    description: '음주 여부 정보',
  })
  drinking?: TargetingFieldDto;

  @ApiProperty({
    description: '관심사 정보',
  })
  interest?: TargetingFieldDto;

  @ApiProperty({
    description: '인연 횟수 정보',
  })
  numberDating?: TargetingFieldDto;

  @ApiProperty({
    description: '운동 생활 정보',
  })
  athleticLife?: TargetingFieldDto;

  @ApiProperty({
    description: '반려동물 정보',
  })
  petAnimal?: TargetingFieldDto;

  @ApiProperty({
    description: '종교 정보',
  })
  religion?: TargetingFieldDto;

  // 성격
  @ApiProperty({
    description: '외향성/내향성 정보',
  })
  extrovert_introvert?: TargetingFieldDto;

  @ApiProperty({
    description: '직관성/현실성 정보',
  })
  intuition_reality?: TargetingFieldDto;

  @ApiProperty({
    description: '감정/이성 정보',
  })
  emotion_reason?: TargetingFieldDto;

  @ApiProperty({
    description: '즉흥/계획 정보',
  })
  impromptu_plan?: TargetingFieldDto;

  @ApiProperty({
    description: '성격 매력 정보',
  })
  personalityCharm?: TargetingFieldDto;

  // 가치관
  @ApiProperty({
    description: '결혼 가치관 정보',
  })
  marriageValues?: TargetingFieldDto;

  @ApiProperty({
    description: '이성 친구 가치관 정보',
  })
  oppositeSexFriendValues?: TargetingFieldDto;

  @ApiProperty({
    description: '정치 가치관 정보',
  })
  politicalValues?: TargetingFieldDto;

  @ApiProperty({
    description: '소비 가치관 정보',
  })
  consumptionValues?: TargetingFieldDto;

  @ApiProperty({
    description: '경력/가족 가치관 정보',
  })
  careerFamilyValues?: TargetingFieldDto;

  @ApiProperty({
    description: '자녀 가치관 정보',
  })
  childrenValues?: TargetingFieldDto;

  // 외모
  @ApiProperty({
    description: '동물상 정보',
  })
  animalImage?: TargetingFieldDto;

  @ApiProperty({
    description: '쌍꺼풀 정보',
  })
  doubleEyelid?: TargetingFieldDto;

  @ApiProperty({
    description: '체형 정보',
  })
  bodyType?: TargetingFieldDto;

  @ApiProperty({
    description: '외모 매력 정보',
  })
  externalCharm?: TargetingFieldDto;

  @ApiProperty({
    description: '타투 정보',
  })
  tattoo?: TargetingFieldDto;

  // 연애스타일
  @ApiProperty({
    description: '선호하는 데이트 정보',
  })
  preferredDate?: TargetingFieldDto;

  @ApiProperty({
    description: '선호하는 연락 방법 정보',
  })
  preferredContactMethod?: TargetingFieldDto;

  @ApiProperty({
    description: '연애 주도 여부 정보',
  })
  loveInitiative?: TargetingFieldDto;

  @ApiProperty({
    description: '데이트 빈도 정보',
  })
  datingFrequency?: TargetingFieldDto;

  @ApiProperty({
    description: '연락 스타일 정보',
  })
  contactStyle?: TargetingFieldDto;

  @ApiProperty({
    description: '혼전 순결 정보',
  })
  premaritalPurity?: TargetingFieldDto;

  @ApiProperty({
    description: '갈등 해결 방법 정보',
  })
  conflictResolutionMethod?: TargetingFieldDto;
}
