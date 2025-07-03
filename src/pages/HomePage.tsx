import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Empty, Space } from 'antd';
import { PlusOutlined, SettingOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAppContext } from '../context/AppContext';
import ChildAvatar from '../components/ChildAvatar';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { children } = useAppContext();

  const handleAddChild = () => {
    navigate('/settings');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleChildClick = (childId: string) => {
    navigate(`/child/${childId}`);
  };

  // 计算统计数据
  const totalChildren = children.length;
  const totalPoints = children.reduce((sum, child) => sum + child.points, 0);
  const averagePoints = totalChildren > 0 ? Math.round(totalPoints / totalChildren) : 0;

  return (
    <div className="responsive-container">
      {/* 头部区域 */}
      <div className="responsive-header">
        <Title level={1} className="responsive-title" style={{ color: 'white', marginBottom: '8px' }}>
          儿童习惯养成
        </Title>
        <Text className="responsive-text" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          通过积分奖励，培养孩子的好习惯
        </Text>
      </div>

      {/* 导航栏 */}
      <div className="responsive-navbar">
        <div></div>
        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={handleSettings}
          className="responsive-button"
          style={{
            background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
            border: 'none',
          }}
        >
          设置管理
        </Button>
      </div>

      {/* 主内容区域包装器 */}
      <div className="main-content-wrapper">
        {/* 统计面板 */}
        {totalChildren > 0 && (
          <div className="responsive-stats">
            <div className="responsive-stat-item">
              <UserOutlined style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }} />
              <div>
                <Text strong style={{ color: 'white', fontSize: '18px', display: 'block' }}>
                  {totalChildren}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                  孩子数量
                </Text>
              </div>
            </div>
            <div className="responsive-stat-item">
              <TrophyOutlined style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }} />
              <div>
                <Text strong style={{ color: 'white', fontSize: '18px', display: 'block' }}>
                  {totalPoints}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                  总积分
                </Text>
              </div>
            </div>
            <div className="responsive-stat-item">
              <TrophyOutlined style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }} />
              <div>
                <Text strong style={{ color: 'white', fontSize: '18px', display: 'block' }}>
                  {averagePoints}
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                  平均积分
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* 主要内容区域 */}
        <Card className="responsive-card" bodyStyle={{ padding: '24px' }} style={{ width: '100%', maxWidth: '800px' }}>
          <div className="responsive-content">
            {children.length === 0 ? (
              <div className="responsive-empty">
                <Empty
                  image={<UserOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                  description={
                    <div>
                      <Text strong className="responsive-subtitle" style={{ color: '#666', display: 'block' }}>
                        还没有添加孩子
                      </Text>
                      <Text className="responsive-text" style={{ color: '#999' }}>
                        点击下方按钮添加第一个孩子，开始积分奖励之旅
                      </Text>
                    </div>
                  }
                />
                <div className="responsive-spacing">
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handleAddChild}
                    className="responsive-button"
                    style={{
                      background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                      border: 'none',
                      fontSize: '16px',
                      height: '48px',
                      padding: '0 32px',
                    }}
                  >
                    添加孩子
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Title level={2} className="responsive-subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
                  我的孩子们
                </Title>
                <div className="responsive-grid" style={{ width: '100%' }}>
                  {children.map(child => (
                    <Card
                      key={child.id}
                      hoverable
                      className="responsive-card"
                      style={{
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        maxWidth: '300px',
                      }}
                      bodyStyle={{ padding: '24px', textAlign: 'center' }}
                      onClick={() => handleChildClick(child.id)}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <ChildAvatar child={child} size={80} className="responsive-avatar" onClick={() => {}} />
                        <div>
                          <Title level={4} className="responsive-subtitle" style={{ margin: '8px 0 4px' }}>
                            {child.name}
                          </Title>
                          <Text className="responsive-text" style={{ color: '#666' }}>
                            当前积分：
                            <Text strong style={{ color: child.points >= 0 ? '#52c41a' : '#ff4d4f', marginLeft: '4px' }}>
                              {child.points}
                            </Text>
                          </Text>
                        </div>
                      </Space>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* 浮动添加按钮 */}
        {children.length > 0 && (
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAddChild}
            className="responsive-fab"
            style={{
              background: 'linear-gradient(45deg, #52c41a, #73d13d)',
              border: 'none',
              boxShadow: '0 4px 16px rgba(82, 196, 26, 0.3)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;