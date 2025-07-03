import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, List, Tabs, Empty, Modal, message } from 'antd';
import { HomeOutlined, TrophyOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Child, RewardPunishItem, PointRecord } from '../types';
import { useAppContext } from '../context/AppContext'; // 导入 useAppContext

const { TabPane } = Tabs;

const ChildRecordPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { children, rewardItems, punishmentItems, records, addRecord, deleteRecord } = useAppContext(); // 从 context 获取数据和方法

  // 从全局状态查找当前孩子
  const child = children.find(c => c.id === childId);

  // 不再需要本地状态管理模拟数据
  // const [child, setChild] = useState<Child | null>(null);
  // const [rewardItems, setRewardItems] = useState<RewardPunishItem[]>([]);
  // const [punishmentItems, setPunishmentItems] = useState<RewardPunishItem[]>([]);
  // const [records, setRecords] = useState<PointRecord[]>([]);
  const [activeTab, setActiveTab] = useState('reward');
  const [selectedItem, setSelectedItem] = useState<RewardPunishItem | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // 移除模拟获取数据的 useEffect
  // useEffect(() => {
  //   // ... mock data setup ...
  // }, [childId]);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleItemClick = (item: RewardPunishItem) => {
    setSelectedItem(item);
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    if (!child || !selectedItem) return;

    // 使用 context 中的 addRecord 方法
    addRecord({
      childId: child.id,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      points: selectedItem.points,
      type: selectedItem.type,
    });

    // 不再需要手动更新本地状态
    // const newRecord: PointRecord = {
    //   id: Date.now().toString(),
    //   childId: child.id,
    //   itemId: selectedItem.id,
    //   itemName: selectedItem.name,
    //   points: selectedItem.points,
    //   date: new Date().toISOString(),
    //   type: selectedItem.type,
    // };
    // setRecords([newRecord, ...records]);
    // setChild({
    //   ...child,
    //   points: child.points + selectedItem.points,
    // });

    setIsConfirmModalOpen(false);
    message.success(`已${selectedItem.points > 0 ? '奖励' : '扣除'} ${Math.abs(selectedItem.points)} 分`);
  };

  if (!child) {
    return <Empty description="未找到孩子信息" />;
  }

  // 筛选当前孩子的记录
  const childRecords = records.filter(record => record.childId === child.id);

  return (
    <div className="child-record-page" style={{ padding: '20px', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Button
          type="text"
          icon={<HomeOutlined />}
          style={{
            fontSize: '24px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
          }}
          onClick={handleHomeClick}
        />
        <h1>{child.name} - {child.points}分</h1>
        <div style={{ width: '48px' }}></div> {/* 占位，保持标题居中 */}
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
      >
        <TabPane
          tab={<span><TrophyOutlined /> 奖励</span>}
          key="reward"
        >
          <List
            itemLayout="horizontal"
            dataSource={rewardItems} // 使用 context 中的 rewardItems
            renderItem={item => (
              <List.Item
                actions={[<Button type="primary" onClick={() => handleItemClick(item)}>奖励</Button>]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`+${item.points} 分`}
                />
              </List.Item>
            )}
            locale={{ emptyText: '暂无奖励项，请在设置中添加' }}
          />
        </TabPane>
        <TabPane
          tab={<span><CloseCircleOutlined /> 惩罚</span>}
          key="punishment"
        >
          <List
            itemLayout="horizontal"
            dataSource={punishmentItems} // 使用 context 中的 punishmentItems
            renderItem={item => (
              <List.Item
                actions={[<Button danger onClick={() => handleItemClick(item)}>惩罚</Button>]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`${item.points} 分`}
                />
              </List.Item>
            )}
            locale={{ emptyText: '暂无惩罚项，请在设置中添加' }}
          />
        </TabPane>
        <TabPane
          tab={<span>记录</span>}
          key="records"
        >
          <List
            itemLayout="horizontal"
            dataSource={childRecords} // 使用筛选后的记录
            renderItem={record => (
              <List.Item
                actions={[
                  <Button danger onClick={() => {
                    deleteRecord(record.id);
                    message.success('删除成功');
                  }}>删除</Button>
                ]}
              >
                <List.Item.Meta
                  title={record.itemName}
                  description={`${record.points > 0 ? '+' : ''}${record.points} 分 - ${new Date(record.date).toLocaleString()}`}
                />
              </List.Item>
            )}
            locale={{ emptyText: '暂无记录' }}
          />
        </TabPane>
      </Tabs>

      {/* 确认弹窗 */}
      <Modal
        title={selectedItem?.points > 0 ? '确认奖励' : '确认惩罚'}
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        onOk={handleConfirm}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要{selectedItem?.points > 0 ? '奖励' : '惩罚'} {child.name} 吗？</p>
        <p>{selectedItem?.name}: {selectedItem?.points > 0 ? '+' : ''}{selectedItem?.points} 分</p>
      </Modal>
    </div>
  );
};

export default ChildRecordPage;