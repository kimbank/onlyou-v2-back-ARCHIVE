class Mapper {
  // ****** 기본 가입 정보
  // **** users
  //
  /**
   * @param {number} num - 연도
   */
  dateBirth(num: number): string {
    return `${num}년생`;
  }
  /**
   * @param {number} num - 거주지
   */
  residence(num: number): string {
    const mapping = [
      '서울 남부',
      '서울 서부',
      '서울 중부',
      '서울 북부',
      '서울 동부',
      '경기 북부',
      '경기 고양',
      '경기 서부',
      '경기 남부',
      '경기 동부',
      '인천',
    ];
    return mapping[num];
  }

  // ****** 기본 심사 정보
  // **** users_?_data
  //
  /**
   * @param {number} num - 직장 유형
   */
  jobType(num: number): string {
    const mapping = [
      '대학생',
      '대학원생',
      '중견기업',
      '중소기업',
      '스타트업',
      '자영업자',
      '프리랜서',
      '전문직',
      '공무원',
      '공기업',
      '대기업',
      '법인 대표',
      '기타',
    ];
    return mapping[num];
  }

  /**
   * @param {number} num - 학력
   */
  education(num: number): string {
    const mapping = ['미진학', '전문대', '일반 4년제 대학', '명문대', '일류대'];
    return mapping[num];
  }

  /**
   * @param {number} num - 돌싱 여부
   */
  divorce(num: number): string {
    const mapping = ['초혼', '돌싱'];
    return mapping[num];
  }

  // ****** 부가 정보
  // **** users_?_data_extra
  //
  /**
   * @param {number} num - 흡연 경력
   */
  smokingHistory(num: number): string {
    const mapping = ['비흡연', '금연', '흡연'];
    return mapping[num];
  }

  /**
   * @param {number} num - 음주 생활
   */
  drinkingLife(num: number): string | null {
    const mapping = [
      '전혀 마시지 않음',
      '거의 마시지 않음',
      '이따금 마심(한 달 1 회 이상)',
      '종종 마심(주 1 회 이상)',
      '자주 마심(주 2 회 이상)',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 자차 소유 여부
   */
  ownedCar(num: number): string | null {
    const mapping = ['미소유', '소유'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {string} nums - 관심사
   */
  interests(nums: string): string | null {
    const mapping = [
      '여행',
      '운동/스포츠',
      '책',
      '직무',
      '외국/언어',
      '영화/넷플릭스',
      '콘서트/공연/뮤지컬',
      '전시회',
      '재태크',
      '공예/만들기',
      '음악/악기',
      '댄스/무용',
      '봉사',
      '사교/인맥',
      '차/오토바이',
      '반려동물',
      '게임/오락',
      '사진/영상',
      '요리',
      '맛집/카페',
      '애니메이션',
    ];
    try {
      const decodedInterests = nums
        .split(',')
        .map((index) => mapping[parseInt(index)]);
      return decodedInterests.join(', ');
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 연애 횟수
   */
  numberRelationships(num: number): string | null {
    const mapping = ['0회', '1~2회', '3~4회', '5~6회', '7회 이상'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 운동 생활
   */
  athleticLife(num: number): string | null {
    const mapping = [
      '중요성엔 공감하지만 규칙적으로 하고 있진 않다',
      '운동을 규칙적으로 꾸준히 한다',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 반려동물 키우기 여부
   */
  petAnimal(num: number): string | null {
    const mapping = [
      '키우기 어렵습니다',
      '키우지 않으나 반려동물에 거부감은 없습니다',
      '한 마리 키웁니다',
      '두 마리 이상 키웁니다',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 종교
   */
  religion(num: number): string | null {
    const mapping = ['무교', '기독교', '천주교', '불교', '원불교', '기타'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 외향/내향 성향
   */
  extrovertOrIntrovert(num: number): string | null {
    const mapping = ['매우 외향적', '외향적', '중립', '내향적', '매우 내향적'];
    try {
      return mapping[num + 2];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 직관/현실 성향
   */
  intutiveOrRealistic(num: number): string | null {
    const mapping = ['매우 직관적', '직관적', '중립', '현실적', '매우 현실적'];
    try {
      return mapping[num + 2];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 감성/이성 성향
   */
  emotionalOrRational(num: number): string | null {
    const mapping = ['매우 감성적', '감성적', '중립', '이성적', '매우 이성적'];
    try {
      return mapping[num + 2];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 즉흥/계획 성향
   */
  impromptuOrPlanned(num: number): string | null {
    const mapping = ['매우 즉흥적', '즉흥적', '중립', '계획적', '매우 계획적'];
    try {
      return mapping[num + 2];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 자기확신/신중 성향
   */
  selfconfidenceOrCareful(num: number): string | null {
    const mapping = ['매우 자기확신', '자기확신', '중립', '신중', '매우 신중'];
    try {
      return mapping[num + 2];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 결혼 가치관
   */
  marriageValues(num: number): string | null {
    const mapping = [
      '비혼주의에요',
      '아직 결혼은 이르다고 생각해요',
      '사랑한다면 3년 내로 결혼도 생각할 것 같아요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 종교의 중요성
   */
  religiousValues(num: number): string | null {
    const mapping = [
      '인생에서 종교는 중요하지 않아요',
      '종교가 중요하긴 하지만, 가장 중요한 요소는 아니에요',
      '종교가 매우 중요해요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 이성 친구 가치관
   */
  oppositeFriendsValues(num: number): string | null {
    const mapping = [
      '친한 친구라면 술, 영화도 괜찮아요',
      '식사, 커피 외에는 이해하기 어려워요',
      '친한 친구라도 단둘이 만나는 것은 자제해야 해요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 정치 성향
   */
  politicalValues(num: number): string | null {
    const mapping = [
      '관심 없어요',
      '진보에 가까워요',
      '보수에 가까워요',
      '중도에 가까워요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 소비 가치관
   */
  consumptionValues(num: number): string | null {
    const mapping = [
      '조금 부족하더라도 편안한 미래를 위해 절약하고 싶어요',
      '지금 아니면 못하는 것들에 충분히 투자하고 싶어요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 커리어와 가정 가치관
   */
  careerFamilyValues(num: number): string | null {
    const mapping = [
      '두 사람 모두 가정이 커리어보다 우선이었으면 해요',
      '두 사람 중 한 명은 커리어보다 가정에 신경을 썼으면 해요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 동물 이미지
   */
  animalImage(num: number): string | null {
    const mapping = ['강아지', '고양이', '여우', '곰돌이', '햄스터', '공룡'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 쌍커풀
   */
  doubleEyelid(num: number): string | null {
    const mapping = ['무쌍', '속쌍', '유쌍'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 얼굴상
   */
  faceShape(num: number): string | null {
    const mapping = ['순한 얼굴상', '진한 얼굴상'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 체형
   */
  bodyType(num: number): string | null {
    const mapping = ['슬림', '표준', '통통', '탄탄', '근육근육'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 피부톤
   */
  skinTone(num: number): string | null {
    const mapping = ['하얀 편', '보통', '어두운 편'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 문신 유무
   */
  tattoo(num: number): string | null {
    const mapping = ['없음', '있음'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 패션 스타일
   */
  fashionStyle(num: number): string | null {
    const mapping = [
      '캐주얼',
      '댄디',
      '스트릿',
      '아메카지',
      '포멀',
      '모던',
      '여성스러운',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 선호 데이트
   */
  preferredDating(num: number): string | null {
    const mapping = ['정적인 데이트 선호', '활동적인 데이트 선호'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 선호 연락 수단
   */
  preferredContactMethod(num: number): string | null {
    const mapping = ['전화', '카톡'];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 애교 레벨
   */
  attractivenessLevel(num: number): string | null {
    const mapping = ['매우 많음', '많음', '보통', '적음', '매우 적음'];
    try {
      return mapping[num + 2];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 질투 레벨
   */
  jealousyLevel(num: number): string | null {
    const mapping = ['매우 많음', '많음', '보통', '적음', '매우 적음'];
    try {
      return mapping[num + 2];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 연애 주도성
   */
  loveInitiative(num: number): string | null {
    const mapping = [
      '보통 따라간다',
      '가끔 리드한다',
      '종종 리드한다',
      '주로 리드한다',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 데이트 빈도 인덱스
   */
  datingFrequency(num: number): string | null {
    const mapping = [
      '일주일에 1번 미만',
      '일주일에 1번',
      '일주일에 2번',
      '일주일에 3번 이상',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 연락 스타일 인덱스
   */
  contactStyle(num: number): string | null {
    const mapping = [
      '시간 여유가 있고 서로 생각 날 때 연락했으면 해요',
      '바쁘더라도 연락은 최대한 자주 하는 게 좋아요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 스킨쉽(혼전순결) 인덱스
   */
  skinship(num: number): string | null {
    const mapping = [
      '연애의 중요한 요소라고 생각해요',
      '결혼 전 관계는 원하지 않아요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }
  /**
   * @param {number} num - 소셜 미디어(SNS) 인덱스
   */
  sns(num: number): string | null {
    const mapping = [
      '둘만의 사생활을 공개적으로 올리는 건 별로예요',
      '좋아하는 사람과의 행복한 모습을 당당하게 올리는 게 좋아요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 갈등 해결 방식 인덱스
   */
  conflictResolutionMethod(num: number): string | null {
    const mapping = [
      '시간을 가지고 감정을 진정시킨 후 이야기하는 게 좋아요',
      '갈등은 바로 풀어야 해요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  /**
   * @param {number} num - 만나기 전 정보 인덱스
   */
  informationBeforeMeeting(num: number): string | null {
    const mapping = [
      '만나기 전에는 간단히 장소와 시간만 정하고 싶어요',
      '만나기 전에도 카톡, 전화 등으로 서로를 알아가고 싶어요',
    ];
    try {
      return mapping[num];
    } catch (error) {
      return null;
    }
  }

  decodeValueWithKey(key: string, value: any): string {
    let ret: string = '?';

    switch (key) {
      case 'dateBirth':
        ret = this.dateBirth(value);
        break;
      case 'residence':
        ret = this.residence(value);
        break;
      case 'job_type':
        ret = this.jobType(value);
        break;
      case 'education':
        ret = this.education(value);
        break;
      case 'divorce':
        ret = this.divorce(value);
        break;
      case 'smoking_history':
        ret = this.smokingHistory(value);
        break;
      case 'drinking_life':
        ret = this.drinkingLife(value);
        break;
      case 'owned_car':
        ret = this.ownedCar(value);
        break;
      case 'interests':
        ret = this.interests(value);
        break;
      case 'number_relationships':
        ret = this.numberRelationships(value);
        break;
      case 'athletic_life':
        ret = this.athleticLife(value);
        break;
      case 'pet_animal':
        ret = this.petAnimal(value);
        break;
      case 'religion':
        ret = this.religion(value);
        break;
      case 'extrovert_or_introvert':
        ret = this.extrovertOrIntrovert(value);
        break;
      case 'intuitive_or_realistic':
        ret = this.intutiveOrRealistic(value);
        break;
      case 'emotional_or_rational':
        ret = this.emotionalOrRational(value);
        break;
      case 'impromptu_or_planned':
        ret = this.impromptuOrPlanned(value);
        break;
      case 'selfconfidence_or_careful':
        ret = this.selfconfidenceOrCareful(value);
        break;
      case 'marriage_values':
        ret = this.marriageValues(value);
        break;
      case 'religious_values':
        ret = this.religiousValues(value);
        break;
      case 'opposite_friends_values':
        ret = this.oppositeFriendsValues(value);
        break;
      case 'political_values':
        ret = this.politicalValues(value);
        break;
      case 'consumption_values':
        ret = this.consumptionValues(value);
        break;
      case 'career_family_values':
        ret = this.careerFamilyValues(value);
        break;
      case 'animal_image':
        ret = this.animalImage(value);
        break;
      case 'double_eyelid':
        ret = this.doubleEyelid(value);
        break;
      case 'face_shape':
        ret = this.faceShape(value);
        break;
      case 'body_type':
        ret = this.bodyType(value);
        break;
      case 'skin_tone':
        ret = this.skinTone(value);
        break;
      case 'tattoo':
        ret = this.tattoo(value);
        break;
      case 'fashion_style':
        ret = this.fashionStyle(value);
        break;
      case 'preferred_dating':
        ret = this.preferredDating(value);
        break;
      case 'preferred_contact_method':
        ret = this.preferredContactMethod(value);
        break;
      case 'attractiveness_level':
        ret = this.attractivenessLevel(value);
        break;
      case 'jealousy_level':
        ret = this.jealousyLevel(value);
        break;
      case 'love_initiative':
        ret = this.loveInitiative(value);
        break;
      case 'dating_frequency':
        ret = this.datingFrequency(value);
        break;
      case 'contact_style':
        ret = this.contactStyle(value);
        break;
      case 'skinship':
        ret = this.skinship(value);
        break;
      case 'sns':
        ret = this.sns(value);
        break;
      case 'conflict_resolution_method':
        ret = this.conflictResolutionMethod(value);
        break;
      case 'information_before_meeting':
        ret = this.informationBeforeMeeting(value);
        break;
    }

    return ret;
  }
}
export const mapper = new Mapper();
