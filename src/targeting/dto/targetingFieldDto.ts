import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class TargetingFieldDto {
  @ApiProperty({
    description: '데이터 배열',
    example: [1, 2, 3],
  })
  @IsArray()
  data?: number[];

  @IsInt()
  from?: number;

  @IsInt()
  to?: number;

  @ApiProperty({
    description: '우선순위',
    example: 1,
  })
  @IsInt()
  priority: number;
}

export const targetingDefaultDto = {
  fillStatus: 1,
  matchingType: { data: [1], priority: 0 },
  birthYear: { from: null, to: null, priority: 0 }, // 기본 반영 조건
  residence: { data: [1, 2, 3], priority: 0 }, // 기본 반영 조건
  jobType: { data: [1, 2, 3], priority: -1 },
  salary: { from: null, to: null, priority: -1 },
  height: { from: 170, to: 180, priority: -1 },
  university: { data: [1, 2, 3], priority: -1 },
  divorce: { data: [1, 2, 3], priority: -1 },
  workType: { data: [1, 2, 3], priority: -1 },
  smoking: { data: [1, 2, 3], priority: -1 },
  drinking: { data: [1, 2, 3], priority: -1 },
  interest: { data: [1, 2, 3], priority: 0 }, // 기본 반영 조건
  numberDating: { data: [1, 2, 3], priority: -1 },
  athleticLife: { data: [1, 2, 3], priority: -1 },
  petAnimal: { data: [1], priority: -1 },
  religion: { data: [1, 2, 3], priority: -1 },
  extrovert_introvert: { data: [1, 2, 3], priority: -1 },
  intuition_reality: { data: [1, 2, 3], priority: -1 },
  emotion_reason: { data: [1, 2, 3], priority: -1 },
  impromptu_plan: { data: [1, 2, 3], priority: -1 },
  personalityCharm: { data: [1, 2, 3], priority: 0 }, // 기본 반영 조건
  marriageValues: { data: [1, 2, 3], priority: -1 },
  oppositeSexFriendValues: { data: [1, 2, 3], priority: -1 },
  politicalValues: { data: [1, 2, 3], priority: -1 },
  consumptionValues: { data: [1, 2, 3], priority: -1 },
  careerFamilyValues: { data: [1, 2, 3], priority: -1 },
  childrenValues: { data: [1, 2, 3], priority: -1 },
  animalImage: { data: [1, 2, 3], priority: -1 },
  doubleEyelid: { data: [1, 2, 3], priority: -1 },
  bodyType: { data: [1, 2, 3], priority: -1 },
  externalCharm: { data: [1, 2, 3], priority: 0 }, // 기본 반영 조건
  tattoo: { data: [1, 2, 3], priority: -1 },
  preferredDate: { data: [1, 2, 3], priority: -1 },
  preferredContactMethod: { data: [1, 2, 3], priority: -1 },
  loveInitiative: { data: [1, 2, 3], priority: -1 },
  datingFrequency: { data: [1, 2, 3], priority: -1 },
  contactStyle: { data: [1, 2, 3], priority: -1 },
  premaritalPurity: { data: [1, 2, 3], priority: -1 },
  conflictResolutionMethod: { data: [1, 2, 3], priority: -1 },
};
