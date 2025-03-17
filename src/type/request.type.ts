import { Request } from 'express';

export interface AuthRequest extends Request {
  user: AuthRequest;
  userId: string;
  gender: boolean;
}

export interface StateRequest extends Request {
  state: {
    phase: number;
    status: boolean;
    time: Date;
    start: number;
    inspect?: any;
    ip?: string;
  };
}

export type UserInfoRequest =
  | 'lifestyle'
  | 'personality'
  | 'values'
  | 'appearance'
  | 'datingstyle'
  | 'letter'
  | 'photo'
  | 'etc';

export type UserLetter = {
  index: number; // 편지 매핑 ID
  status: number; // 공개 여부
  content: string; // 편지 내용
  createdAt: Date; // 생성 일자
  updatedAt: Date; // 업데이트 일자
};
