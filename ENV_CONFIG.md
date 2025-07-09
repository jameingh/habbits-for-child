# 环境变量配置说明

## Supabase 配置

创建 `.env.local` 文件并添加以下配置：

```bash
# Supabase 配置
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 获取 Supabase 配置信息

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目或选择现有项目
3. 在项目仪表板中，点击左侧的 "Settings" → "API"
4. 复制以下信息：
   - **Project URL**: 替换 `your-supabase-project-url`
   - **anon public key**: 替换 `your-supabase-anon-key`

## 数据库表结构

在 Supabase 的 SQL 编辑器中执行以下 SQL 创建表：

```sql
-- 创建孩子表
CREATE TABLE children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建奖励/惩罚项目表
CREATE TABLE reward_punish_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reward', 'punishment')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建积分记录表
CREATE TABLE point_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reward', 'punishment')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用实时功能（可选）
ALTER PUBLICATION supabase_realtime ADD TABLE children;
ALTER PUBLICATION supabase_realtime ADD TABLE reward_punish_items;
ALTER PUBLICATION supabase_realtime ADD TABLE point_records;
```

## 使用说明

1. **创建配置文件**：
   ```bash
   cp ENV_CONFIG.md .env.local
   # 编辑 .env.local 文件，填入实际配置
   ```

2. **重启开发服务器**：
   ```bash
   npm run dev
   ```

3. **验证连接**：
   - 打开浏览器开发者工具
   - 查看控制台是否有连接成功的消息
   - 如果连接失败，应用会自动降级到本地存储

## 混合存储模式

应用支持混合存储模式：

- **在线模式**：数据同步到 Supabase 云数据库
- **离线模式**：数据保存到浏览器本地存储
- **自动切换**：根据网络状态自动选择存储方式
- **数据同步**：网络恢复后自动同步本地数据到云端

## 故障排除

### 连接失败
- 检查 `.env.local` 文件是否存在
- 确认 URL 和 Key 是否正确
- 检查 Supabase 项目是否正常运行

### 数据不同步
- 检查网络连接
- 查看浏览器控制台错误信息
- 确认数据库表是否正确创建

### 权限问题
- 确保 Supabase 项目的 RLS (Row Level Security) 配置正确
- 检查 API 密钥权限 