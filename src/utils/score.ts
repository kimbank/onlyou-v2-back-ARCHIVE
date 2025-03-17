// import { ScoreFToMDto, ScoreMToFDto } from 'src/application/dto/scoreRecordDto';

// interface Data {
//   [key: string]: any;
// }

// interface TargetData {
//   u: Record<string, any>;
//   ud: Record<string, any>;
//   ue: Record<string, any>;
// }

// interface ScoreRecord {
//   femaleId?: string;
//   maleId?: string;
//   scoreSum?: number;
//   scoreMax?: number;
// }

// interface ScoreDto {
//   new (record: ScoreRecord): any;
// }

// export function getScore(
//   data: Data,
//   targetData: TargetData,
//   scoreRecord: ScoreRecord,
// ): number {
//   const PENALTY = -60;
//   const BASIC_HATES = ['residence'];
//   const PROMOTION_HATES = ['education', 'job_type'];
//   const EXTRA_SINGLES = [
//     'athletic_life',
//     'consumption_values',
//     'preffered_dating',
//     'preferred_contact_method',
//     'contact_style',
//     'skinship',
//     'sns',
//     'conflict_resolution_method',
//   ]; // Extra에서 단일 선택 정보
//   const EXTRA_HATES = ['smoking_history', 'religion', 'pet_animal']; // Extra에서 꺼리는 선지 정보
//   const targetStandard: Data = {};
//   let score = 0;
//   scoreRecord['score_max'] = 0;

//   // 사용자의 이상형 기준 추출
//   for (const [key, value] of Object.entries(data)) {
//     const baseKey = key.slice(0, -2);
//     // 가중치가 존재하면
//     if (key.endsWith('_w') && value !== null) {
//       scoreRecord['score_max'] += value;
//       // 관련 정보 모두 저장(_s, _e 등등 )
//       for (const relatedData in data) {
//         if (relatedData.startsWith(baseKey)) {
//           targetStandard[relatedData] = data[relatedData];
//         }
//       }
//     }
//   }

//   const importantStandard = Object.fromEntries(
//     Object.entries(targetStandard).filter(
//       ([key, value]) => key.endsWith('_w') && value === 5,
//     ),
//   );

//   if (Object.keys(targetStandard).length === 0) {
//     console.log(`기준이 없는 사용자: ${Object.entries(data)}`);
//   }

//   // 무조건 반영 부합 안 할시 -60점 처리, 성별은 이미 필터링 되어 있기 때문에 생략-
//   for (const [key, value] of Object.entries(targetData.u)) {
//     if (value === null) {
//       continue;
//     }

//     if (key === 'date_birth' && targetStandard[`${key}_w`]) {
//       if (
//         targetStandard[`${key}_s`] <=
//         value.getFullYear() <=
//         targetStandard[`${key}_e`]
//       ) {
//         score += targetStandard[`${key}_w`];
//         scoreRecord[key] = targetStandard[`${key}_w`];
//       } else if (importantStandard[`${key}_w`]) {
//         score += PENALTY;
//         scoreRecord[key] = PENALTY;
//       }
//       continue;
//     }

//     if (key === 'residence' && targetStandard[key]) {
//       if (targetStandard[key].split(',').includes(String(value))) {
//         if (importantStandard[`${key}_w`]) {
//           score += PENALTY;
//           scoreRecord[key] = PENALTY;
//         } else {
//           scoreRecord[key] = 0;
//         }
//       } else {
//         score += targetStandard[`${key}_w`];
//         scoreRecord[key] = targetStandard[`${key}_w`];
//       }
//       continue;
//     }
//   }

//   //

//   for (const [key, value] of Object.entries(targetData.ud)) {
//     if (value === null) {
//       continue;
//     }

//     // 꺼리는 정보
//     if (key === 'height' && targetStandard[`${key}_w`]) {
//       if (
//         (targetStandard[`${key}_s`] <= value &&
//           value <= targetStandard[`${key}_e`]) ||
//         value >= 185
//       ) {
//         score += targetStandard[`${key}_w`];
//         scoreRecord[key] = targetStandard[`${key}_w`];
//       } else if (importantStandard[`${key}_w`]) {
//         score += PENALTY;
//         scoreRecord[key] = PENALTY;
//       } else {
//         scoreRecord[key] = 0;
//       }
//       continue;
//     }

//     if (key === 'divorce' && targetStandard[key]) {
//       if (targetStandard[key] === value) {
//         score += targetStandard[`${key}_w`];
//         scoreRecord[key] = targetStandard[`${key}_w`];
//       } else if (importantStandard[`${key}_w`]) {
//         score += PENALTY;
//         scoreRecord[key] = PENALTY;
//       } else {
//         scoreRecord[key] = 0;
//       }
//       continue;
//     }
//   }

//   // 부가 정보
//   for (const [key, value] of Object.entries(targetData.ue)) {
//     if (value === null) {
//       continue;
//     }

//     // 꺼리는 정보
//     if (key in targetStandard.EXTRA_HATES && key in targetStandard) {
//       if (targetStandard[key].split(',').includes(String(value))) {
//         if (`${key}_w` in importantStandard) {
//           score += PENALTY;
//           scoreRecord[key] = PENALTY;
//         } else {
//           scoreRecord[key] = 0;
//         }
//       } else {
//         score += targetStandard[`${key}_w`];
//         scoreRecord[key] = targetStandard[`${key}_w`];
//       }
//       continue;
//     }

//     // 단일 선택 정보
//     if (key in targetStandard.EXTRA_SINGLES && key in targetStandard) {
//       if (targetStandard[key] === value) {
//         score += targetStandard[`${key}_w`];
//         scoreRecord[key] = targetStandard[`${key}_w`];
//       } else if (`${key}_w` in importantStandard) {
//         score += PENALTY;
//         scoreRecord[key] = PENALTY;
//       } else {
//         scoreRecord[key] = 0;
//       }
//       continue;
//     }

//     // interests는 extra, target 모두 중복 선택 가능 -> 하나라도 겹친다면 점수 부여
//     if (key === 'interests' && key in targetStandard) {
//       const mine = new Set(targetStandard[key].split(','));
//       const targetSet = new Set(value.split(','));

//       // 2개 이상 겹쳐야 점수 부여
//       if (
//         Array.from(mine).filter((interest) => targetSet.has(interest)).length >
//         1
//       ) {
//         score += targetStandard[`${key}_w`];
//         scoreRecord[key] = targetStandard[`${key}_w`];
//       } else if (`${key}_w` in importantStandard) {
//         score += PENALTY;
//         scoreRecord[key] = PENALTY;
//       } else {
//         scoreRecord[key] = 0;
//       }
//       continue;
//     }

//     // 다중 선택 정보
//     if (
//       key in targetStandard &&
//       targetStandard[key].split(',').includes(String(value))
//     ) {
//       score += targetStandard[`${key}_w`];
//       scoreRecord[key] = targetStandard[`${key}_w`];
//     } else if (`${key}_w` in importantStandard) {
//       score += PENALTY;
//       scoreRecord[key] = PENALTY;
//     } else {
//       scoreRecord[key] = 0;
//     }
//   }

//   return score;
// }

// export function getScores(
//   gender: number,
//   data: Record<string, any>,
//   targets: TargetData[],
// ): ScoreFToMDto[] | ScoreMToFDto[] {
//   const scoreList: ScoreFToMDto[] | ScoreMToFDto[] = [];
//   let scoreRecord: ScoreRecord = {};

//   // 이상형 정보 분류
//   for (const { u, ud, ue } of targets) {
//     scoreRecord = {};
//     const target: TargetData = { u, ud, ue };
//     const scoreSum = getScore(data, target, scoreRecord);
//     scoreRecord.scoreSum = scoreSum;

//     if (gender === 0) {
//       scoreRecord.femaleId = data.femaleId;
//       scoreRecord.maleId = target.u.id;
//       scoreList.push(scoreRecord as ScoreFToMDto);
//     } else {
//       scoreRecord.maleId = data.maleId;
//       scoreRecord.femaleId = target.u.id;
//       scoreList.push(scoreRecord as ScoreMToFDto);
//     }
//   }

//   return scoreList;
// }
