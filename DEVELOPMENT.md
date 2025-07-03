# 开发文档

## 项目架构

### 技术选型说明

- **React 19.1.0**：使用最新版本的React，支持并发特性和新的Hooks
- **TypeScript**：提供类型安全，减少运行时错误
- **Vite**：快速的开发服务器和构建工具
- **Ant Design**：企业级UI组件库，提供丰富的组件
- **React Router**：客户端路由管理
- **Context API**：轻量级状态管理方案

### 目录结构详解

```
src/
├── components/              # 可复用组件
│   └── ChildAvatar.tsx     # 孩子头像展示组件
├── context/                # 全局状态管理
│   └── AppContext.tsx      # 应用主要状态和方法
├── pages/                  # 页面组件
│   ├── HomePage.tsx        # 首页 - 孩子列表
│   ├── SettingsPage.tsx    # 设置页 - 奖励惩罚项管理
│   ├── ChildRecordPage.tsx # 记录页 - 单个孩子的积分操作
│   └── DataManagePage.tsx  # 数据管理页 - 导入导出功能
├── types/                  # TypeScript类型定义
│   └── index.ts           # 全局类型声明
├── assets/                # 静态资源
├── App.tsx                # 根组件 - 路由配置
├── main.tsx              # 应用入口
├── index.css             # 全局样式
└── vite-env.d.ts         # Vite类型声明
```

## 状态管理

### AppContext结构

```typescript
interface AppContextType {
  // 数据状态
  children: Child[];
  rewardItems: RewardPunishItem[];
  punishmentItems: RewardPunishItem[];
  records: PointRecord[];
  
  // 孩子管理
  addChild: (child: Omit<Child, 'id' | 'points'>) => void;
  updateChild: (child: Child) => void;
  deleteChild: (childId: string) => void;
  
  // 奖励项管理
  addRewardItem: (item: Omit<RewardPunishItem, 'id' | 'type'>) => void;
  deleteRewardItem: (itemId: string) => void;
  
  // 惩罚项管理
  addPunishmentItem: (item: Omit<RewardPunishItem, 'id' | 'type'>) => void;
  deletePunishmentItem: (itemId: string) => void;
  
  // 记录管理
  addRecord: (record: Omit<PointRecord, 'id' | 'date'>) => void;
  deleteRecord: (recordId: string) => void;
  
  // 数据管理
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
}
```

### 数据流

1. **用户操作** → 2. **Context方法调用** → 3. **状态更新** → 4. **自动持久化** → 5. **UI更新**

## 数据持久化

### 存储机制

- **存储方式**：localStorage
- **存储键名**：
  - `children` - 孩子列表
  - `rewardItems` - 奖励项目
  - `punishmentItems` - 惩罚项目  
  - `records` - 积分记录

### 数据同步策略

1. **加载时机**：应用启动时自动加载
2. **保存时机**：数据变化时自动保存
3. **错误处理**：JSON解析失败时使用默认值
4. **防重复保存**：通过`isLoaded`标志避免初始化时的重复保存

### 数据格式

```typescript
// 导出的数据格式
interface ExportData {
  children: Child[];
  rewardItems: RewardPunishItem[];
  punishmentItems: RewardPunishItem[];
  records: PointRecord[];
  exportTime: string;
}
```

## 组件设计

### 组件层次结构

```
App
├── Router
    ├── HomePage
    │   └── ChildAvatar (多个)
    ├── SettingsPage
    │   └── Tabs
    │       ├── RewardList
    │       ├── PunishmentList
    │       └── DataManagement
    ├── ChildRecordPage
    │   └── Tabs
    │       ├── RewardList
    │       ├── PunishmentList
    │       └── RecordList
    └── DataManagePage
        ├── StatisticCards
        ├── DataOperations
        └── Modals
```

### 组件职责

- **ChildAvatar**：展示孩子信息和积分，处理点击事件
- **页面组件**：负责布局和用户交互
- **列表组件**：展示数据列表和操作按钮
- **表单组件**：处理用户输入和数据验证

## 路由设计

```typescript
const routes = [
  { path: '/', component: HomePage },           // 首页
  { path: '/settings', component: SettingsPage }, // 设置
  { path: '/child/:childId', component: ChildRecordPage }, // 孩子记录
  { path: '/data-manage', component: DataManagePage }      // 数据管理
];
```

## 开发工作流

### 本地开发

1. 克隆项目：`git clone <repository-url>`
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 打开浏览器访问：`http://localhost:5173`

### 代码规范

- 使用TypeScript严格模式
- 遵循React Hooks规范
- 使用ESLint进行代码检查
- 组件使用函数式组件和Hooks
- 状态管理使用Context API

### 调试技巧

1. **控制台日志**：所有数据操作都有详细日志
2. **React DevTools**：查看组件状态和props
3. **网络面板**：检查资源加载情况
4. **Application面板**：查看localStorage数据

### 性能优化

- 使用React.memo优化组件渲染
- 合理使用useCallback和useMemo
- 避免不必要的状态更新
- 图片资源优化

## 部署

### 构建生产版本

```bash
npm run build
```

### 部署到静态服务器

构建后的文件在`dist`目录中，可以部署到任何静态文件服务器：

- GitHub Pages
- Netlify
- Vercel
- 阿里云OSS
- 腾讯云COS

### 环境变量

项目支持以下环境变量：

- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_VERSION` - 应用版本

## 测试

### 测试策略

- 单元测试：组件和工具函数
- 集成测试：页面功能流程
- 端到端测试：完整用户场景

### 测试工具

- Jest：单元测试框架
- React Testing Library：React组件测试
- Cypress：端到端测试

## 贡献指南

1. Fork项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送到分支：`git push origin feature/new-feature`
5. 创建Pull Request

## 常见问题

### Q: 数据丢失怎么办？
A: 检查浏览器是否清除了localStorage，建议定期导出数据备份。

### Q: 如何添加新的奖励类型？
A: 在`types/index.ts`中扩展`RewardPunishItem`接口，然后在相应组件中添加UI。

### Q: 如何自定义主题？
A: 修改`App.tsx`中的ConfigProvider配置，或者在CSS中覆盖Ant Design的样式变量。

### Q: 如何添加多语言支持？
A: 可以使用react-i18next库，在Context中添加语言状态管理。 