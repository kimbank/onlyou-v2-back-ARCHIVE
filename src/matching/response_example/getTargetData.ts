// TODO: 다른 방안을 찾아야 함
export const getTargetDataSample = {
  status: 200,
  description: '상대방 정보 조회 성공',
  schema: {
    example: {
      userId: '6585716e6c72bee5896f522a',
      targetId: '6598e80893ba66241368bbf9',
      nickname: 'test123',
      details: {
        birthYear: {
          data: 1998,
          priority: 0,
        },
        residence: {
          data: 10,
          priority: 0,
        },
        university: {
          priority: 2,
          data: 4,
        },
        divorce: {
          priority: 2,
          data: false,
        },
        workType: {
          priority: 2,
          data: 0,
        },
        smoking: {
          priority: 2,
          data: 0,
        },
        interest: {
          priority: 0,
          data: [0, 1, 4, 5],
        },
        athleticLife: {
          priority: 1,
          data: 0,
        },
        personalityCharm: {
          priority: 0,
          data: [3, 4],
        },
        childrenValues: {
          priority: 1,
          data: 0,
        },
        bodyType: {
          priority: 3,
          data: 0,
        },
        externalCharm: {
          priority: 0,
          data: [0, 3],
        },
        tattoo: {
          priority: 3,
          data: 0,
        },
        preferredDate: {
          priority: 3,
          data: 0,
        },
        tmpJob: {
          data: 'Test',
          priority: 0,
        },
      },
      photos: [
        {
          id: '6571692fc60c407cb4862385',
          url: 'https://avatars.githubusercontent.com/u/87305109?v=4',
          createdAt: '2023-12-05T00:00:00.000Z',
        },
        {
          id: '6571695ac240269232fe56a8',
          url: 'https://github.com/kimbank/awesome-inha-restaurant/raw/main/awesome.jpg',
          createdAt: '2023-12-05T00:00:00.000Z',
        },
      ],
      letters: {
        '5': '5번편지입니다람쥐쥐쥐쥐쥐',
      },
    },
  },
};

export default getTargetDataSample;
