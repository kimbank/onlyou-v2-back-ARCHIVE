import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { targetingDefaultDto } from './dto/targetingFieldDto';

@Injectable()
export class TargetingValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const allowedProperties = Object.keys(targetingDefaultDto);

    for (const key in value) {
      if (!allowedProperties.includes(key)) {
        throw new BadRequestException(`${key}는 허용되지 않은 프로퍼티입니다.`);
      }
    }

    return value;
  }
}
