# 儿童习惯养成积分奖励系统

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF.svg)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.24.7-1890FF.svg)](https://ant.design/)

一个基于React + TypeScript的现代化儿童习惯养成积分奖励管理系统，帮助家长通过积分机制培养孩子的良好习惯。

## 🌟 功能特性

### 核心功能
- **多孩子管理**：支持添加多个孩子，独立管理每个孩子的积分
- **积分系统**：完整的积分奖励和惩罚机制
- **习惯追踪**：记录每次奖励和惩罚的详细信息
- **数据持久化**：基于localStorage的本地数据存储，重启后数据不丢失

### 管理功能
- **奖励项目管理**：自定义奖励项目和对应积分
- **惩罚项目管理**：自定义惩罚项目和对应扣分
- **积分记录**：完整的积分变动历史记录
- **数据管理**：数据导出、导入、备份和清理功能

### 用户体验
- **响应式设计**：适配各种屏幕尺寸
- **直观界面**：简洁易用的用户界面
- **实时反馈**：操作结果即时显示
- **中文界面**：完全中文化的用户界面

## 🚀 技术栈

- **前端框架**：React 19.1.0
- **类型检查**：TypeScript 5.7.2
- **构建工具**：Vite 6.3.1
- **UI组件库**：Ant Design 5.24.7
- **路由管理**：React Router DOM 7.5.1
- **状态管理**：React Context API
- **数据持久化**：localStorage API

## 📦 项目结构

```
src/
├── components/          # 可复用组件
│   └── ChildAvatar.tsx  # 孩子头像组件
├── context/             # 全局状态管理
│   └── AppContext.tsx   # 应用上下文
├── pages/               # 页面组件
│   ├── HomePage.tsx     # 首页
│   ├── SettingsPage.tsx # 设置页面
│   ├── ChildRecordPage.tsx # 孩子记录页面
│   └── DataManagePage.tsx  # 数据管理页面
├── types/               # TypeScript类型定义
│   └── index.ts         # 类型声明
├── App.tsx              # 应用根组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 🛠️ 安装与运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 📱 使用指南

### 基本使用流程

1. **添加孩子**
   - 在首页点击"+"按钮添加孩子
   - 输入孩子姓名并保存

2. **设置奖励和惩罚项目**
   - 进入设置页面
   - 在"奖励项"标签页添加奖励项目和对应积分
   - 在"惩罚项"标签页添加惩罚项目和对应扣分

3. **记录积分变动**
   - 点击孩子头像进入记录页面
   - 选择相应的奖励或惩罚项目
   - 系统自动更新积分并记录历史

4. **查看记录**
   - 在孩子记录页面的"记录"标签查看历史
   - 可以删除错误的记录

### 数据管理

1. **数据备份**
   - 进入数据管理页面
   - 点击"导出数据"按钮
   - 下载JSON文件或复制到剪贴板

2. **数据恢复**
   - 在数据管理页面点击"导入数据"
   - 粘贴JSON数据或选择文件上传
   - 确认导入覆盖当前数据

3. **数据清理**
   - 在数据管理页面点击"清空所有数据"
   - 确认操作后清空所有数据

## 🔧 开发说明

### 数据结构

```typescript
// 孩子信息
interface Child {
  id: string;
  name: string;
  avatar?: string;
  points: number;
}

// 奖励/惩罚项目
interface RewardPunishItem {
  id: string;
  name: string;
  icon?: string;
  points: number;
  type: 'reward' | 'punishment';
}

// 积分记录
interface PointRecord {
  id: string;
  childId: string;
  itemId: string;
  itemName: string;
  points: number;
  date: string;
  type: 'reward' | 'punishment';
}
```

### 状态管理

项目使用React Context API进行全局状态管理，主要包括：
- 孩子列表管理
- 奖励项目管理
- 惩罚项目管理
- 积分记录管理
- 数据持久化操作

### 数据持久化

- 使用localStorage存储数据
- 自动加载和保存机制
- 错误处理和恢复
- 支持数据导出和导入

## 🐛 调试

### 查看数据状态
打开浏览器开发者工具的控制台，可以看到详细的数据操作日志：
- `[数据加载]` - 数据加载日志
- `[数据保存]` - 数据保存日志
- `[添加孩子]` - 添加孩子日志
- `[添加记录]` - 添加记录日志

### 常见问题
1. **数据丢失**：检查浏览器是否清除了localStorage
2. **导入失败**：确认JSON数据格式正确
3. **积分不更新**：检查控制台是否有错误日志

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue：[项目Issues页面]
- 邮箱：[您的邮箱]

---

**注意**：本项目仅用于学习和个人使用，数据存储在本地浏览器中，请定期备份重要数据。
