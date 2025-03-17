// import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';
import { authConfig } from 'src/config/env.config';
import { ncpConfig } from 'src/config/env.config';

const serviceId = ncpConfig().NCP_SENS_SERVICE_ID_LOGIN;
const accessKey = process.env.NCP_API_ACCESS_KEY;
const secretKey = process.env.NCP_API_SECRET_KEY;

const method = 'POST';
const uri = `/sms/v2/services/${serviceId}/messages`;
const timestamp = Date.now().toString();

function makeSignature(
  accessKey: string,
  secretKey: string,
  method: string,
  uri: string,
  timestamp: string,
) {
  const space = ' ';
  const newLine = '\n';
  const hmac = crypto.createHmac('sha256', Buffer.from(secretKey, 'utf-8'));

  hmac.update(method);
  hmac.update(space);
  hmac.update(uri);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);
  const signature = hmac.digest('base64');

  return signature;
}

const key = makeSignature(accessKey, secretKey, method, uri, timestamp);

export const ncpHeaders = {
  'x-ncp-apigw-timestamp': timestamp,
  'x-ncp-iam-access-key': accessKey,
  'x-ncp-apigw-signature-v2': key,
};

export class CryptoTest {
  encrypt(plainText: string) {
    const { key, iv } = this.getParams();
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = cipher.update(plainText, 'utf-8', 'hex');
    const rst = cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${authTag}:${encrypted}${rst}`;
  }

  decrypt(cipherText: string) {
    const { key, iv } = this.getParams();
    const [authTag, encryptedText] = cipherText.split(':');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    const decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    return decrypted + decipher.final('utf-8');
  }
  getParams() {
    const encryptKey = authConfig().ENCRYPT_KEY;
    const encryptIv = authConfig().ENCRYPT_IV;
    const key = Buffer.from(encryptKey);
    const iv = Buffer.from(encryptIv);

    return {
      key,
      iv: Buffer.from(`${iv}`, 'hex'),
    };
  }
}
