import React, { useState } from 'react';
import { Button, Tabs, Modal, Form, Input, InputNumber, message, Card, Typography, Space, Empty, Row, Col } from 'antd';
import { PlusOutlined, HomeOutlined, TrophyOutlined, DatabaseOutlined, DeleteOutlined, GiftOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const { Title, Text } = Typography;

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    children, 
    rewardItems, 
    punishmentItems, 
    addChild, 
    deleteChild,
    addRewardItem, 
    addPunishmentItem, 
    deleteRewardItem, 
    deletePunishmentItem 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('children');
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isPunishmentModalOpen, setIsPunishmentModalOpen] = useState(false);
  const [childForm] = Form.useForm();
  const [rewardForm] = Form.useForm();
  const [punishmentForm] = Form.useForm();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleDataManageClick = () => {
    navigate('/data-manage');
  };

  const handleAddChild = (values: any) => {
    addChild({
      name: values.name,
    });
    childForm.resetFields();
    setIsChildModalOpen(false);
    message.success('添加成功');
  };

  const handleAddReward = (values: any) => {
    addRewardItem({
      name: values.name,
      points: values.points,
    });
    rewardForm.resetFields();
    setIsRewardModalOpen(false);
    message.success('添加成功');
  };

  const handleAddPunishment = (values: any) => {
    addPunishmentItem({
      name: values.name,
      points: values.points,
    });
    punishmentForm.resetFields();
    setIsPunishmentModalOpen(false);
    message.success('添加成功');
  };

  const renderChildrenTab = () => (
    <div className="settings-content">
      {children.length === 0 ? (
        <div className="empty-state">
          <Empty
            image={<TrophyOutlined className="empty-icon" />}
            description={
              <div className="empty-description">
                <Text className="empty-title">还没有添加孩子</Text>
                <Text className="empty-subtitle">
                  点击下方按钮添加第一个孩子
                </Text>
              </div>
            }
          />
          <div className="empty-action">
            <Button
              className="clay-button add-button"
              icon={<PlusOutlined />}
              onClick={() => setIsChildModalOpen(true)}
            >
              添加孩子
            </Button>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          <Row gutter={[20, 20]}>
            {children.map(child => (
              <Col key={child.id} xs={24} sm={12} md={8} lg={6}>
                <Card className="clay-element item-card">
                  <div className="item-content">
                    <div className="item-icon child-icon">
                      <TrophyOutlined />
                    </div>
                    <div className="item-info">
                      <Title level={4} className="item-name">{child.name}</Title>
                      <Text className={`item-points ${child.points >= 0 ? 'positive' : 'negative'}`}>
                        {child.points >= 0 ? '+' : ''}{child.points} 分
                      </Text>
                    </div>
                    <Button
                      className="clay-button delete-button"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        Modal.confirm({
                          title: '确认删除',
                          content: `确定要删除 ${child.name} 吗？删除后将无法恢复。`,
                          okText: '确认',
                          cancelText: '取消',
                          onOk: () => {
                            deleteChild(child.id);
                            message.success('删除成功');
                          }
                        });
                      }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );

  const renderRewardTab = () => (
    <div className="settings-content">
      {rewardItems.length === 0 ? (
        <div className="empty-state">
          <Empty
            image={<GiftOutlined className="empty-icon reward-icon" />}
            description={
              <div className="empty-description">
                <Text className="empty-title">还没有奖励项目</Text>
                <Text className="empty-subtitle">
                  点击下方按钮添加第一个奖励项目
                </Text>
              </div>
            }
          />
          <div className="empty-action">
            <Button
              className="clay-button add-button reward-button"
              icon={<PlusOutlined />}
              onClick={() => setIsRewardModalOpen(true)}
            >
              添加奖励
            </Button>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          <Row gutter={[20, 20]}>
            {rewardItems.map(item => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card className="clay-element item-card reward-card">
                  <div className="item-content">
                    <div className="item-icon reward-icon">
                      <GiftOutlined />
                    </div>
                    <div className="item-info">
                      <Title level={4} className="item-name">{item.name}</Title>
                      <Text className="item-points positive">
                        +{item.points} 分
                      </Text>
                    </div>
                    <Button
                      className="clay-button delete-button"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        Modal.confirm({
                          title: '确认删除',
                          content: `确定要删除奖励项目 "${item.name}" 吗？`,
                          okText: '确认',
                          cancelText: '取消',
                          onOk: () => {
                            deleteRewardItem(item.id);
                            message.success('删除成功');
                          }
                        });
                      }}
                    />
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
    <div className="settings-content">
      {punishmentItems.length === 0 ? (
        <div className="empty-state">
          <Empty
            image={<WarningOutlined className="empty-icon punishment-icon" />}
            description={
              <div className="empty-description">
                <Text className="empty-title">还没有惩罚项目</Text>
                <Text className="empty-subtitle">
                  点击下方按钮添加第一个惩罚项目
                </Text>
              </div>
            }
          />
          <div className="empty-action">
            <Button
              className="clay-button add-button punishment-button"
              icon={<PlusOutlined />}
              onClick={() => setIsPunishmentModalOpen(true)}
            >
              添加惩罚
            </Button>
          </div>
        </div>
      ) : (
        <div className="items-grid">
          <Row gutter={[20, 20]}>
            {punishmentItems.map(item => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card className="clay-element item-card punishment-card">
                  <div className="item-content">
                    <div className="item-icon punishment-icon">
                      <WarningOutlined />
                    </div>
                    <div className="item-info">
                      <Title level={4} className="item-name">{item.name}</Title>
                      <Text className="item-points negative">
                        {item.points} 分
                      </Text>
                    </div>
                    <Button
                      className="clay-button delete-button"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        Modal.confirm({
                          title: '确认删除',
                          content: `确定要删除惩罚项目 "${item.name}" 吗？`,
                          okText: '确认',
                          cancelText: '取消',
                          onOk: () => {
                            deletePunishmentItem(item.id);
                            message.success('删除成功');
                          }
                        });
                      }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );

  const getFloatingButtonProps = () => {
    switch (activeTab) {
      case 'children':
        return {
          onClick: () => setIsChildModalOpen(true),
          className: 'floating-add-button child-button'
        };
      case 'rewards':
        return {
          onClick: () => setIsRewardModalOpen(true),
          className: 'floating-add-button reward-button'
        };
      case 'punishments':
        return {
          onClick: () => setIsPunishmentModalOpen(true),
          className: 'floating-add-button punishment-button'
        };
      default:
        return {
          onClick: () => setIsChildModalOpen(true),
          className: 'floating-add-button'
        };
    }
  };

  return (
    <div className="settings-container">
      {/* 头部区域 */}
      <div className="hero-section">
        <div className="hero-content">
          <Title level={1} className="hero-title">
            设置管理
          </Title>
          <Text className="hero-subtitle">
            管理孩子信息、奖励和惩罚项目
          </Text>
        </div>
        
        {/* 导航按钮 */}
        <div className="nav-buttons">
          <Button
            className="clay-button nav-button"
            icon={<HomeOutlined />}
            onClick={handleHomeClick}
          >
            返回首页
          </Button>
          <Button
            className="clay-button nav-button data-button"
            icon={<DatabaseOutlined />}
            onClick={handleDataManageClick}
          >
            数据管理
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="main-content">
        <Card className="clay-element settings-card">
          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            className="settings-tabs"
            items={[
              {
                key: 'children',
                label: (
                  <span className="tab-label">
                    <TrophyOutlined />
                    孩子管理
                  </span>
                ),
                children: renderChildrenTab()
              },
              {
                key: 'rewards',
                label: (
                  <span className="tab-label">
                    <GiftOutlined />
                    奖励项目
                  </span>
                ),
                children: renderRewardTab()
              },
              {
                key: 'punishments',
                label: (
                  <span className="tab-label">
                    <WarningOutlined />
                    惩罚项目
                  </span>
                ),
                children: renderPunishmentTab()
              }
            ]}
          />
        </Card>

        {/* 浮动添加按钮 */}
        <Button
          {...getFloatingButtonProps()}
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
        />
      </div>

      {/* 添加孩子弹窗 */}
      <Modal
        title="添加孩子"
        open={isChildModalOpen}
        onCancel={() => setIsChildModalOpen(false)}
        footer={null}
        className="clay-modal"
      >
        <Form
          form={childForm}
          layout="vertical"
          onFinish={handleAddChild}
          className="clay-form"
        >
          <Form.Item
            label="孩子姓名"
            name="name"
            rules={[{ required: true, message: '请输入孩子姓名' }]}
          >
            <Input 
              placeholder="请输入孩子姓名" 
              className="clay-input"
            />
          </Form.Item>
          <Form.Item className="form-actions">
            <Space>
              <Button 
                onClick={() => setIsChildModalOpen(false)}
                className="clay-button cancel-button"
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="clay-button submit-button"
              >
                添加
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加奖励弹窗 */}
      <Modal
        title="添加奖励项目"
        open={isRewardModalOpen}
        onCancel={() => setIsRewardModalOpen(false)}
        footer={null}
        className="clay-modal"
      >
        <Form
          form={rewardForm}
          layout="vertical"
          onFinish={handleAddReward}
          className="clay-form"
        >
          <Form.Item
            label="奖励名称"
            name="name"
            rules={[{ required: true, message: '请输入奖励名称' }]}
          >
            <Input 
              placeholder="如：完成作业、帮助家务等" 
              className="clay-input"
            />
          </Form.Item>
          <Form.Item
            label="奖励积分"
            name="points"
            rules={[{ required: true, message: '请输入奖励积分' }]}
          >
            <InputNumber
              min={1}
              max={100}
              placeholder="请输入积分数量"
              className="clay-input"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item className="form-actions">
            <Space>
              <Button 
                onClick={() => setIsRewardModalOpen(false)}
                className="clay-button cancel-button"
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="clay-button submit-button reward-button"
              >
                添加
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加惩罚弹窗 */}
      <Modal
        title="添加惩罚项目"
        open={isPunishmentModalOpen}
        onCancel={() => setIsPunishmentModalOpen(false)}
        footer={null}
        className="clay-modal"
      >
        <Form
          form={punishmentForm}
          layout="vertical"
          onFinish={handleAddPunishment}
          className="clay-form"
        >
          <Form.Item
            label="惩罚名称"
            name="name"
            rules={[{ required: true, message: '请输入惩罚名称' }]}
          >
            <Input 
              placeholder="如：不完成作业、说谎等" 
              className="clay-input"
            />
          </Form.Item>
          <Form.Item
            label="扣除积分"
            name="points"
            rules={[{ required: true, message: '请输入扣除积分' }]}
          >
            <InputNumber
              min={1}
              max={100}
              placeholder="请输入积分数量"
              className="clay-input"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item className="form-actions">
            <Space>
              <Button 
                onClick={() => setIsPunishmentModalOpen(false)}
                className="clay-button cancel-button"
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="clay-button submit-button punishment-button"
              >
                添加
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPage;