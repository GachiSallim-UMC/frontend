import type { Chore } from '@/features/chore';
import type { Expense } from '@/features/expense';
import type { Item } from '@/features/item';
import type { Rule } from '@/features/rule';
import type { User } from '@/shared/types';

// ==================== 사용자 ====================

export const users: User[] = [
  { id: 'u1', name: '김민준', nickname: '민준', email: 'minjun@gachi.test' },
  { id: 'u2', name: '이서연', nickname: '서연', email: 'seoyeon@gachi.test' },
  { id: 'u3', name: '박지후', nickname: '지후', email: 'jihuu@gachi.test' },
];

/** 현재 로그인한 사용자 (이서연) */
export const currentUser: User = users[1];

// ==================== 집안일 ====================

export const chores: Chore[] = [
  {
    id: 'c1',
    name: '분리수거 내놓기',
    assignee: users[0],
    category: 'trash',
    repeatType: 'weekly',
    repeatDays: ['wed'],
    startDate: '2026.06.25',
    status: 'pending',
    memo: '병·캔·종이 재질별로 분리 후 묶어서 내놓기',
  },
  {
    id: 'c2',
    name: '거실 청소',
    assignee: users[1],
    category: 'cleaning',
    repeatType: 'weekly',
    repeatDays: ['sat'],
    startDate: '2026.06.28',
    status: 'scheduled',
  },
  {
    id: 'c3',
    name: '설거지 정리',
    assignee: users[2],
    category: 'dishes',
    repeatType: 'daily',
    repeatDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startDate: '2026.06.27',
    status: 'done',
  },
  {
    id: 'c4',
    name: '욕실 청소',
    assignee: users[0],
    category: 'cleaning',
    repeatType: 'weekly',
    repeatDays: ['sun'],
    startDate: '2026.06.29',
    status: 'pending',
    memo: '거울·세면대·변기·바닥 모두 청소',
  },
  {
    id: 'c5',
    name: '세탁물 건조 및 정리',
    assignee: users[1],
    category: 'laundry',
    repeatType: 'weekly',
    repeatDays: ['tue', 'fri'],
    startDate: '2026.06.25',
    status: 'done',
  },
  {
    id: 'c6',
    name: '냉장고 정리',
    assignee: users[2],
    category: 'etc',
    repeatType: 'monthly',
    repeatDays: ['sat'],
    startDate: '2026.06.30',
    status: 'scheduled',
    memo: '유통기한 지난 식품 확인 및 정리',
  },
  {
    id: 'c7',
    name: '공용 화장실 청소',
    assignee: users[0],
    category: 'cleaning',
    repeatType: 'weekly',
    repeatDays: ['thu'],
    startDate: '2026.06.26',
    status: 'done',
  },
  {
    id: 'c8',
    name: '음식물 쓰레기 버리기',
    assignee: users[1],
    category: 'trash',
    repeatType: 'daily',
    repeatDays: ['mon', 'wed', 'fri'],
    startDate: '2026.06.30',
    status: 'pending',
  },
  {
    id: 'c9',
    name: '현관 신발 정리',
    assignee: users[2],
    category: 'cleaning',
    repeatType: 'weekly',
    repeatDays: ['sun'],
    startDate: '2026.06.22',
    status: 'done',
  },
  {
    id: 'c10',
    name: '세탁기 돌리기',
    assignee: users[0],
    category: 'laundry',
    repeatType: 'weekly',
    repeatDays: ['tue', 'sat'],
    startDate: '2026.06.28',
    status: 'scheduled',
    memo: '밤 10시 이전에 돌리기',
  },
];

// ==================== 생활비 ====================

export const expenses: Expense[] = [
  {
    id: 'e1',
    title: '6월 전기요금',
    amount: 84200,
    payer: users[0],
    date: '2026.06.25',
    splitType: 'equal',
    category: 'utility',
    status: 'unpaid',
    shares: [
      { user: users[0], amount: 28067, isPaid: true },
      { user: users[1], amount: 28067, isPaid: false },
      { user: users[2], amount: 28066, isPaid: false },
    ],
    memo: '한국전력 자동이체 (7월 5일 출금)',
  },
  {
    id: 'e2',
    title: '공용 장보기',
    amount: 37600,
    payer: users[1],
    date: '2026.06.24',
    splitType: 'equal',
    category: 'supplies',
    status: 'paid',
    shares: [
      { user: users[0], amount: 12534, isPaid: true },
      { user: users[1], amount: 12533, isPaid: true },
      { user: users[2], amount: 12533, isPaid: true },
    ],
    memo: '마트 대용량 세제·화장지·식재료',
  },
  {
    id: 'e3',
    title: '6월 인터넷 요금',
    amount: 33000,
    payer: users[2],
    date: '2026.06.20',
    splitType: 'equal',
    category: 'utility',
    status: 'paid',
    shares: [
      { user: users[0], amount: 11000, isPaid: true },
      { user: users[1], amount: 11000, isPaid: true },
      { user: users[2], amount: 11000, isPaid: true },
    ],
    memo: 'KT 인터넷 100Mbps',
  },
  {
    id: 'e4',
    title: '주방 세제·샴푸 구매',
    amount: 24500,
    payer: users[0],
    date: '2026.06.18',
    splitType: 'equal',
    category: 'supplies',
    status: 'unpaid',
    shares: [
      { user: users[0], amount: 8167, isPaid: true },
      { user: users[1], amount: 8167, isPaid: false },
      { user: users[2], amount: 8166, isPaid: false },
    ],
  },
  {
    id: 'e5',
    title: '5월 수도요금',
    amount: 14800,
    payer: users[1],
    date: '2026.05.30',
    splitType: 'equal',
    category: 'utility',
    status: 'paid',
    shares: [
      { user: users[0], amount: 4934, isPaid: true },
      { user: users[1], amount: 4933, isPaid: true },
      { user: users[2], amount: 4933, isPaid: true },
    ],
  },
  {
    id: 'e6',
    title: '배달 음식 (치킨 세트)',
    amount: 32000,
    payer: users[2],
    date: '2026.06.14',
    splitType: 'equal',
    category: 'food',
    status: 'paid',
    shares: [
      { user: users[0], amount: 10667, isPaid: true },
      { user: users[1], amount: 10667, isPaid: true },
      { user: users[2], amount: 10666, isPaid: true },
    ],
    memo: '3인 치킨+콜라 세트',
  },
  {
    id: 'e7',
    title: '6월 가스요금',
    amount: 18600,
    payer: users[1],
    date: '2026.06.10',
    splitType: 'equal',
    category: 'utility',
    status: 'paid',
    shares: [
      { user: users[0], amount: 6200, isPaid: true },
      { user: users[1], amount: 6200, isPaid: true },
      { user: users[2], amount: 6200, isPaid: true },
    ],
  },
  {
    id: 'e8',
    title: '냉동 식품 공동 구매',
    amount: 56700,
    payer: users[0],
    date: '2026.06.05',
    splitType: 'equal',
    category: 'food',
    status: 'paid',
    shares: [
      { user: users[0], amount: 18900, isPaid: true },
      { user: users[1], amount: 18900, isPaid: true },
      { user: users[2], amount: 18900, isPaid: true },
    ],
    memo: '마켓컬리 냉동만두·냉동피자·냉동볶음밥',
  },
];

// ==================== 공용 물품 ====================

export const items: Item[] = [
  { id: 'i1', name: '화장지', category: 'bathroom', buyer: users[2], status: 'short', updatedAt: '2026.06.28' },
  { id: 'i2', name: '세탁 세제', category: 'cleaning', buyer: users[0], status: 'enough', updatedAt: '2026.06.26' },
  { id: 'i3', name: '종량제 봉투', category: 'kitchen', buyer: users[1], status: 'empty', updatedAt: '2026.06.23' },
  { id: 'i4', name: '주방 세제', category: 'kitchen', buyer: users[0], status: 'enough', updatedAt: '2026.06.18' },
  { id: 'i5', name: '샴푸', category: 'bathroom', buyer: users[1], status: 'short', updatedAt: '2026.06.27' },
  { id: 'i6', name: '린스', category: 'bathroom', buyer: users[1], status: 'enough', updatedAt: '2026.06.27' },
  { id: 'i7', name: '키친타올', category: 'kitchen', buyer: users[2], status: 'empty', updatedAt: '2026.06.22' },
  { id: 'i8', name: '욕실 청소제', category: 'cleaning', buyer: users[0], status: 'enough', updatedAt: '2026.06.15' },
  { id: 'i9', name: '식기 세척제', category: 'kitchen', status: 'short', updatedAt: '2026.06.29' },
  { id: 'i10', name: '섬유 유연제', category: 'cleaning', buyer: users[2], status: 'enough', updatedAt: '2026.06.10' },
  { id: 'i11', name: '바디워시', category: 'bathroom', buyer: users[0], status: 'enough', updatedAt: '2026.06.08' },
  { id: 'i12', name: '지퍼백', category: 'kitchen', status: 'empty', updatedAt: '2026.06.20' },
];

// ==================== 생활 규칙 ====================

export const rules: Rule[] = [
  {
    id: 'r1',
    category: 'noise',
    title: '밤 11시 이후 조용히 하기',
    content: '통화와 음악은 이어폰을 사용하고 세탁기는 다음 날 사용해요.',
    registeredBy: users[1],
    registeredAt: '2026.06.20',
    agreement: { agreedCount: 3, totalCount: 3, agreedMembers: users },
    status: 'active',
  },
  {
    id: 'r2',
    category: 'visitor',
    title: '방문객은 하루 전 공유',
    content: '숙박이 필요한 경우 메신저에서 먼저 동의를 받아요.',
    registeredBy: users[0],
    registeredAt: '2026.06.18',
    agreement: { agreedCount: 2, totalCount: 3, agreedMembers: [users[0], users[1]] },
    status: 'active',
  },
  {
    id: 'r3',
    category: 'cleanliness',
    title: '개인 물건은 공용 공간에 두지 않기',
    content: '거실·주방 테이블 위에 개인 물건을 24시간 이상 두지 않아요.',
    registeredBy: users[2],
    registeredAt: '2026.06.15',
    agreement: { agreedCount: 3, totalCount: 3, agreedMembers: users },
    status: 'active',
  },
  {
    id: 'r4',
    category: 'trash',
    title: '분리수거는 정해진 날짜에',
    content: '수요일 오전 7시 이전에 각 재질별로 묶어서 내놓아요.',
    registeredBy: users[0],
    registeredAt: '2026.06.10',
    agreement: { agreedCount: 3, totalCount: 3, agreedMembers: users },
    status: 'active',
  },
  {
    id: 'r5',
    category: 'noise',
    title: '이른 아침(오전 7시 이전) 취사 자제',
    content: '환기 소리나 가스레인지 소리로 수면을 방해할 수 있어요.',
    registeredBy: users[1],
    registeredAt: '2026.06.05',
    agreement: { agreedCount: 2, totalCount: 3, agreedMembers: [users[0], users[1]] },
    status: 'active',
  },
  {
    id: 'r6',
    category: 'etc',
    title: '에어컨 온도는 26도 이상으로',
    content: '전기요금 절감을 위해 냉방 온도를 최소 26도로 설정해요.',
    registeredBy: users[2],
    registeredAt: '2026.05.28',
    agreement: { agreedCount: 1, totalCount: 3, agreedMembers: [users[2]] },
    status: 'inactive',
  },
  {
    id: 'r7',
    category: 'cleanliness',
    title: '사용 후 주방 깨끗이 정리',
    content: '요리 후 가스레인지·조리대를 닦고 설거지는 당일 완료해요.',
    registeredBy: users[0],
    registeredAt: '2026.05.20',
    agreement: { agreedCount: 3, totalCount: 3, agreedMembers: users },
    status: 'active',
  },
];

// ==================== 알림 ====================

export const notifications = [
  {
    id: 'n1',
    title: '정산 요청',
    message: '6월 전기요금 정산이 아직 2명 남았어요. 확인해 주세요.',
    time: '10분 전',
    status: 'unpaid' as const,
  },
  {
    id: 'n2',
    title: '오늘의 집안일',
    message: '김민준 님의 분리수거 차례입니다. 수요일 오전 안으로 완료해 주세요.',
    time: '1시간 전',
    status: 'pending' as const,
  },
  {
    id: 'n3',
    title: '공용 물품 부족',
    message: '화장지가 부족 상태로 변경되었습니다. 구매 담당자를 지정해 주세요.',
    time: '3시간 전',
    status: 'short' as const,
  },
  {
    id: 'n4',
    title: '정산 완료',
    message: '공용 장보기 정산이 모두 완료되었어요.',
    time: '어제 21:00',
    status: 'paid' as const,
  },
  {
    id: 'n5',
    title: '규칙 동의 요청',
    message: '박지후 님이 새 규칙 "에어컨 온도 26도 이상"을 등록했어요. 동의해 주세요.',
    time: '어제 18:30',
    status: 'pending' as const,
  },
  {
    id: 'n6',
    title: '집안일 완료',
    message: '박지후 님이 설거지 정리를 완료했어요.',
    time: '어제 15:00',
    status: 'done' as const,
  },
  {
    id: 'n7',
    title: '물품 소진',
    message: '종량제 봉투가 소진되었습니다. 빠른 구매가 필요해요.',
    time: '2일 전',
    status: 'empty' as const,
  },
  {
    id: 'n8',
    title: '정산 요청',
    message: '주방 세제·샴푸 구매 정산이 아직 2명 남았어요.',
    time: '3일 전',
    status: 'unpaid' as const,
  },
];

// ==================== 활동 내역 ====================

export const activities = [
  { id: 'a1', actorName: '이서연', description: '거실 청소 일정을 이번 주 토요일로 등록했어요.', timestamp: '오늘 09:20' },
  { id: 'a2', actorName: '김민준', description: '6월 전기요금 정산을 공유했어요.', timestamp: '어제 21:12' },
  { id: 'a3', actorName: '박지후', description: '화장지 상태를 부족으로 변경했어요.', timestamp: '어제 18:03' },
  { id: 'a4', actorName: '이서연', description: '공용 장보기 정산이 완료되었어요.', timestamp: '어제 15:40' },
  { id: 'a5', actorName: '박지후', description: '설거지 정리 집안일을 완료했어요.', timestamp: '어제 13:22' },
  { id: 'a6', actorName: '김민준', description: '"에어컨 26도 이상" 규칙에 동의하지 않았어요.', timestamp: '2일 전 20:10' },
  { id: 'a7', actorName: '이서연', description: '섬유 유연제 구매 담당자로 박지후 님을 지정했어요.', timestamp: '2일 전 11:05' },
  { id: 'a8', actorName: '박지후', description: '"에어컨 26도 이상" 생활 규칙을 새로 등록했어요.', timestamp: '3일 전 19:30' },
  { id: 'a9', actorName: '김민준', description: '공용 화장실 청소를 완료했어요.', timestamp: '3일 전 14:15' },
  { id: 'a10', actorName: '이서연', description: '6월 인터넷 요금 정산을 완료했어요.', timestamp: '4일 전 10:00' },
  { id: 'a11', actorName: '박지후', description: '키친타올 상태를 소진으로 변경했어요.', timestamp: '5일 전 17:20' },
  { id: 'a12', actorName: '김민준', description: '"방문객은 하루 전 공유" 규칙에 동의했어요.', timestamp: '6일 전 09:00' },
];

// ==================== 메신저 ====================

export const chatRooms = [
  {
    id: 'room-main',
    name: '우리집 전체방',
    lastMessage: '전기요금 정산 확인 부탁해요!',
    timestamp: '10:12',
    unreadCount: 2,
  },
  {
    id: 'room-chore',
    name: '집안일 공유',
    lastMessage: '이번 주 분리수거는 수요일입니다.',
    timestamp: '어제',
    unreadCount: 0,
  },
  {
    id: 'room-rule',
    name: '생활 규칙',
    lastMessage: '방문객 규칙 업데이트했어요.',
    timestamp: '월요일',
    unreadCount: 0,
  },
];

export interface ChatShareCard {
  type: 'expense' | 'chore' | 'item' | 'rule';
  title: string;
  description: string;
  actionLabel: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isMine: boolean;
  content?: string;
  shareCard?: ChatShareCard;
}

export const chatMessages: ChatMessage[] = [
  { id: 'm1', roomId: 'room-main', senderId: 'u2', senderName: '이서연', timestamp: '오전 10:02', isMine: false, content: '전기요금 정산 올렸어요. 확인 부탁해요!' },
  {
    id: 'm2',
    roomId: 'room-main',
    senderId: 'u1',
    senderName: '김민준',
    timestamp: '오전 10:04',
    isMine: false,
    shareCard: { type: 'expense', title: '6월 전기요금', description: '84,200원 · 2명 입금 대기', actionLabel: '정산하기' },
  },
  { id: 'm3', roomId: 'room-main', senderId: 'me', senderName: '나', timestamp: '오전 10:12', isMine: true, content: '확인했어요. 오늘 안으로 입금할게요!' },
  { id: 'm4', roomId: 'room-main', senderId: 'u3', senderName: '박지후', timestamp: '오전 11:00', isMine: false, content: '저도 오늘 이체할게요.' },
  {
    id: 'm5',
    roomId: 'room-main',
    senderId: 'u2',
    senderName: '이서연',
    timestamp: '오전 11:35',
    isMine: false,
    shareCard: { type: 'chore', title: '거실 청소', description: '이번 주 토요일 · 이서연 담당', actionLabel: '확인하기' },
  },
  { id: 'm6', roomId: 'room-main', senderId: 'me', senderName: '나', timestamp: '오전 11:40', isMine: true, content: '이번 주 토요일에 다 같이 청소해요!' },
  { id: 'm7', roomId: 'room-chore', senderId: 'u1', senderName: '김민준', timestamp: '어제 08:30', isMine: false, content: '이번 주 분리수거는 수요일입니다. 잊지 마세요!' },
  {
    id: 'm8',
    roomId: 'room-chore',
    senderId: 'u3',
    senderName: '박지후',
    timestamp: '어제 09:00',
    isMine: false,
    shareCard: { type: 'chore', title: '설거지 정리', description: '매일 · 박지후 담당', actionLabel: '확인하기' },
  },
];

// ==================== 그룹 정보 ====================

export const group = {
  id: 'g1',
  name: '서울 마포 쉐어하우스',
  address: '서울특별시 마포구 연남동 123-45',
  createdAt: '2026.03.15',
  memberCount: 3,
  members: users,
  ownerId: 'u1',
};

// ==================== 마이페이지 ====================

export const mypage = {
  user: currentUser,
  joinedAt: '2026.03.15',
  choreStats: {
    total: 52,
    done: 44,
    pending: 8,
  },
  expenseStats: {
    totalPaid: 94600,
    totalReceived: 67400,
  },
};
