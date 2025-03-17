import { ncpConfig } from 'src/config/env.config';
import axios from 'axios';
import * as crypto from 'crypto';

export async function sendLMS(mobileNumber: string, msg: string) {
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
    subject: 'ONLYou',
    content: 'LMS',
    messages: [
      {
        to: mobileNumber,
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

export async function sendSMS(mobileNumber: string, msg: string) {
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
    subject: 'ONLYou',
    content: 'SMS',
    messages: [
      {
        to: mobileNumber,
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
