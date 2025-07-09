import { createClient } from '@supabase/supabase-js'

// 这些是示例配置，需要替换为您的实际Supabase项目配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表名
export const TABLES = {
  CHILDREN: 'children',
  REWARD_PUNISH_ITEMS: 'reward_punish_items',
  POINT_RECORDS: 'point_records'
}

// 数据库操作函数
export const supabaseService = {
  // 孩子相关操作
  async getChildren() {
    const { data, error } = await supabase
      .from(TABLES.CHILDREN)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取孩子列表失败:', error)
      return []
    }
    
    return data || []
  },

  async addChild(child: { name: string; avatar?: string }) {
    const { data, error } = await supabase
      .from(TABLES.CHILDREN)
      .insert([{ ...child, points: 0 }])
      .select()
      .single()
    
    if (error) {
      console.error('添加孩子失败:', error)
      throw error
    }
    
    return data
  },

  async updateChild(id: string, updates: any) {
    const { data, error } = await supabase
      .from(TABLES.CHILDREN)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('更新孩子失败:', error)
      throw error
    }
    
    return data
  },

  async deleteChild(id: string) {
    const { error } = await supabase
      .from(TABLES.CHILDREN)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除孩子失败:', error)
      throw error
    }
  },

  // 奖励/惩罚项目操作
  async getRewardPunishItems() {
    const { data, error } = await supabase
      .from(TABLES.REWARD_PUNISH_ITEMS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取奖励/惩罚项目失败:', error)
      return []
    }
    
    return data || []
  },

  async addRewardPunishItem(item: { name: string; points: number; type: 'reward' | 'punishment' }) {
    const { data, error } = await supabase
      .from(TABLES.REWARD_PUNISH_ITEMS)
      .insert([item])
      .select()
      .single()
    
    if (error) {
      console.error('添加奖励/惩罚项目失败:', error)
      throw error
    }
    
    return data
  },

  async deleteRewardPunishItem(id: string) {
    const { error } = await supabase
      .from(TABLES.REWARD_PUNISH_ITEMS)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除奖励/惩罚项目失败:', error)
      throw error
    }
  },

  // 积分记录操作
  async getPointRecords() {
    const { data, error } = await supabase
      .from(TABLES.POINT_RECORDS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取积分记录失败:', error)
      return []
    }
    
    return data || []
  },

  async addPointRecord(record: {
    child_id: string;
    item_name: string;
    points: number;
    type: 'reward' | 'punishment';
  }) {
    const { data, error } = await supabase
      .from(TABLES.POINT_RECORDS)
      .insert([record])
      .select()
      .single()
    
    if (error) {
      console.error('添加积分记录失败:', error)
      throw error
    }
    
    return data
  },

  async deletePointRecord(id: string) {
    const { error } = await supabase
      .from(TABLES.POINT_RECORDS)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('删除积分记录失败:', error)
      throw error
    }
  }
}

// 实时订阅功能
export const subscribeToChanges = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe()
}

// 检查连接状态
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('children').select('count').limit(1)
    return !error
  } catch (error) {
    console.error('Supabase连接检查失败:', error)
    return false
  }
} 