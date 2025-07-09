import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Empty, Row, Col, Tooltip } from 'antd';
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
    <div className="home-container">
      {/* 头部区域 */}
      <div className="hero-section">
        <div className="hero-content">
          <Title level={1} className="hero-title">
            儿童习惯养成
          </Title>
          <Text className="hero-subtitle">
            通过积分奖励，培养孩子的好习惯
          </Text>
        </div>
        
        {/* 设置按钮 */}
        <div className="settings-button-container">
          <Tooltip title="设置管理" placement="bottom">
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={handleSettings}
              className="settings-button"
              shape="circle"
            />
          </Tooltip>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="main-content">
        {/* 统计面板 */}
        {totalChildren > 0 && (
          <div className="stats-section">
            <Row gutter={[12, 12]} justify="center">
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <Card className="stats-card">
                  <div className="stats-content">
                    <div className="stats-icon">
                      <UserOutlined />
                    </div>
                    <div className="stats-info">
                      <Text className="stats-number">{totalChildren}</Text>
                      <Text className="stats-label">孩子数量</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <Card className="stats-card">
                  <div className="stats-content">
                    <div className="stats-icon total-points">
                      <TrophyOutlined />
                    </div>
                    <div className="stats-info">
                      <Text className="stats-number">{totalPoints}</Text>
                      <Text className="stats-label">总积分</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <Card className="stats-card">
                  <div className="stats-content">
                    <div className="stats-icon average-points">
                      <TrophyOutlined />
                    </div>
                    <div className="stats-info">
                      <Text className="stats-number">{averagePoints}</Text>
                      <Text className="stats-label">平均积分</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* 孩子列表区域 */}
        <div className="children-section">
          <Card className="children-card">
            {children.length === 0 ? (
              <div className="empty-state">
                <Empty
                  image={<UserOutlined className="empty-icon" />}
                  description={
                    <div className="empty-description">
                      <Text className="empty-title">还没有添加孩子</Text>
                      <Text className="empty-subtitle">
                        点击下方按钮添加第一个孩子，开始积分奖励之旅
                      </Text>
                    </div>
                  }
                />
                <div className="empty-action">
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handleAddChild}
                    className="add-child-button"
                  >
                    添加孩子
                  </Button>
                </div>
              </div>
            ) : (
              <div className="children-content">
                <Title level={2} className="children-title">
                  我的孩子们
                </Title>
                <Row gutter={[24, 24]} justify="center">
                  {children.map(child => (
                    <Col key={child.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Card
                        hoverable
                        className="child-card"
                        onClick={() => handleChildClick(child.id)}
                      >
                        <div className="child-card-content">
                          <ChildAvatar 
                            child={child} 
                            size={80} 
                            className="child-avatar" 
                            onClick={() => {}} 
                          />
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>
        </div>

        {/* 浮动添加按钮 */}
        {children.length > 0 && (
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAddChild}
            className="floating-add-button"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;