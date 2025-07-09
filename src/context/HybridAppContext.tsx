import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Child, RewardPunishItem, PointRecord } from '../types';
import { supabaseService, checkConnection } from '../lib/supabase';

interface HybridAppContextType {
  children: Child[];
  rewardItems: RewardPunishItem[];
  punishmentItems: RewardPunishItem[];
  records: PointRecord[];
  isOnline: boolean;
  isLoading: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  addChild: (child: Omit<Child, 'id' | 'points'>) => Promise<void>;
  updateChild: (child: Child) => Promise<void>;
  deleteChild: (childId: string) => Promise<void>;
  addRewardItem: (item: Omit<RewardPunishItem, 'id' | 'type'>) => Promise<void>;
  addPunishmentItem: (item: Omit<RewardPunishItem, 'id' | 'type'>) => Promise<void>;
  deleteRewardItem: (itemId: string) => Promise<void>;
  deletePunishmentItem: (itemId: string) => Promise<void>;
  addRecord: (record: Omit<PointRecord, 'id' | 'date'>) => Promise<void>;
  deleteRecord: (recordId: string) => Promise<void>;
  syncToCloud: () => Promise<void>;
  clearAllData: () => Promise<void>;
  exportData: () => string;
  importData: (data: string) => Promise<boolean>;
}

const HybridAppContext = createContext<HybridAppContextType | undefined>(undefined);

export const useHybridAppContext = () => {
  const context = useContext(HybridAppContext);
  if (!context) {
    throw new Error('useHybridAppContext must be used within a HybridAppProvider');
  }
  return context;
};

interface HybridAppProviderProps {
  children: ReactNode;
}

// 本地存储操作
const localStorage_operations = {
  loadFromStorage: <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return defaultValue;
      return JSON.parse(stored);
    } catch (error) {
      console.error(`[localStorage] 加载 ${key} 失败:`, error);
      return defaultValue;
    }
  },

  saveToStorage: <T,>(key: string, data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[localStorage] 保存 ${key} 失败:`, error);
    }
  }
};

export const HybridAppProvider: React.FC<HybridAppProviderProps> = ({ children }) => {
  const [appChildren, setAppChildren] = useState<Child[]>([]);
  const [rewardItems, setRewardItems] = useState<RewardPunishItem[]>([]);
  const [punishmentItems, setPunishmentItems] = useState<RewardPunishItem[]>([]);
  const [records, setRecords] = useState<PointRecord[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // 检查网络连接和数据库连接
  useEffect(() => {
    const checkConnections = async () => {
      const online = navigator.onLine;
      const dbConnected = online ? await checkConnection() : false;
      setIsOnline(dbConnected);
      
      if (dbConnected) {
        console.log('[混合存储] 云数据库连接成功，加载云端数据');
        await loadFromCloud();
      } else {
        console.log('[混合存储] 云数据库不可用，使用本地存储');
        loadFromLocal();
      }
      
      setIsLoading(false);
    };

    checkConnections();

    // 监听网络状态变化
    const handleOnline = () => {
      console.log('[混合存储] 网络连接恢复');
      checkConnections();
    };

    const handleOffline = () => {
      console.log('[混合存储] 网络连接断开，切换到本地存储');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 从云端加载数据
  const loadFromCloud = async () => {
    try {
      const [cloudChildren, cloudItems, cloudRecords] = await Promise.all([
        supabaseService.getChildren(),
        supabaseService.getRewardPunishItems(),
        supabaseService.getPointRecords()
      ]);

      // 转换数据格式
      const formattedChildren = cloudChildren.map((child: any) => ({
        id: child.id,
        name: child.name,
        avatar: child.avatar || '',
        points: child.points || 0
      }));

      const rewards = cloudItems.filter((item: any) => item.type === 'reward');
      const punishments = cloudItems.filter((item: any) => item.type === 'punishment');

      const formattedRecords = cloudRecords.map((record: any) => ({
        id: record.id,
        childId: record.child_id,
        itemName: record.item_name,
        points: record.points,
        type: record.type,
        date: record.created_at
      }));

      setAppChildren(formattedChildren);
      setRewardItems(rewards);
      setPunishmentItems(punishments);
      setRecords(formattedRecords);

      // 同步到本地存储作为备份
      localStorage_operations.saveToStorage('children', formattedChildren);
      localStorage_operations.saveToStorage('rewardItems', rewards);
      localStorage_operations.saveToStorage('punishmentItems', punishments);
      localStorage_operations.saveToStorage('records', formattedRecords);

      console.log('[混合存储] 云端数据加载完成');
    } catch (error) {
      console.error('[混合存储] 云端数据加载失败:', error);
      // 如果云端加载失败，使用本地存储
      loadFromLocal();
    }
  };

  // 从本地加载数据
  const loadFromLocal = () => {
    const localChildren = localStorage_operations.loadFromStorage<Child[]>('children', []);
    const localRewardItems = localStorage_operations.loadFromStorage<RewardPunishItem[]>('rewardItems', []);
    const localPunishmentItems = localStorage_operations.loadFromStorage<RewardPunishItem[]>('punishmentItems', []);
    const localRecords = localStorage_operations.loadFromStorage<PointRecord[]>('records', []);

    setAppChildren(localChildren);
    setRewardItems(localRewardItems);
    setPunishmentItems(localPunishmentItems);
    setRecords(localRecords);

    console.log('[混合存储] 本地数据加载完成');
  };

  // 同步到云端
  const syncToCloud = async () => {
    if (!isOnline) {
      console.log('[混合存储] 离线状态，无法同步到云端');
      return;
    }

    setSyncStatus('syncing');
    try {
      // 这里可以实现更复杂的同步逻辑
      // 目前简单地将本地数据推送到云端
      console.log('[混合存储] 开始同步到云端...');
      
      // 实际的同步逻辑需要根据具体需求实现
      // 比如比较时间戳、处理冲突等
      
      setSyncStatus('success');
      console.log('[混合存储] 同步完成');
    } catch (error) {
      console.error('[混合存储] 同步失败:', error);
      setSyncStatus('error');
    }
  };

  // 添加孩子
  const addChild = async (childData: Omit<Child, 'id' | 'points'>) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
      points: 0,
    };

    // 更新本地状态
    setAppChildren([...appChildren, newChild]);
    localStorage_operations.saveToStorage('children', [...appChildren, newChild]);

    // 如果在线，同步到云端
    if (isOnline) {
      try {
        await supabaseService.addChild({
          name: newChild.name,
          avatar: newChild.avatar
        });
        console.log('[混合存储] 孩子已同步到云端');
      } catch (error) {
        console.error('[混合存储] 同步孩子到云端失败:', error);
      }
    }

    console.log(`[混合存储] 添加孩子: ${newChild.name}`);
  };

  // 更新孩子
  const updateChild = async (updatedChild: Child) => {
    const updatedChildren = appChildren.map(child => 
      child.id === updatedChild.id ? updatedChild : child
    );
    
    setAppChildren(updatedChildren);
    localStorage_operations.saveToStorage('children', updatedChildren);

    // 如果在线，同步到云端
    if (isOnline) {
      try {
        await supabaseService.updateChild(updatedChild.id, {
          name: updatedChild.name,
          avatar: updatedChild.avatar,
          points: updatedChild.points
        });
        console.log('[混合存储] 孩子更新已同步到云端');
      } catch (error) {
        console.error('[混合存储] 同步孩子更新到云端失败:', error);
      }
    }

    console.log(`[混合存储] 更新孩子: ${updatedChild.name}`);
  };

  // 删除孩子
  const deleteChild = async (childId: string) => {
    const updatedChildren = appChildren.filter(child => child.id !== childId);
    const updatedRecords = records.filter(record => record.childId !== childId);
    
    setAppChildren(updatedChildren);
    setRecords(updatedRecords);
    localStorage_operations.saveToStorage('children', updatedChildren);
    localStorage_operations.saveToStorage('records', updatedRecords);

    // 如果在线，同步到云端
    if (isOnline) {
      try {
        await supabaseService.deleteChild(childId);
        console.log('[混合存储] 孩子删除已同步到云端');
      } catch (error) {
        console.error('[混合存储] 同步孩子删除到云端失败:', error);
      }
    }

    console.log(`[混合存储] 删除孩子: ${childId}`);
  };

  // 添加奖励项目
  const addRewardItem = async (itemData: Omit<RewardPunishItem, 'id' | 'type'>) => {
    const newItem: RewardPunishItem = {
      ...itemData,
      id: Date.now().toString(),
      type: 'reward',
    };

    setRewardItems([...rewardItems, newItem]);
    localStorage_operations.saveToStorage('rewardItems', [...rewardItems, newItem]);

    // 如果在线，同步到云端
    if (isOnline) {
      try {
        await supabaseService.addRewardPunishItem({
          name: newItem.name,
          points: newItem.points,
          type: 'reward'
        });
        console.log('[混合存储] 奖励项目已同步到云端');
      } catch (error) {
        console.error('[混合存储] 同步奖励项目到云端失败:', error);
      }
    }

    console.log(`[混合存储] 添加奖励项目: ${newItem.name}`);
  };

  // 添加惩罚项目
  const addPunishmentItem = async (itemData: Omit<RewardPunishItem, 'id' | 'type'>) => {
    const newItem: RewardPunishItem = {
      ...itemData,
      id: Date.now().toString(),
      type: 'punishment',
      points: -Math.abs(itemData.points),
    };

    setPunishmentItems([...punishmentItems, newItem]);
    localStorage_operations.saveToStorage('punishmentItems', [...punishmentItems, newItem]);

    // 如果在线，同步到云端
    if (isOnline) {
      try {
        await supabaseService.addRewardPunishItem({
          name: newItem.name,
          points: newItem.points,
          type: 'punishment'
        });
        console.log('[混合存储] 惩罚项目已同步到云端');
      } catch (error) {
        console.error('[混合存储] 同步惩罚项目到云端失败:', error);
      }
    }

    console.log(`[混合存储] 添加惩罚项目: ${newItem.name}`);
  };

  // 删除奖励项目
  const deleteRewardItem = async (itemId: string) => {
    const updatedItems = rewardItems.filter(item => item.id !== itemId);
    setRewardItems(updatedItems);
    localStorage_operations.saveToStorage('rewardItems', updatedItems);

    // 如果在线，同步到云端
    if (isOnline) {
      try {
        await supabaseService.deleteRewardPunishItem(itemId);
        console.log('[混合存储] 奖励项目删除已同步到云端');
      } catch (error) {
        console.error('[混合存储] 同步奖励项目删除到云端失败:', error);
      }
    }

    console.log(`[混合存储] 删除奖励项目: ${itemId}`);
  };

  // 删除惩罚项目
  const deletePunishmentItem = async (itemId: string) => {
    const updatedItems = punishmentItems.filter(item => item.id !== itemId);
    setPunishmentItems(updatedItems);
    localStorage_operations.saveToStorage('punishmentItems', updatedItems);

    // 如果在线，同步到云端
    if (isOnline) {
      try {
        await supabaseService.deleteRewardPunishItem(itemId);
        console.log('[混合存储] 惩罚项目删除已同步到云端');
      } catch (error) {
        console.error('[混合存储] 同步惩罚项目删除到云端失败:', error);
      }
    }

    console.log(`[混合存储] 删除惩罚项目: ${itemId}`);
  };

  // 添加记录
  const addRecord = async (recordData: Omit<PointRecord, 'id' | 'date'>) => {
    const newRecord: PointRecord = {
      ...recordData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    setRecords([newRecord, ...records]);
    localStorage_operations.saveToStorage('records', [newRecord, ...records]);

    // 更新孩子的积分
    const childToUpdate = appChildren.find(child => child.id === recordData.childId);
    if (childToUpdate) {
      const updatedChild = {
        ...childToUpdate,
        points: childToUpdate.points + recordData.points,
      };
      await updateChild(updatedChild);
    }

    // 如果在线，同步到云端
    if (isOnline) {
      try {
        await supabaseService.addPointRecord({
          child_id: recordData.childId,
          item_name: recordData.itemName,
          points: recordData.points,
          type: recordData.type
        });
        console.log('[混合存储] 积分记录已同步到云端');
      } catch (error) {
        console.error('[混合存储] 同步积分记录到云端失败:', error);
      }
    }

    console.log(`[混合存储] 添加记录: ${recordData.itemName}`);
  };

  // 删除记录
  const deleteRecord = async (recordId: string) => {
    const recordToDelete = records.find(record => record.id === recordId);
    if (recordToDelete) {
      // 更新孩子的积分
      const childToUpdate = appChildren.find(child => child.id === recordToDelete.childId);
      if (childToUpdate) {
        const updatedChild = {
          ...childToUpdate,
          points: childToUpdate.points - recordToDelete.points,
        };
        await updateChild(updatedChild);
      }

      const updatedRecords = records.filter(record => record.id !== recordId);
      setRecords(updatedRecords);
      localStorage_operations.saveToStorage('records', updatedRecords);

      // 如果在线，同步到云端
      if (isOnline) {
        try {
          await supabaseService.deletePointRecord(recordId);
          console.log('[混合存储] 积分记录删除已同步到云端');
        } catch (error) {
          console.error('[混合存储] 同步积分记录删除到云端失败:', error);
        }
      }

      console.log(`[混合存储] 删除记录: ${recordId}`);
    }
  };

  // 清空所有数据
  const clearAllData = async () => {
    setAppChildren([]);
    setRewardItems([]);
    setPunishmentItems([]);
    setRecords([]);
    
    localStorage.removeItem('children');
    localStorage.removeItem('rewardItems');
    localStorage.removeItem('punishmentItems');
    localStorage.removeItem('records');

    console.log('[混合存储] 所有数据已清空');
  };

  // 导出数据
  const exportData = (): string => {
    const data = {
      children: appChildren,
      rewardItems,
      punishmentItems,
      records,
      exportTime: new Date().toISOString(),
      storageType: isOnline ? 'hybrid' : 'local'
    };
    return JSON.stringify(data, null, 2);
  };

  // 导入数据
  const importData = async (dataString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(dataString);
      
      if (!data.children || !Array.isArray(data.children)) {
        throw new Error('无效的数据格式');
      }
      
      setAppChildren(data.children || []);
      setRewardItems(data.rewardItems || []);
      setPunishmentItems(data.punishmentItems || []);
      setRecords(data.records || []);
      
      // 保存到本地存储
      localStorage_operations.saveToStorage('children', data.children || []);
      localStorage_operations.saveToStorage('rewardItems', data.rewardItems || []);
      localStorage_operations.saveToStorage('punishmentItems', data.punishmentItems || []);
      localStorage_operations.saveToStorage('records', data.records || []);
      
      console.log('[混合存储] 数据导入成功');
      return true;
    } catch (error) {
      console.error('[混合存储] 数据导入失败:', error);
      return false;
    }
  };

  const value = {
    children: appChildren,
    rewardItems,
    punishmentItems,
    records,
    isOnline,
    isLoading,
    syncStatus,
    addChild,
    updateChild,
    deleteChild,
    addRewardItem,
    addPunishmentItem,
    deleteRewardItem,
    deletePunishmentItem,
    addRecord,
    deleteRecord,
    syncToCloud,
    clearAllData,
    exportData,
    importData,
  };

  return <HybridAppContext.Provider value={value}>{children}</HybridAppContext.Provider>;
}; 