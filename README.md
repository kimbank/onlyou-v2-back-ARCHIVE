# onlyou v2 back

## 개발 환경

### NestJS 구동

- [pakage.json](/package.json) 의 dependency를 사용 중
- [pakage.json](/package.json) 의 "scripts"의 `start:dev`로 로컬 개발환경에서 구동

0. (required) 환경변수 파일(`.env`) 설정

   ```plaintext
   전달 받아야함
   ```

1. (required) dependency 설치

   ```bash
   npm install
   ```

2. NestJS 개발 환경으로 구동

   ```bash
   npm run start:dev
   ```

3. Swagger 확인
   - http://127.0.0.1:8080/docs
     - .env.development
   - https://...
     - .env.production


### 서버 구조

...


- `.env` 파일과 `ecosystem.json` 간에 꼬이지 않도록 유의해야함
- 항상 Event들에 대해서 Listen 해야함
  - Cloudflare TLS 암호키 만료
  - Github Classical Token 만료
  - Domain 만료


### Nginx Package Manager와 Cloudflare

- Cloudflare를 사용 중에 있음
  - ... (prod)
  - ... (dev)
- Nginx 로 TLS 설정하여 사용 중
  - https://... 에서 설정 변경 가능



<br/><br/><br/><br/>

## 배포

### `production`용 배포 방법

___master 브랜치에 push시 아무 일도 일어나지 않으므로 수동으로 배포해야함___

1. Cockpit 접속

   1-1. https:// 접속 후 로그인
   
   ```plaintext
   ID: ...
   PW: ...
   ```
   
   1-2. 터미널(Terminal)에서 경로로 이동 이동
   
   ```bash
   cd onlyou-v2-back/
   ```

2. Git pull 당겨서 코드 최신화 만들기
   
   ```bash
   git pull
   ```

4. 빌드하기

   ```bash
   npm run build
   ```

5. PM2 재시작
   
   ```bash
   pm2 restart back
   ```

6. 배포 확인

   production 배포는 swagger를 확인할 수 없음

   직접적으로 https://... 로 접속해 봐야함
   _헬스체크 API 가 없으므로 필요시 구현_



### `develop`용 배포 방법 (수동)

_develop 브랜치에 push시 Jenkins가 자동으로 배포 후 디스코드로 결과 전송_<br/>
_따라서, 수동으로 배포 하는 방법을 소개_

1. Cockpit 접속

   1-1. https://... 접속 후 로그인
   
   ```plaintext
   ID: ...
   PW: ...
   ```
   
   1-2. 터미널(Terminal)에서 경로로 이동 이동
   
   ```bash
   cd develop/onlyou-v2-back/
   ```

2. Git pull 당겨서 코드 최신화 만들기
   
   ```bash
   git pull
   ```

4. 빌드하기

   ```bash
   npm run build
   ```

5. PM2 재시작
   
   ```bash
   pm2 restart dev-back
   ```

6. 배포 확인

   https://

   ```plaintext
   ID: test
   PW: ...
   ```
