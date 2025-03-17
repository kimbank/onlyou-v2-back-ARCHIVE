import { ncpConfig } from 'src/config/env.config';
import axios from 'axios';
import * as crypto from 'crypto';

const msg = `축하드립니다! 매칭이 성사되셨습니다.
아래 운영 사이트에서 인연의 연락처를 확인하고, 인사를 건네보아요!

[운영 사이트]
https://onlyou.co.kr

[휴면 안내]
한 번에 한 사람에게만 집중하는 소개팅을 위해, 성사되신 분들은 휴면 처리해드리고 있어요. 저희 사이트 내 "성사탭"에서 만남 종료를 알려주시면, 다시 매칭을 재개해드립니다.

[매칭이 성사된 이후에는?]
https://coconut-belt-9f8.notion.site/720504d84adc476289049d807bf3a554

[ONLYou 매너 정책]
https://coconut-belt-9f8.notion.site/43b234f1b1f347feb407a21d313f6e3b?pvs=4

위 매너 정책에 위반하는 행위 적발 시, 사실 관계 확인 후 재매칭이 어려우실 수 있습니다.

좋은 인연 이어가시길 진심으로 응원할게요!

[ONLYou 가이드]
https://litt.ly/onlyourlove`;

export function generateVerificationCode() {
  while (true) {
    // 6자리 숫자 랜덤 생성
    const num = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');

    // 같은 숫자가 3번 이상 연속되는지 확인
    if (
      ![0, 1, 2, 3].some((i) => num[i] === num[i + 1] && num[i] === num[i + 2])
    ) {
      return num;
    }
  }
}

export async function sendAuthCode(mobileNumber: string, authCode: string) {
  const url = ncpConfig().NCP_SENS_URL_LOGIN;
  const serviceId = ncpConfig().NCP_SENS_SERVICE_ID_LOGIN;
  const accessKey = ncpConfig().NCP_API_ACCESS_KEY;
  const secretKey = ncpConfig().NCP_API_SECRET_KEY;

  const method = 'POST';
  const uri = `/sms/v2/services/${serviceId}/messages`;
  const timestamp = Date.now().toString();
  const body = {
    type: 'SMS',
    contentType: 'COMM',
    countryCode: '82',
    from: ncpConfig().NCP_SENS_MOBILE_NUMBER,
    subject: '인증번호 발송 제목',
    content: '인증번호 발송 컨텐츠',
    messages: [
      {
        to: mobileNumber,
        subject: '인증번호 발송',
        content: `[ONLYou] 본인확인 인증번호(${authCode})를 입력해 주세요.`,
      },
    ],
  };
  const key = makeSignature(accessKey, secretKey, method, uri, timestamp);
  const headers = {
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-iam-access-key': accessKey,
    'x-ncp-apigw-signature-v2': key,
  };

  const response = await axios
    .post(url, body, { headers })
    .then((res) => res)
    .catch((err) => err.response);
  return response;
}

export async function sendSensSms(female: string, male: string) {
  const url = ncpConfig().NCP_SENS_URL_LOGIN;
  const serviceId = ncpConfig().NCP_SENS_SERVICE_ID_LOGIN;
  const accessKey = ncpConfig().NCP_API_ACCESS_KEY;
  const secretKey = ncpConfig().NCP_API_SECRET_KEY;

  const method = 'POST';
  const uri = `/sms/v2/services/${serviceId}/messages`;
  const timestamp = Date.now().toString();

  const body = {
    type: 'LMS',
    contentType: 'COMM',
    countryCode: '82',
    from: ncpConfig().NCP_SENS_MOBILE_NUMBER,
    subject: '성사 안내',
    content: '성사 안내 컨텐츠',
    messages: [
      {
        to: female,
        subject: '[ONLYou]',
        content: msg,
      },
      {
        to: male,
        subject: '[ONLYou]',
        content: msg,
      },
    ],
  };
  const key = makeSignature(accessKey, secretKey, method, uri, timestamp);
  const headers = {
    'x-ncp-apigw-timestamp': timestamp,
    'x-ncp-iam-access-key': accessKey,
    'x-ncp-apigw-signature-v2': key,
  };

  const response = await axios
    .post(url, body, { headers })
    .then((res) => res)
    .catch((err) => err.response);
  return response;
}

export function makeSignature(
  accessKey: string,
  secretKey: string,
  method: string,
  uri: string,
  timestamp: string,
): string {
  const space = ' ';
  const newLine = '\n';
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(uri);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);
  const signature = hmac.digest('base64').toString();
  return signature;
}
