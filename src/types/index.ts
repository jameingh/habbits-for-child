// 定义应用中使用的类型

// 孩子信息类型
export interface Child {
  id: string;
  name: string;
  avatar?: string;
  points: number;
}

// 奖惩项类型
export interface RewardPunishItem {
  id: string;
  name: string;
  icon?: string;
  points: number; // 正数表示奖励，负数表示惩罚
  type: 'reward' | 'punishment';
}

// 积分记录类型
export interface PointRecord {
  id: string;
  childId: string;
  itemId: string;
  itemName: string;
  points: number; // 正数表示奖励，负数表示惩罚
  date: string;
  type: 'reward' | 'punishment';
}