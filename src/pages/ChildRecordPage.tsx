import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Tabs, Typography, List, Modal, Empty, message, Row, Col } from 'antd';
import { HomeOutlined, DeleteOutlined, UserOutlined, GiftOutlined, WarningOutlined, HistoryOutlined } from '@ant-design/icons';
import { useAppContext } from '../context/AppContext';
import ChildAvatar from '../components/ChildAvatar';

const { Title, Text } = Typography;

const ChildRecordPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { children, rewardItems, punishmentItems, records, addRecord, deleteRecord } = useAppContext();
  const [activeTab, setActiveTab] = useState('rewards');

  const child = children.find(c => c.id === childId);
  const childRecords = records.filter(record => record.childId === childId);

  if (!child) {
    return (
      <div className="child-record-container">
        <div className="hero-section">
          <div className="hero-content">
            <Title level={1} className="hero-title">
              孩子不存在
            </Title>
            <Text className="hero-subtitle">
              未找到指定的孩子信息
            </Text>
          </div>
        </div>
        
        <div className="main-content">
          <Card className="clay-element error-card">
            <div className="empty-state">
              <Empty
                image={<UserOutlined className="empty-icon" />}
                description={
                  <div className="empty-description">
                    <Text className="empty-title">找不到孩子信息</Text>
                    <Text className="empty-subtitle">
                      请检查链接是否正确，或返回首页重新选择
                    </Text>
                  </div>
                }
              />
              <div className="empty-action">
                <Button
                  className="add-button"
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/')}
                >
                  返回首页
                </Button>
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
        <div className="delete-record-content">
          <ChildAvatar child={child} size={40} onClick={() => {}} />
          <div className="record-info">
            <Text strong>{child.name}</Text>
            <br />
            <Text>{record.itemName}</Text>
            <br />
            <Text className={record.points > 0 ? 'positive' : 'negative'}>
              {record.points > 0 ? '+' : ''}{record.points} 分
            </Text>
          </div>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      className: 'clay-modal',
      onOk: () => {
        deleteRecord(record.id);
        message.success('记录已删除');
      }
    });
  };

  const renderRewardTab = () => (
    <div className="record-content">
      {rewardItems.length === 0 ? (
        <div className="empty-state">
          <Empty
            image={<GiftOutlined className="empty-icon reward-icon" />}
            description={
              <div className="empty-description">
                <Text className="empty-title">还没有奖励项目</Text>
                <Text className="empty-subtitle">
                  请先在设置页面添加奖励项目
                </Text>
              </div>
            }
          />
          <div className="empty-action">
            <Button
              className="add-button reward-button"
              onClick={() => navigate('/settings')}
            >
              去设置页面
            </Button>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          <Row gutter={[16, 16]}>
            {rewardItems.map(item => (
              <Col key={item.id} xs={24} sm={24} md={12} lg={12} xl={8}>
                <Card 
                  className="record-item-card reward-item"
                  onClick={() => handleAddRecord(item, 'reward')}
                >
                  <div className="record-item-content">
                    <div className="record-item-icon reward-icon">
                      <GiftOutlined />
                    </div>
                    <div className="record-item-info">
                      <Title level={4} className="record-item-name">{item.name}</Title>
                      <Text className="record-item-points positive">
                        +{item.points} 分
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );

  const renderPunishmentTab = () => (
    <div className="record-content">
      {punishmentItems.length === 0 ? (
        <div className="empty-state">
          <Empty
            image={<WarningOutlined className="empty-icon punishment-icon" />}
            description={
              <div className="empty-description">
                <Text className="empty-title">还没有惩罚项目</Text>
                <Text className="empty-subtitle">
                  请先在设置页面添加惩罚项目
                </Text>
              </div>
            }
          />
          <div className="empty-action">
            <Button
              className="add-button punishment-button"
              onClick={() => navigate('/settings')}
            >
              去设置页面
            </Button>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          <Row gutter={[16, 16]}>
            {punishmentItems.map(item => (
              <Col key={item.id} xs={24} sm={24} md={12} lg={12} xl={8}>
                <Card 
                  className="record-item-card punishment-item"
                  onClick={() => handleAddRecord(item, 'punishment')}
                >
                  <div className="record-item-content">
                    <div className="record-item-icon punishment-icon">
                      <WarningOutlined />
                    </div>
                    <div className="record-item-info">
                      <Title level={4} className="record-item-name">{item.name}</Title>
                      <Text className="record-item-points negative">
                        {item.points} 分
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );

  const renderRecordsTab = () => (
    <div className="record-content">
      {childRecords.length === 0 ? (
        <div className="empty-state">
          <Empty
            image={<HistoryOutlined className="empty-icon" />}
            description={
              <div className="empty-description">
                <Text className="empty-title">还没有积分记录</Text>
                <Text className="empty-subtitle">
                  开始记录{child.name}的积分变化吧
                </Text>
              </div>
            }
          />
        </div>
      ) : (
        <div className="records-list">
          <List
            dataSource={childRecords}
            renderItem={(record) => (
              <List.Item className="record-list-item">
                <Card className="record-history-card">
                  <div className="record-history-content">
                    <div className={`record-type-icon ${record.type}-icon`}>
                      {record.type === 'reward' ? <GiftOutlined /> : <WarningOutlined />}
                    </div>
                    <div className="record-history-info">
                      <div className="record-history-header">
                        <Title level={5} className="record-history-name">{record.itemName}</Title>
                        <Text className={`record-history-points ${record.points > 0 ? 'positive' : 'negative'}`}>
                          {record.points > 0 ? '+' : ''}{record.points} 分
                        </Text>
                      </div>
                      <Text className="record-history-date">
                        {new Date(record.date).toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </div>
                    <Button
                      className="delete-record-button"
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecord(record);
                      }}
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="child-record-container">
      {/* 头部区域 */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="child-header">
            <ChildAvatar child={child} size={80} onClick={() => {}} className="child-header-avatar" />
            <div className="child-header-info">
              <Title level={1} className="hero-title">{child.name}</Title>
              <Text className="hero-subtitle">
                当前积分：
                <span className={`points-display ${child.points >= 0 ? 'positive' : 'negative'}`}>
                  {child.points >= 0 ? '+' : ''}{child.points}
                </span>
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="main-content">
        <Card className="record-card">
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            className="record-tabs"
            items={[
              {
                key: 'rewards',
                label: (
                  <span className="tab-label">
                    <GiftOutlined />
                    奖励
                  </span>
                ),
                children: renderRewardTab()
              },
              {
                key: 'punishments',
                label: (
                  <span className="tab-label">
                    <WarningOutlined />
                    惩罚
                  </span>
                ),
                children: renderPunishmentTab()
              },
              {
                key: 'records',
                label: (
                  <span className="tab-label">
                    <HistoryOutlined />
                    记录
                  </span>
                ),
                children: renderRecordsTab()
              }
            ]}
          />
        </Card>
      </div>
      
      {/* 悬浮返回按钮 */}
      <Button
        className="floating-home-button"
        icon={<HomeOutlined />}
        onClick={() => navigate('/')}
        size="large"
      >
        返回首页
      </Button>
    </div>
  );
};

export default ChildRecordPage;
