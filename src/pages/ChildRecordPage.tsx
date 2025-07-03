import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, List, Tabs, Empty, Modal, message, Card, Typography, Space, Avatar, Tag, Divider } from 'antd';
import { HomeOutlined, TrophyOutlined, CloseCircleOutlined, HistoryOutlined, UserOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import { Child, RewardPunishItem, PointRecord } from '../types';
import { useAppContext } from '../context/AppContext';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const ChildRecordPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { children, rewardItems, punishmentItems, records, addRecord, deleteRecord } = useAppContext();

  // 从全局状态查找当前孩子
  const child = children.find(c => c.id === childId);

  const [activeTab, setActiveTab] = useState('reward');
  const [selectedItem, setSelectedItem] = useState<RewardPunishItem | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleItemClick = (item: RewardPunishItem) => {
    setSelectedItem(item);
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    if (!child || !selectedItem) return;

    addRecord({
      childId: child.id,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      points: selectedItem.points,
      type: selectedItem.type,
    });

    setIsConfirmModalOpen(false);
    message.success(`已${selectedItem.points > 0 ? '奖励' : '扣除'} ${Math.abs(selectedItem.points)} 分`);
  };

  if (!child) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Card style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          padding: '40px',
        }}>
          <Empty description="未找到孩子信息" />
          <Button 
            type="primary" 
            onClick={handleHomeClick}
            style={{ 
              marginTop: '20px',
              borderRadius: '8px',
              background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
              border: 'none',
            }}
          >
            返回首页
          </Button>
        </Card>
      </div>
    );
  }

  // 筛选当前孩子的记录
  const childRecords = records.filter(record => record.childId === child.id);

  // 渲染项目卡片
  const renderItemCard = (item: RewardPunishItem) => (
    <Card
      key={item.id}
      hoverable
      style={{
        marginBottom: '12px',
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        background: 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.3s ease',
      }}
      bodyStyle={{ padding: '16px' }}
      onClick={() => handleItemClick(item)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: '16px', color: '#333' }}>
            {item.name}
          </Text>
          <div style={{ marginTop: '4px' }}>
            <Tag
              color={item.type === 'reward' ? 'green' : 'red'}
              style={{ borderRadius: '12px', fontSize: '12px' }}
            >
              {item.type === 'reward' ? '+' : ''}{item.points} 分
            </Tag>
          </div>
        </div>
        <Button
          type={item.type === 'reward' ? 'primary' : 'default'}
          danger={item.type === 'punishment'}
          style={{
            borderRadius: '8px',
            background: item.type === 'reward' 
              ? 'linear-gradient(45deg, #52c41a, #73d13d)' 
              : 'linear-gradient(45deg, #ff4d4f, #ff7875)',
            border: 'none',
            color: 'white',
          }}
        >
          {item.type === 'reward' ? '奖励' : '惩罚'}
        </Button>
      </div>
    </Card>
  );

  // 渲染记录卡片
  const renderRecordCard = (record: PointRecord) => (
    <Card
      key={record.id}
      style={{
        marginBottom: '12px',
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        background: 'rgba(255, 255, 255, 0.9)',
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Text strong style={{ fontSize: '16px', color: '#333' }}>
              {record.itemName}
            </Text>
            <Tag
              color={record.points > 0 ? 'green' : 'red'}
              style={{ marginLeft: '8px', borderRadius: '12px' }}
            >
              {record.points > 0 ? '+' : ''}{record.points} 分
            </Tag>
          </div>
          <Text style={{ fontSize: '12px', color: '#999' }}>
            {new Date(record.date).toLocaleString()}
          </Text>
        </div>
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          style={{
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(255, 77, 79, 0.1)',
            color: '#ff4d4f',
          }}
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除这条记录吗？`,
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                deleteRecord(record.id);
                message.success('删除成功');
              }
            });
          }}
        >
          删除
        </Button>
      </div>
    </Card>
  );

  return (
    <div 
      className="child-record-page" 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      {/* 顶部导航栏 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '0 10px'
      }}>
        <Button
          type="text"
          icon={<HomeOutlined />}
          style={{
            color: 'white',
            fontSize: '20px',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
          onClick={handleHomeClick}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            src={child.avatar}
            style={{ 
              backgroundColor: !child.avatar ? '#1890ff' : undefined,
              border: '2px solid white',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <Title 
              level={2} 
              style={{ 
                color: 'white', 
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontSize: '24px'
              }}
            >
              {child.name}
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <StarOutlined style={{ color: '#faad14' }} />
              <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                {child.points} 积分
              </Text>
            </div>
          </div>
        </div>
        <div style={{ width: '44px' }}></div>
      </div>

      {/* 主要内容区域 */}
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
        >
          <TabPane
            tab={
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                <TrophyOutlined style={{ marginRight: '8px' }} />
                奖励项目
              </span>
            }
            key="reward"
          >
            <div style={{ minHeight: '400px' }}>
              {rewardItems.length === 0 ? (
                <Empty
                  image={<TrophyOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
                  description={
                    <Text style={{ color: '#666' }}>
                      还没有奖励项目<br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>
                        请在设置中添加奖励项目
                      </Text>
                    </Text>
                  }
                  style={{ marginTop: '60px' }}
                />
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                  {rewardItems.map(item => renderItemCard(item))}
                </div>
              )}
            </div>
          </TabPane>

          <TabPane
            tab={
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                <CloseCircleOutlined style={{ marginRight: '8px' }} />
                惩罚项目
              </span>
            }
            key="punishment"
          >
            <div style={{ minHeight: '400px' }}>
              {punishmentItems.length === 0 ? (
                <Empty
                  image={<CloseCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
                  description={
                    <Text style={{ color: '#666' }}>
                      还没有惩罚项目<br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>
                        请在设置中添加惩罚项目
                      </Text>
                    </Text>
                  }
                  style={{ marginTop: '60px' }}
                />
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                  {punishmentItems.map(item => renderItemCard(item))}
                </div>
              )}
            </div>
          </TabPane>

          <TabPane
            tab={
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                <HistoryOutlined style={{ marginRight: '8px' }} />
                积分记录
              </span>
            }
            key="records"
          >
            <div style={{ minHeight: '400px' }}>
              {childRecords.length === 0 ? (
                <Empty
                  image={<HistoryOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
                  description={
                    <Text style={{ color: '#666' }}>
                      还没有积分记录<br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>
                        开始奖励或惩罚来创建第一条记录
                      </Text>
                    </Text>
                  }
                  style={{ marginTop: '60px' }}
                />
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                  {childRecords.map(record => renderRecordCard(record))}
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 确认弹窗 */}
      <Modal
        title={
          <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            {selectedItem?.points > 0 ? (
              <>
                <TrophyOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                确认奖励
              </>
            ) : (
              <>
                <CloseCircleOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                确认惩罚
              </>
            )}
          </div>
        }
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        footer={
          <Space>
            <Button 
              onClick={() => setIsConfirmModalOpen(false)}
              style={{ borderRadius: '8px' }}
            >
              取消
            </Button>
            <Button 
              type="primary" 
              onClick={handleConfirm}
              style={{ 
                borderRadius: '8px',
                background: selectedItem?.points > 0 
                  ? 'linear-gradient(45deg, #52c41a, #73d13d)' 
                  : 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                border: 'none',
              }}
            >
              确认
            </Button>
          </Space>
        }
        width={400}
        style={{ top: '20vh' }}
      >
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <Avatar 
            size={64} 
            icon={<UserOutlined />} 
            src={child.avatar}
            style={{ 
              backgroundColor: !child.avatar ? '#1890ff' : undefined,
              marginBottom: '16px',
            }}
          />
          <Title level={4} style={{ marginBottom: '8px' }}>
            {child.name}
          </Title>
          <Text style={{ fontSize: '16px', color: '#666' }}>
            确定要{selectedItem?.points > 0 ? '奖励' : '惩罚'} {child.name} 吗？
          </Text>
          <Divider />
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
            <Text strong style={{ fontSize: '16px' }}>
              {selectedItem?.name}
            </Text>
            <br />
            <Tag
              color={selectedItem?.points > 0 ? 'green' : 'red'}
              style={{ marginTop: '8px', fontSize: '14px', padding: '4px 12px' }}
            >
              {selectedItem?.points > 0 ? '+' : ''}{selectedItem?.points} 分
            </Tag>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChildRecordPage;