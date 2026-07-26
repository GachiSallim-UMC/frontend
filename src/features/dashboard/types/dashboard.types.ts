export interface DashboardSummaryDto {
  todayChoreCount: number;
  unfinishedChoreCount: number;
  unsettledAmount: number;
  unsettledExpenseCount: number;
  lowSupplyCount: number;
  unreadMessageCount: number;
}

export interface DashboardChoreDto {
  choreId: number;
  title: string;
  assigneeName: string;
  repeatText: string;
  status: string;
}

export interface DashboardExpenseDto {
  expenseId: number;
  title: string;
  payerName: string;
  amountPerPerson: number;
  status: string;
  category?: string;
}

export interface DashboardSupplyDto {
  supplyId: number;
  name: string;
  status: string;
  assigneeName: string;
  category?: string;
}

export interface DashboardActivityDto {
  activityId: number;
  actorName: string;
  actorProfileImage: string | null;
  message: string;
  detail: string;
  createdAt: string;
}

export interface DashboardResponsePayloadDto {
  summary: DashboardSummaryDto;
  todayChores: DashboardChoreDto[];
  unsettledExpenses: DashboardExpenseDto[];
  lowSupplies: DashboardSupplyDto[];
  recentActivities: DashboardActivityDto[];
}

export interface DashboardApiResponse {
  statusCode: number;
  data: DashboardResponsePayloadDto;
  error: string | null;
}