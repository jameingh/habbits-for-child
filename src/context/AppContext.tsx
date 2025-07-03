import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Child, RewardPunishItem, PointRecord } from '../types';

interface AppContextType {
  children: Child[];
  rewardItems: RewardPunishItem[];
  punishmentItems: RewardPunishItem[];
  records: PointRecord[];
  addChild: (child: Omit<Child, 'id' | 'points'>) => void;
  updateChild: (child: Child) => void;
  deleteChild: (childId: string) => void;
  addRewardItem: (item: Omit<RewardPunishItem, 'id' | 'type'>) => void;
  addPunishmentItem: (item: Omit<RewardPunishItem, 'id' | 'type'>) => void;
  deleteRewardItem: (itemId: string) => void;
  deletePunishmentItem: (itemId: string) => void;
  addRecord: (record: Omit<PointRecord, 'id' | 'date'>) => void;
  deleteRecord: (recordId: string) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

// 安全的数据加载函数
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      console.log(`[数据加载] ${key}: 未找到存储数据，使用默认值`);
      return defaultValue;
    }
    const parsed = JSON.parse(stored);
    console.log(`[数据加载] ${key}: 成功加载 ${Array.isArray(parsed) ? parsed.length : 1} 条数据`);
    return parsed;
  } catch (error) {
    console.error(`[数据加载错误] ${key}:`, error);
    console.log(`[数据加载] ${key}: 使用默认值`);
    return defaultValue;
  }
};

// 安全的数据保存函数
const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    console.log(`[数据保存] ${key}: 成功保存 ${Array.isArray(data) ? data.length : 1} 条数据`);
  } catch (error) {
    console.error(`[数据保存错误] ${key}:`, error);
    // 如果是存储空间不足的错误，尝试清理旧数据
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('[存储空间不足] 尝试清理数据...');
      // 这里可以添加清理逻辑
    }
  }
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appChildren, setAppChildren] = useState<Child[]>([]);
  const [rewardItems, setRewardItems] = useState<RewardPunishItem[]>([]);
  const [punishmentItems, setPunishmentItems] = useState<RewardPunishItem[]>([]);
  const [records, setRecords] = useState<PointRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从本地存储加载数据
  useEffect(() => {
    console.log('[应用启动] 开始加载数据...');
    
    const storedChildren = loadFromStorage<Child[]>('children', []);
    const storedRewardItems = loadFromStorage<RewardPunishItem[]>('rewardItems', []);
    const storedPunishmentItems = loadFromStorage<RewardPunishItem[]>('punishmentItems', []);
    const storedRecords = loadFromStorage<PointRecord[]>('records', []);

    setAppChildren(storedChildren);
    setRewardItems(storedRewardItems);
    setPunishmentItems(storedPunishmentItems);
    setRecords(storedRecords);
    setIsLoaded(true);
    
    console.log('[应用启动] 数据加载完成');
    console.log(`[数据统计] 孩子: ${storedChildren.length}, 奖励项: ${storedRewardItems.length}, 惩罚项: ${storedPunishmentItems.length}, 记录: ${storedRecords.length}`);
  }, []);

  // 保存数据到本地存储 - 只在数据加载完成后才保存
  useEffect(() => {
    if (!isLoaded) return;
    
    saveToStorage('children', appChildren);
  }, [appChildren, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    
    saveToStorage('rewardItems', rewardItems);
  }, [rewardItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    
    saveToStorage('punishmentItems', punishmentItems);
  }, [punishmentItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    
    saveToStorage('records', records);
  }, [records, isLoaded]);

  const addChild = (childData: Omit<Child, 'id' | 'points'>) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
      points: 0,
    };
    setAppChildren([...appChildren, newChild]);
    console.log(`[添加孩子] ${newChild.name} (ID: ${newChild.id})`);
  };

  const updateChild = (updatedChild: Child) => {
    setAppChildren(appChildren.map(child => 
      child.id === updatedChild.id ? updatedChild : child
    ));
    console.log(`[更新孩子] ${updatedChild.name} - 积分: ${updatedChild.points}`);
  };

  const addRewardItem = (itemData: Omit<RewardPunishItem, 'id' | 'type'>) => {
    const newItem: RewardPunishItem = {
      ...itemData,
      id: Date.now().toString(),
      type: 'reward',
    };
    setRewardItems([...rewardItems, newItem]);
    console.log(`[添加奖励项] ${newItem.name} (+${newItem.points}分)`);
  };

  const addPunishmentItem = (itemData: Omit<RewardPunishItem, 'id' | 'type'>) => {
    const newItem: RewardPunishItem = {
      ...itemData,
      id: Date.now().toString(),
      type: 'punishment',
      points: -Math.abs(itemData.points), // 确保是负数
    };
    setPunishmentItems([...punishmentItems, newItem]);
    console.log(`[添加惩罚项] ${newItem.name} (${newItem.points}分)`);
  };

  const addRecord = (recordData: Omit<PointRecord, 'id' | 'date'>) => {
    const newRecord: PointRecord = {
      ...recordData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setRecords([newRecord, ...records]);

    // 更新孩子的积分
    const childToUpdate = appChildren.find(child => child.id === recordData.childId);
    if (childToUpdate) {
      const updatedChild = {
        ...childToUpdate,
        points: childToUpdate.points + recordData.points,
      };
      updateChild(updatedChild);
    }
    console.log(`[添加记录] ${recordData.itemName} (${recordData.points > 0 ? '+' : ''}${recordData.points}分)`);
  };

  const deleteChild = (childId: string) => {
    const childToDelete = appChildren.find(child => child.id === childId);
    setAppChildren(appChildren.filter(child => child.id !== childId));
    // 删除相关的记录
    setRecords(records.filter(record => record.childId !== childId));
    console.log(`[删除孩子] ${childToDelete?.name || childId}`);
  };

  const deleteRewardItem = (itemId: string) => {
    const itemToDelete = rewardItems.find(item => item.id === itemId);
    setRewardItems(rewardItems.filter(item => item.id !== itemId));
    console.log(`[删除奖励项] ${itemToDelete?.name || itemId}`);
  };

  const deletePunishmentItem = (itemId: string) => {
    const itemToDelete = punishmentItems.find(item => item.id === itemId);
    setPunishmentItems(punishmentItems.filter(item => item.id !== itemId));
    console.log(`[删除惩罚项] ${itemToDelete?.name || itemId}`);
  };

  const deleteRecord = (recordId: string) => {
    const recordToDelete = records.find(record => record.id === recordId);
    if (recordToDelete) {
      // 更新孩子的积分
      const childToUpdate = appChildren.find(child => child.id === recordToDelete.childId);
      if (childToUpdate) {
        const updatedChild = {
          ...childToUpdate,
          points: childToUpdate.points - recordToDelete.points, // 减去记录的分数
        };
        updateChild(updatedChild);
      }
      setRecords(records.filter(record => record.id !== recordId));
      console.log(`[删除记录] ${recordToDelete.itemName} (${recordToDelete.points > 0 ? '+' : ''}${recordToDelete.points}分)`);
    }
  };

  // 清空所有数据
  const clearAllData = () => {
    setAppChildren([]);
    setRewardItems([]);
    setPunishmentItems([]);
    setRecords([]);
    localStorage.removeItem('children');
    localStorage.removeItem('rewardItems');
    localStorage.removeItem('punishmentItems');
    localStorage.removeItem('records');
    console.log('[清空数据] 所有数据已清空');
  };

  // 导出数据
  const exportData = (): string => {
    const data = {
      children: appChildren,
      rewardItems,
      punishmentItems,
      records,
      exportTime: new Date().toISOString(),
    };
    const jsonString = JSON.stringify(data, null, 2);
    console.log('[导出数据] 数据已导出');
    return jsonString;
  };

  // 导入数据
  const importData = (dataString: string): boolean => {
    try {
      const data = JSON.parse(dataString);
      
      // 验证数据格式
      if (!data.children || !Array.isArray(data.children)) {
        throw new Error('无效的数据格式：缺少children数组');
      }
      
      setAppChildren(data.children || []);
      setRewardItems(data.rewardItems || []);
      setPunishmentItems(data.punishmentItems || []);
      setRecords(data.records || []);
      
      console.log('[导入数据] 数据导入成功');
      console.log(`[导入统计] 孩子: ${data.children.length}, 奖励项: ${data.rewardItems?.length || 0}, 惩罚项: ${data.punishmentItems?.length || 0}, 记录: ${data.records?.length || 0}`);
      
      return true;
    } catch (error) {
      console.error('[导入数据错误]', error);
      return false;
    }
  };

  const value = {
    children: appChildren,
    rewardItems,
    punishmentItems,
    records,
    addChild,
    updateChild,
    deleteChild,
    addRewardItem,
    addPunishmentItem,
    deleteRewardItem,
    deletePunishmentItem,
    addRecord,
    deleteRecord,
    clearAllData,
    exportData,
    importData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};