import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTargetDto } from './dto/updateTargetDto';
import { TargetingRepository } from './targeting.repository';
import {
  TargetingFieldDto,
  targetingDefaultDto,
} from './dto/targetingFieldDto';

@Injectable()
export class TargetingService {
  constructor(private readonly targetingRepository: TargetingRepository) {}

  async patchAllTargets(userId: string, items: UpdateTargetDto) {
    try {
      let existingData =
        await this.targetingRepository.getTargetingByUserId(userId);
      if (!existingData) {
        //조회된 타겟 데이터 없을 경우 upsert하도록 repository로 넘김
        existingData = await this.targetingRepository.createAllTargets(
          userId,
          items,
        );
      }
      const defaultDto: UpdateTargetDto = targetingDefaultDto;

      const originalItems = { ...items }; // 초기 items를 저장
      // 기존 데이터와 비교하여 priority를 -1로 설정
      for (const key in defaultDto) {
        if (key === 'fillStatus') continue;
        if (key in existingData && !(key in items)) {
          // 범위형 데이터 예외 처리
          if (key === 'birthYear' || key === 'height' || key === 'salary') {
            if (existingData[key]?.from === undefined) {
              items[key] = { from: 1985, to: 2000, priority: -1 };
            } else {
              items[key] = { ...existingData[key], priority: -1 };
            }
          } else {
            if (existingData[key]?.data === undefined) {
              items[key] = { data: [], priority: -1 };
            } else {
              items[key] = { ...existingData[key], priority: -1 };
            }
          }
        }
      }
      const countPriority1 = Object.values(originalItems).filter(
        (item: TargetingFieldDto) => item.priority === 1,
      ).length;
      const countPriority2 = Object.values(originalItems).filter(
        (item: TargetingFieldDto) => item.priority === 2,
      ).length;

      const countPriority3 = Object.values(originalItems).filter(
        (item: TargetingFieldDto) => item.priority === 3,
      ).length;

      // ****************** 완벽하지 않은 경우 ******************
      // if (
      //   // 기본 반영조건 6개, fillStatus 포함하여 7개이하일 경우
      //   Object.keys(originalItems).length < 8
      // ) {
      //   // 기존 fillStatus 확인 후 0인 경우 0, 1이상인 경우 1로 저장
      //   if (existingData.fillStatus === 0) {
      //     items.fillStatus = 0;
      //   } else if (existingData.fillStatus > 0) {
      //     // TODO 0순위가 6개가 안될 경우 추가해야함.
      //     items.fillStatus = 1;
      //   }
      //   items.fillStatus = 2;
      // }
      items.fillStatus = 2;
      // ****************** 예외 ******************
      // if (
      //   // 1. 우선순위 1순위 2초과, 2순위 4초과, 3순위 4초과
      //   countPriority1 > 2 ||
      //   countPriority2 > 4 ||
      //   countPriority3 > 4
      // ) {
      //   throw new BadRequestException('우선순위는 규제에 맞도록 설정해주세요.');
      // }
      function validateDto(dto: UpdateTargetDto) {
        const mainProperties = [
          'matchingType',
          'birthYear',
          'residence',
          'interest',
          'personalityCharm',
          'externalCharm',
        ];

        for (const property in dto) {
          // **** dto에 속하지 않을 경우 이미 pipe단에서 validate 에러 ****
          // 1. 기본반영 조건은 priority가 0이 아닐 경우 에러
          if (mainProperties.includes(property)) {
            if (dto[property].priority !== 0) {
              throw new BadRequestException(
                `기본반영 조건 ${property}의 priority는 ${dto[property].priority}이므로 허용하지 않습니다.`,
              );
            }
          } else {
            // 2. 기본반영 조건이 아닌 경우 priority가 0일 경우 에러
            if (dto[property].priority === 0) {
              throw new BadRequestException(
                `추가반영 조건 ${property}의 priority는 ${dto[property].priority}이므로 허용하지 않습니다.`,
              );
            }
          }
        }
      }
      validateDto(items);
      const getUserDataTarget = await this.targetingRepository.patchAllTargets(
        userId,
        items,
      );
      return getUserDataTarget;
    } catch (err) {
      throw err;
    }
  }

  async getTargetingByUserId(userId: string) {
    try {
      const matchingData =
        await this.targetingRepository.getTargetingByUserId(userId);
      if (!matchingData) {
        throw new NotFoundException('조회된 타겟 데이터가 없습니다.');
      }
      return matchingData;
    } catch (err) {
      throw err;
    }
  }

  async getTargetingFillStatusByUserId(userId: string) {
    try {
      const targeting =
        await this.targetingRepository.getTargetingByUserId(userId);
      if (!targeting?.fillStatus && targeting?.fillStatus !== 0) {
        return 0;
      }
      return targeting.fillStatus;
    } catch (err) {
      throw err;
    }
  }
}
