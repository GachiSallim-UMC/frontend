import type { Chore } from '@/features/chore';
import type { Expense } from '@/features/expense';
import type { Item } from '@/features/item';
import type { ChatMessage, ChatRoom } from '@/features/messenger';
import type { Rule } from '@/features/rule';
import type { User } from '@/shared/types';
import type { Group } from '@/features/member';

// ==================== 사용자 (Figma 기준: 홍길동·김영희·이철수) ====================

export const users: User[] = [
  { id: 'u1', name: '홍길동', nickname: '길동', email: 'hong@example.com' },
  { id: 'u2', name: '김영희', nickname: '영희', email: 'kim@example.com' },
  { id: 'u3', name: '이철수', nickname: '철수', email: 'lee@example.com' },
];

/** 현재 로그인 사용자 — Figma 기준 관리자(Admin) */
export const currentUser: User = users[0]; // 홍길동

// ==================== 집안일 (Figma 07 · 집안일 목록) ====================
// todayChores(status !== 'done') = 3건 → 대시보드 "3건" 일치

export const chores: Chore[] = [
  {
    id: 'c1',
    name: '화장실 청소',
    assignee: users[0],
    category: 'cleaning',
    repeatType: 'weekly',
    repeatDays: ['mon'],
    startDate: '2026.07.01',
    status: 'pending',
  },
  {
    id: 'c2',
    name: '설거지',
    assignee: users[1],
    category: 'dishes',
    repeatType: 'daily',
    repeatDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    startDate: '2026.07.01',
    status: 'done',
  },
  {
    id: 'c3',
    name: '분리수거',
    assignee: users[2],
    category: 'trash',
    repeatType: 'weekly',
    repeatDays: ['wed'],
    startDate: '2026.07.01',
    status: 'pending',
  },
  {
    id: 'c4',
    name: '냉장고 정리',
    assignee: users[0],
    category: 'etc',
    repeatType: 'monthly',
    repeatDays: [],
    startDate: '2026.08.01',
    status: 'scheduled',
    memo: '유통기한 지난 식품 확인 및 정리',
  },
  {
    id: 'c5',
    name: '거실 청소',
    assignee: users[1],
    category: 'cleaning',
    repeatType: 'weekly',
    repeatDays: ['sat'],
    startDate: '2026.06.28',
    status: 'done',
  },
  {
    id: 'c6',
    name: '세탁기 돌리기',
    assignee: users[2],
    category: 'laundry',
    repeatType: 'weekly',
    repeatDays: ['tue', 'fri'],
    startDate: '2026.06.27',
    status: 'done',
    memo: '밤 10시 이전에 돌리기',
  },
  {
    id: 'c7',
    name: '음식물 쓰레기 버리기',
    assignee: users[0],
    category: 'trash',
    repeatType: 'daily',
    repeatDays: ['mon', 'wed', 'fri'],
    startDate: '2026.06.30',
    status: 'done',
  },
];

// ==================== 생활비 (Figma 09 · 정산 목록) ====================
// 이번 달 총 지출 138,000원 = 32,000 + 30,000 + 54,000 + 22,000

export const expenses: Expense[] = []; /*[
  {
    id: 'e1',
    title: '마트 장보기',
    amount: 32000,
    payer: users[1], // 김영희 선지불
    date: '2026.06.28',
    splitType: 'equal',
    category: 'food',
    status: 'unpaid',
    shares: [
      { user: users[0], amount: 10666, isPaid: false }, // 홍길동 미납
      { user: users[1], amount: 10666, isPaid: true }, // 김영희 선지불
      { user: users[2], amount: 10668, isPaid: true }, // 이철수 납부완료
    ],
    memo: '쌀 10KG, 계란 1판 외 식재료',
  },
  {
    id: 'e2',
    title: '인터넷 요금',
    amount: 30000,
    payer: users[0], // 홍길동 선지불
    date: '2026.06.25',
    splitType: 'equal',
    category: 'finance',
    status: 'unpaid',
    shares: [
      { user: users[0], amount: 10000, isPaid: true }, // 홍길동 선지불
      { user: users[1], amount: 10000, isPaid: false }, // 김영희 미납
      { user: users[2], amount: 10000, isPaid: false }, // 이철수 미납
    ],
  },
  {
    id: 'e3',
    title: '전기요금',
    amount: 54000,
    payer: users[2], // 이철수 선지불
    date: '2026.06.20',
    splitType: 'equal',
    category: 'finance',
    status: 'paid',
    shares: [
      { user: users[0], amount: 18000, isPaid: true },
      { user: users[1], amount: 18000, isPaid: true },
      { user: users[2], amount: 18000, isPaid: true }, // 이철수 선지불
    ],
  },
  {
    id: 'e4',
    title: '욕실 용품 구매',
    amount: 22000,
    payer: users[0], // 홍길동 선지불
    date: '2026.06.15',
    splitType: 'ratio',
    category: 'living',
    status: 'unpaid',
    shares: [
      { user: users[0], amount: 4000, isPaid: true }, // 홍길동 선지불
      { user: users[1], amount: 10000, isPaid: false }, // 김영희 미납
      { user: users[2], amount: 8000, isPaid: false }, // 이철수 미납
    ],
    memo: '샴푸, 바디워시, 치약 외',
  },
];

*/

// ==================== 공용 물품 (Figma 11 · 공용 물품 목록) ====================
// 부족+소진 = 2종 → 대시보드 "2종" 일치

export const items: Item[] = [
  {
    id: 'i1',
    name: '세제',
    category: 'kitchen',
    buyer: users[2],
    status: 'short',
    updatedAt: '2026.06.29',
    memo: '매달 구매, 마트에서 대용량으로 구입',
  },
  {
    id: 'i2',
    name: '두루마리 화장지',
    category: 'bathroom',
    status: 'empty',
    updatedAt: '2026.06.28',
  },
  {
    id: 'i3',
    name: '샴푸',
    category: 'bathroom',
    buyer: users[0],
    status: 'enough',
    updatedAt: '2026.06.15',
  },
  {
    id: 'i4',
    name: '주방 세척제',
    category: 'kitchen',
    buyer: users[1],
    status: 'enough',
    updatedAt: '2026.06.20',
  },
  {
    id: 'i5',
    name: '청소기 먼지봉투',
    category: 'cleaning',
    buyer: users[0],
    status: 'enough',
    updatedAt: '2026.06.17',
  },
  {
    id: 'i6',
    name: '세탁 세제',
    category: 'cleaning',
    buyer: users[1],
    status: 'enough',
    updatedAt: '2026.06.10',
  },
  {
    id: 'i7',
    name: '바디워시',
    category: 'bathroom',
    buyer: users[2],
    status: 'enough',
    updatedAt: '2026.06.15',
  },
  {
    id: 'i8',
    name: '종량제 봉투',
    category: 'kitchen',
    buyer: users[2],
    status: 'enough',
    updatedAt: '2026.06.12',
  },
];

// ==================== 생활 규칙 (Figma 13 · 생활 규칙 목록) ====================

export const rules: Rule[] = [
  {
    id: 'r1',
    category: 'noise',
    title: '밤 11시 이후 조용히 하기',
    content: '통화와 음악은 이어폰을 사용하고 세탁기는 다음 날 사용해요.',
    registeredBy: users[0], // 홍길동
    registeredAt: '2025-07-01',
    agreement: { agreedCount: 3, totalCount: 3, agreedMembers: users },
    status: 'active',
  },
  {
    id: 'r2',
    category: 'visitor',
    title: '방문객은 사전에 공유하기',
    content: '하루 전 메신저로 공유하고, 숙박이 필요한 경우 전원 동의를 받아요.',
    registeredBy: users[1], // 김영희
    registeredAt: '2025-07-05',
    agreement: { agreedCount: 2, totalCount: 3, agreedMembers: [users[0], users[1]] },
    status: 'active',
  },
  {
    id: 'r3',
    category: 'cleaning',
    title: '주방 사용 후 즉시 정리',
    content: '요리 후 가스레인지·조리대를 닦고 설거지는 당일 완료해요.',
    registeredBy: users[2], // 이철수
    registeredAt: '2025-07-10',
    agreement: { agreedCount: 3, totalCount: 3, agreedMembers: users },
    status: 'active',
  },
  {
    id: 'r4',
    category: 'cleaning',
    title: '음식물 쓰레기는 당일 배출',
    content: '냄새 방지를 위해 음식물 쓰레기는 당일 저녁에 버려요.',
    registeredBy: users[0], // 홍길동
    registeredAt: '2025-06-20',
    agreement: { agreedCount: 1, totalCount: 3, agreedMembers: [users[0]] },
    status: 'inactive',
  },
];

// ==================== 알림 (Figma 16 · 알림 목록) ====================

export const notifications = [
  {
    id: 'n1',
    title: '집안일 알림',
    message: '오늘 화장실 청소가 예정되어 있습니다. (담당: 홍길동)',
    time: '오전 9:00',
    status: 'pending' as const,
  },
  {
    id: 'n2',
    title: '정산 알림',
    message: '김영희 님이 마트 장보기 정산을 요청했습니다. (10,666원)',
    time: '오전 10:30',
    status: 'unpaid' as const,
  },
  {
    id: 'n3',
    title: '물품 알림',
    message: '두루마리 화장지가 소진 상태로 변경되었습니다.',
    time: '어제 오후 8:15',
    status: 'empty' as const,
  },
  {
    id: 'n4',
    title: '규칙 알림',
    message: '이철수 님이 규칙 동의를 요청했습니다.',
    time: '2일 전',
    status: 'pending' as const,
  },
  {
    id: 'n5',
    title: '메신저 알림',
    message: '이철수 님이 메시지를 보냈습니다: "세제도 부족한 것 같던데..."',
    time: '3일 전',
    status: 'done' as const,
  },
  {
    id: 'n6',
    title: '그룹 알림',
    message: "김영희 님이 그룹 '우리집 룸메이트'에 참여했습니다.",
    time: '3일 전',
    status: 'done' as const,
  },
];

// ==================== 최근 활동 (대시보드 요약 위젯 · TimelineItem/RecentActivityPanel용) ====================
// 활동 내역 전체 페이지(Figma 17)는 아래 activityLogs를 사용합니다. 이건 대시보드 미니 위젯 전용 축약 데이터입니다.

export const activities = [
  {
    id: 'a1',
    actorName: '김영희',
    description: "집안일 '설거지'를 완료 처리했습니다.",
    timestamp: '오늘 10:30',
  },
  {
    id: 'a2',
    actorName: '홍길동',
    description: "생활비 '인터넷 요금 30,000원'을 등록했습니다.",
    timestamp: '오늘 09:15',
  },
  {
    id: 'a3',
    actorName: '이철수',
    description: "'세제' 상태를 '부족'으로 변경했습니다.",
    timestamp: '어제 22:10',
  },
  {
    id: 'a4',
    actorName: '홍길동',
    description: "생활 규칙 '밤 11시 이후 조용히 하기'를 메신저에 공유했습니다.",
    timestamp: '어제 19:40',
  },
  {
    id: 'a5',
    actorName: '이철수',
    description: "집안일 '분리수거'를 완료 처리했습니다.",
    timestamp: '어제 11:05',
  },
  {
    id: 'a6',
    actorName: '홍길동',
    description: "공용 물품 '두루마리 화장지'를 '소진' 상태로 변경했습니다.",
    timestamp: '2일 전 15:20',
  },
  {
    id: 'a7',
    actorName: '김영희',
    description: "생활비 '마트 장보기 32,000원'을 등록했습니다.",
    timestamp: '2일 전 14:00',
  },
  {
    id: 'a8',
    actorName: '이철수',
    description: "생활 규칙 '주방 사용 후 즉시 정리'에 동의했습니다.",
    timestamp: '2일 전 13:30',
  },
  {
    id: 'a9',
    actorName: '김영희',
    description: "그룹 '우리집 룸메이트'에 참여했습니다.",
    timestamp: '3일 전 15:20',
  },
];

// ==================== 활동 내역 (Figma 17 · 최근 활동 내역) ====================
// 데모 기준 '오늘' = 2026.06.25

export const activityLogs = [
  {
    id: 'a1',
    actorName: '김영희',
    description: "생활비 '마트 장보기 32,000원'을 등록했습니다.",
    category: 'expense',
    date: '2026-06-25',
    dateLabel: '2026.06.25 (오늘)',
    time: '오전 10:30',
  },
  {
    id: 'a2',
    actorName: '김영희',
    description: "집안일 '설거지'를 완료 처리했습니다.",
    category: 'chore',
    date: '2026-06-25',
    dateLabel: '2026.06.25 (오늘)',
    time: '오전 9:15',
  },
  {
    id: 'a3',
    actorName: '이철수',
    description: "공용 물품 '세제' 상태를 '부족'으로 변경했습니다.",
    category: 'item',
    date: '2026-06-25',
    dateLabel: '2026.06.25 (오늘)',
    time: '오전 08:50',
  },
  {
    id: 'a4',
    actorName: '홍길동',
    description: "생활 규칙 '밤 11시 이후 조용히 하기'를 메신저에 공유했습니다.",
    category: 'rule',
    date: '2026-06-24',
    dateLabel: '2026.06.24 (어제)',
    time: '오후 22:10',
  },
  {
    id: 'a5',
    actorName: '이철수',
    description: "집안일 '분리수거'를 완료 처리했습니다.",
    category: 'chore',
    date: '2026-06-24',
    dateLabel: '2026.06.24 (어제)',
    time: '오후 19:40',
  },
  {
    id: 'a6',
    actorName: '홍길동',
    description: "공용 물품 '두루마리 화장지'를 '소진' 상태로 변경했습니다.",
    category: 'item',
    date: '2026-06-24',
    dateLabel: '2026.06.24 (어제)',
    time: '오후 15:20',
  },
  {
    id: 'a7',
    actorName: '홍길동',
    description: "생활비 '인터넷 요금 30,000원'을 등록했습니다",
    category: 'expense',
    date: '2026-06-24',
    dateLabel: '2026.06.24 (어제)',
    time: '오전 11:05',
  },
  {
    id: 'a8',
    actorName: '김영희',
    description: '그룹에 참여했습니다',
    category: 'group',
    date: '2026-06-23',
    dateLabel: '2026.06.23',
    time: '오후 14:00',
  },
  {
    id: 'a9',
    actorName: '이철수',
    description: "생활 규칙 '주방 사용 후 즉시 정리'에 동의했습니다",
    category: 'rule',
    date: '2026-06-23',
    dateLabel: '2026.06.23',
    time: '오후 13:10',
  },
];

// ==================== 메신저 (Figma 15 · 그룹 내 실시간 메신저) ====================

const roommateMembers: ChatRoom['members'] = [
  { id: 'u1', name: '홍길동', isOwner: true, joinedDateLabel: '2026.03.02' },
  { id: 'u2', name: '김영희', joinedDateLabel: '2026.03.02' },
  { id: 'u3', name: '이철수', joinedDateLabel: '2026.02.28' },
];

export const chatRooms: ChatRoom[] = [
  {
    id: 'room-main',
    name: '우리집 룸메이트',
    lastMessage: '김영희: 세제 샀어요!',
    timestamp: '오전 11:06',
    unreadCount: 2,
    category: 'group',
    members: roommateMembers,
    notificationEnabled: true,
    isPinned: false,
  },
  {
    id: 'room-notice',
    name: '공지 / 규칙 채널',
    lastMessage: '새 규칙이 등록되었습니다.',
    timestamp: '05.21',
    unreadCount: 0,
    category: 'notice',
    members: roommateMembers,
    notificationEnabled: true,
    isPinned: false,
  },
  {
    id: 'room-dm-u2',
    name: '김영희',
    lastMessage: '정산 요청 보냈어요~...',
    timestamp: '오전 10:32',
    unreadCount: 1,
    category: 'dm',
    members: [roommateMembers[0], roommateMembers[1]],
    notificationEnabled: true,
    isPinned: false,
  },
  {
    id: 'room-dm-u3',
    name: '이철수',
    lastMessage: '넵 분리수거 제가 할게요',
    timestamp: '어제',
    unreadCount: 0,
    category: 'dm',
    members: [roommateMembers[0], roommateMembers[2]],
    notificationEnabled: true,
    isPinned: false,
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: 'm1',
    roomId: 'room-main',
    senderId: 'u2',
    senderName: '김영희',
    timestamp: '오전 10:05',
    isMine: false,
    content: '오늘 마트 다녀왔어요. 장보기 비용 등록했습니다!',
  },
  {
    id: 'm2',
    roomId: 'room-main',
    senderId: 'u2',
    senderName: '김영희',
    timestamp: '오전 10:06',
    isMine: false,
    shareCard: {
      type: 'expense',
      title: '마트 장보기',
      headline: ' 정산을 공유했어요',
      details: [
        { label: '총액', value: '32,000원' },
        { label: '분담 방식', value: '균등 분할' },
        { label: '1인당 금액', value: '10,666원' },
      ],
      actionLabel: '정산하기',
    },
  },
  {
    id: 'm3',
    roomId: 'room-main',
    senderId: 'u3',
    senderName: '이철수',
    timestamp: '오전 10:20',
    isMine: false,
    content: '세제도 부족한 것 같던데 확인해볼게요',
  },
  {
    id: 'm4',
    roomId: 'room-main',
    senderId: 'u3',
    senderName: '이철수',
    timestamp: '오전 10:21',
    isMine: false,
    shareCard: {
      type: 'item',
      title: '세제',
      headline: '가 부족해요',
      details: [{ label: '구매 담당', value: '이철수' }],
      actionLabel: '구매 완료',
    },
  },
  {
    id: 'm5',
    roomId: 'room-main',
    senderId: 'u1',
    senderName: '홍길동',
    timestamp: '오전 10:30',
    isMine: true,
    content: '구매 완료했어요. 곧 채울게요!',
  },
  {
    id: 'm6',
    roomId: 'room-main',
    senderId: 'u1',
    senderName: '홍길동',
    timestamp: '오전 10:31',
    isMine: true,
    shareCard: {
      type: 'chore',
      title: '화장실 청소',
      headline: '가 등록됐어요',
      details: [
        { label: '담당자', value: '홍길동' },
        { label: '반복', value: '매주 월요일' },
      ],
      actionLabel: '완료 처리',
    },
  },
  {
    id: 'm7',
    roomId: 'room-main',
    senderId: 'u1',
    senderName: '홍길동',
    timestamp: '오전 10:32',
    isMine: true,
    shareCard: {
      type: 'rule',
      title: '밤 11시 이후 조용히 하기',
      headline: ' 규칙 동의를 요청했어요',
      details: [{ label: '동의 현황', value: '2/3명 동의' }],
      actionLabel: '동의하기',
    },
  },
];

// ==================== 그룹 정보 (Figma 03 · 그룹 선택 / 04 · 그룹 생성) ====================

export const groups: Group[] = [
  {
    id: 'g1',
    name: '우리집 룸메이트',
    description: '룸메이트',
    type: 'ROOMMATE',
    address: '서울특별시 마포구 연남동 123-45',
    inviteCode: 'ABCDEF',
    createdAt: '2026.04.01',
    maxMemberCount: 5,
    memberCount: 3,
    members: users,
    ownerId: 'u1', // 홍길동
  },
  {
    id: 'g2',
    name: '대학원 쉐어하우스',
    description: '쉐어하우스',
    type: 'SHARE',
    address: '서울특별시 마포구 연남동 123-45',
    inviteCode: 'ABCDEF',
    createdAt: '2026.04.01',
    maxMemberCount: 5,
    memberCount: 5,
    members: users,
    ownerId: 'u1', // 홍길동
  },
];

// ==================== 마이페이지 (Figma 18 · 마이페이지) ====================

export const mypage = {
  user: currentUser, // 홍길동
  role: '관리자' as const,
  joinedAt: '2026.04.01',
  choreStats: {
    total: 24,
    done: 18,
    pending: 6,
  },
  expenseStats: {
    totalPaid: 52000, // 홍길동이 선지불한 총액 (인터넷 30,000 + 욕실 용품 22,000)
    totalReceived: 24000, // 받은 금액 (전기요금 18,000 + 욕실 용품 기납부분)
  },
};
