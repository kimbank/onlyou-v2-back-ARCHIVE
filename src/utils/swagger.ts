import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('ONLYou Back')
    .setDescription(descripton)
    .setVersion('v2')
    // INFO: Swagger UI에서는 cookie를 지원하지 않는지만, 명시를 위해 추가
    .addSecurity('access', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access',
    })
    // INFO: Swagger UI에서는 cookie를 지원하지 않는지만, 명시를 위해 추가
    .addSecurity('refresh', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refresh',
    })
    .addServer('http://localhost:8080', '로컬 서버')
    .addServer('https://....dev', '개발 서버')
    .addServer('https://....co.kr', '운영 서버')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

const descripton = `_ONLYou에게 영혼을 넣어줄 API의 문서입니다._

#### 미션
우리는 모든 사람이 자신에게 꼭 맞는 상대와 사랑을 나눌 수 있도록 합니다.

#### 비전
IT 기술을 활용하여 누구나 저렴한 가격에 서로의 니즈를 충족시키는 상대를 찾을 수 있도록 도와주는 종합연애정보회사

#### 핵심 가치
*타겟 고객 중심*, *감정이 배제된 합리적인 판단*, *팀과 개인의 동반 성장*, *열정과 헌신*`;
