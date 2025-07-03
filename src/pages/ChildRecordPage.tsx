import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Tabs, Typography, List, Tag, Space, Modal, Empty, message } from 'antd';
import { HomeOutlined, TrophyOutlined, CloseCircleOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useAppContext } from '../context/AppContext';
import ChildAvatar from '../components/ChildAvatar';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ChildRecordPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { children, rewardItems, punishmentItems, records, addRecord, deleteRecord } = useAppContext();
  const [activeTab, setActiveTab] = useState('rewards');

  const child = children.find(c => c.id === childId);
  const childRecords = records.filter(record => record.childId === childId);

  if (!child) {
    return (
      <div className="responsive-container">
        <div className="responsive-header">
          <Title level={1} className="responsive-title" style={{ color: 'white', marginBottom: '8px' }}>
            孩子不存在
          </Title>
          <Text className="responsive-text" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            未找到指定的孩子信息
          </Text>
        </div>
        
        <div className="main-content-wrapper">
          <Card className="responsive-card" bodyStyle={{ padding: '24px' }} style={{ width: '100%', maxWidth: '800px' }}>
            <div className="responsive-content">
              <div className="responsive-empty">
                <Empty
                  image={<UserOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                  description={
                    <div>
                      <Text strong className="responsive-subtitle" style={{ color: '#666', display: 'block' }}>
                        找不到孩子信息
                      </Text>
                      <Text className="responsive-text" style={{ color: '#999' }}>
                        请检查链接是否正确，或返回首页重新选择
                      </Text>
                    </div>
                  }
                />
                <div className="responsive-spacing">
                  <Button
                    type="primary"
                    size="large"
                    icon={<HomeOutlined />}
                    onClick={() => navigate('/')}
                    className="responsive-button"
                    style={{
                      background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                      border: 'none',
                      fontSize: '16px',
                      height: '48px',
                      padding: '0 32px',
                    }}
                  >
                    返回首页
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const handleAddRecord = (item: any, type: 'reward' | 'punishment') => {
    addRecord({
      childId: child.id,
      itemId: item.id,
      itemName: item.name,
      points: item.points,
      type,
    });
    message.success(`${type === 'reward' ? '奖励' : '惩罚'}记录已添加`);
  };

  const handleDeleteRecord = (record: any) => {
    Modal.confirm({
      title: '确认删除记录',
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ChildAvatar child={child} size={40} onClick={() => {}} />
          <div>
            <Text strong>{child.name}</Text>
            <br />
            <Text>{record.itemName}</Text>
            <br />
            <Text style={{ color: record.points > 0 ? '#52c41a' : '#ff4d4f' }}>
              {record.points > 0 ? '+' : ''}{record.points} 分
            </Text>
          </div>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        deleteRecord(record.id);
        message.success('记录已删除');
      }
    });
  };

  const renderRewardTab = () => (
    <div className="responsive-content">
      {rewardItems.length === 0 ? (
        <div className="responsive-empty">
          <Empty
            image={<TrophyOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
            description={
              <div>
                <Text strong className="responsive-subtitle" style={{ color: '#666', display: 'block' }}>
                  还没有奖励项目
                </Text>
                <Text className="responsive-text" style={{ color: '#999' }}>
                  请先在设置页面添加奖励项目
                </Text>
              </div>
            }
          />
          <div className="responsive-spacing">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/settings')}
              className="responsive-button"
              style={{
                background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                border: 'none',
                fontSize: '16px',
                height: '48px',
                padding: '0 32px',
              }}
            >
              去设置页面
            </Button>
          </div>
        </div>
      ) : (
        <div className="responsive-list">
          <div className="responsive-grid" style={{ width: '100%' }}>
            {rewardItems.map(item => (
              <Card
                key={item.id}
                hoverable
                className="responsive-card"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  maxWidth: '300px',
                }}
                bodyStyle={{ padding: '20px', textAlign: 'center' }}
                onClick={() => handleAddRecord(item, 'reward')}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <TrophyOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                  <div>
                    <Title level={4} className="responsive-subtitle" style={{ margin: '8px 0 4px' }}>
                      {item.name}
                    </Title>
                    <Text className="responsive-text" style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '16px' }}>
                      +{item.points} 分
                    </Text>
                  </div>
                </Space>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPunishmentTab = () => (
    <div className="responsive-content">
      {punishmentItems.length === 0 ? (
        <div className="responsive-empty">
          <Empty
            image={<CloseCircleOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
            description={
              <div>
                <Text strong className="responsive-subtitle" style={{ color: '#666', display: 'block' }}>
                  还没有惩罚项目
                </Text>
                <Text className="responsive-text" style={{ color: '#999' }}>
                  请先在设置页面添加惩罚项目
                </Text>
              </div>
            }
          />
          <div className="responsive-spacing">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/settings')}
              className="responsive-button"
              style={{
                background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                border: 'none',
                fontSize: '16px',
                height: '48px',
                padding: '0 32px',
              }}
            >
              去设置页面
            </Button>
          </div>
        </div>
      ) : (
        <div className="responsive-list">
          <div className="responsive-grid" style={{ width: '100%' }}>
            {punishmentItems.map(item => (
              <Card
                key={item.id}
                hoverable
                className="responsive-card"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  maxWidth: '300px',
                }}
                bodyStyle={{ padding: '20px', textAlign: 'center' }}
                onClick={() => handleAddRecord(item, 'punishment')}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <CloseCircleOutlined style={{ fontSize: '32px', color: '#ff4d4f' }} />
                  <div>
                    <Title level={4} className="responsive-subtitle" style={{ margin: '8px 0 4px' }}>
                      {item.name}
                    </Title>
                    <Text className="responsive-text" style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '16px' }}>
                      {item.points} 分
                    </Text>
                  </div>
                </Space>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRecordsTab = () => (
    <div className="responsive-content">
      {childRecords.length === 0 ? (
        <div className="responsive-empty">
          <Empty
            image={<TrophyOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
            description={
              <div>
                <Text strong className="responsive-subtitle" style={{ color: '#666', display: 'block' }}>
                  还没有记录
                </Text>
                <Text className="responsive-text" style={{ color: '#999' }}>
                  开始给 {child.name} 添加奖励或惩罚记录吧
                </Text>
              </div>
            }
          />
        </div>
      ) : (
        <div className="responsive-list">
          <List
            dataSource={childRecords}
            renderItem={(record) => (
              <List.Item
                key={record.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  margin: '8px 0',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRecord(record)}
                    className="responsive-button"
                    style={{
                      color: '#ff4d4f',
                      background: 'rgba(255, 77, 79, 0.1)',
                      border: 'none',
                      borderRadius: '6px',
                    }}
                  >
                    删除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    record.type === 'reward' ? (
                      <TrophyOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    ) : (
                      <CloseCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                    )
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong className="responsive-subtitle">{record.itemName}</Text>
                      <Tag 
                        color={record.points > 0 ? 'green' : 'red'}
                        style={{ fontSize: '14px', fontWeight: 'bold' }}
                      >
                        {record.points > 0 ? '+' : ''}{record.points} 分
                      </Tag>
                    </div>
                  }
                  description={
                    <Text className="responsive-text" style={{ color: '#666' }}>
                      {new Date(record.date).toLocaleString('zh-CN')}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="responsive-container">
      {/* 头部区域 */}
      <div className="responsive-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
          <ChildAvatar child={child} size={64} className="responsive-avatar" onClick={() => {}} />
          <div style={{ textAlign: 'center' }}>
            <Title level={1} className="responsive-title" style={{ color: 'white', marginBottom: '4px' }}>
              {child.name}
            </Title>
            <Text className="responsive-text" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px' }}>
              当前积分：
              <Text strong style={{ color: child.points >= 0 ? '#52c41a' : '#ff4d4f', marginLeft: '4px' }}>
                {child.points}
              </Text>
            </Text>
          </div>
        </div>
        <Text className="responsive-text" style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', display: 'block' }}>
          记录 {child.name} 的奖励与惩罚
        </Text>
      </div>

      {/* 导航栏 */}
      <div className="responsive-navbar">
        <Button
          type="text"
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
          className="responsive-button"
          style={{
            color: 'white',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          返回首页
        </Button>
        <div></div>
      </div>

      {/* 主内容区域包装器 */}
      <div className="main-content-wrapper">
        {/* 主要内容区域 */}
        <Card className="responsive-card" bodyStyle={{ padding: '24px' }} style={{ width: '100%', maxWidth: '800px' }}>
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            className="responsive-tabs"
          >
            <TabPane
              tab={
                <span className="responsive-text">
                  <TrophyOutlined style={{ marginRight: '8px' }} />
                  奖励
                </span>
              }
              key="rewards"
            >
              {renderRewardTab()}
            </TabPane>
            
            <TabPane
              tab={
                <span className="responsive-text">
                  <CloseCircleOutlined style={{ marginRight: '8px' }} />
                  惩罚
                </span>
              }
              key="punishments"
            >
              {renderPunishmentTab()}
            </TabPane>
            
            <TabPane
              tab={
                <span className="responsive-text">
                  <UserOutlined style={{ marginRight: '8px' }} />
                  记录
                </span>
              }
              key="records"
            >
              {renderRecordsTab()}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ChildRecordPage;