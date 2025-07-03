import React, { useState } from 'react';
import { Button, Tabs, Modal, Form, Input, InputNumber, message, Card, Typography, Space, Empty } from 'antd';
import { PlusOutlined, HomeOutlined, TrophyOutlined, CloseCircleOutlined, DatabaseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../context/AppContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
    <div className="responsive-content">
      {children.length === 0 ? (
        <div className="responsive-empty">
          <Empty
            image={<TrophyOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
            description={
              <div>
                <Text strong className="responsive-subtitle" style={{ color: '#666', display: 'block' }}>
                  还没有添加孩子
                </Text>
                <Text className="responsive-text" style={{ color: '#999' }}>
                  点击下方按钮添加第一个孩子
                </Text>
              </div>
            }
          />
          <div className="responsive-spacing">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsChildModalOpen(true)}
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
        <div className="responsive-list">
          <div className="responsive-grid" style={{ width: '100%' }}>
            {children.map(child => (
              <Card
                key={child.id}
                className="responsive-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  maxWidth: '300px',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Title level={4} className="responsive-subtitle" style={{ margin: '0 0 8px' }}>
                      {child.name}
                    </Title>
                    <Text className="responsive-text" style={{ color: '#666' }}>
                      当前积分：
                      <Text strong style={{ color: child.points >= 0 ? '#52c41a' : '#ff4d4f', marginLeft: '4px' }}>
                        {child.points}
                      </Text>
                    </Text>
                  </div>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    className="responsive-button"
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      background: 'rgba(255, 77, 79, 0.1)',
                      color: '#ff4d4f',
                    }}
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
                  >
                    删除
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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
                  点击下方按钮添加第一个奖励项目
                </Text>
              </div>
            }
          />
          <div className="responsive-spacing">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsRewardModalOpen(true)}
              className="responsive-button"
              style={{
                background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                border: 'none',
                fontSize: '16px',
                height: '48px',
                padding: '0 32px',
              }}
            >
              添加奖励
            </Button>
          </div>
        </div>
      ) : (
        <div className="responsive-list">
          <div className="responsive-grid" style={{ width: '100%' }}>
            {rewardItems.map(item => (
              <Card
                key={item.id}
                className="responsive-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  maxWidth: '300px',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Title level={4} className="responsive-subtitle" style={{ margin: '0 0 8px' }}>
                      {item.name}
                    </Title>
                    <Text className="responsive-text" style={{ color: '#52c41a', fontWeight: 'bold' }}>
                      +{item.points} 分
                    </Text>
                  </div>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    className="responsive-button"
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      background: 'rgba(255, 77, 79, 0.1)',
                      color: '#ff4d4f',
                    }}
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
                  >
                    删除
                  </Button>
                </div>
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
                  点击下方按钮添加第一个惩罚项目
                </Text>
              </div>
            }
          />
          <div className="responsive-spacing">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsPunishmentModalOpen(true)}
              className="responsive-button"
              style={{
                background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                border: 'none',
                fontSize: '16px',
                height: '48px',
                padding: '0 32px',
              }}
            >
              添加惩罚
            </Button>
          </div>
        </div>
      ) : (
        <div className="responsive-list">
          <div className="responsive-grid" style={{ width: '100%' }}>
            {punishmentItems.map(item => (
              <Card
                key={item.id}
                className="responsive-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  maxWidth: '300px',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Title level={4} className="responsive-subtitle" style={{ margin: '0 0 8px' }}>
                      {item.name}
                    </Title>
                    <Text className="responsive-text" style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                      {item.points} 分
                    </Text>
                  </div>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    className="responsive-button"
                    style={{
                      borderRadius: '6px',
                      border: 'none',
                      background: 'rgba(255, 77, 79, 0.1)',
                      color: '#ff4d4f',
                    }}
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
                  >
                    删除
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="responsive-container">
      {/* 头部区域 */}
      <div className="responsive-header">
        <Title level={1} className="responsive-title" style={{ color: 'white', marginBottom: '8px' }}>
          设置管理
        </Title>
        <Text className="responsive-text" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          管理孩子信息、奖励和惩罚项目
        </Text>
      </div>

      {/* 导航栏 */}
      <div className="responsive-navbar">
        <Button
          type="text"
          icon={<HomeOutlined />}
          onClick={handleHomeClick}
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
        <Button
          type="primary"
          icon={<DatabaseOutlined />}
          onClick={handleDataManageClick}
          className="responsive-button"
          style={{
            background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
            border: 'none',
          }}
        >
          数据管理
        </Button>
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
                  孩子管理
                </span>
              }
              key="children"
            >
              {renderChildrenTab()}
            </TabPane>
            
            <TabPane
              tab={
                <span className="responsive-text">
                  <TrophyOutlined style={{ marginRight: '8px' }} />
                  奖励项目
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
                  惩罚项目
                </span>
              }
              key="punishments"
            >
              {renderPunishmentTab()}
            </TabPane>
          </Tabs>
        </Card>

        {/* 浮动添加按钮 */}
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          className="responsive-fab"
          style={{
            background: activeTab === 'children' 
              ? 'linear-gradient(45deg, #52c41a, #73d13d)'
              : activeTab === 'rewards'
              ? 'linear-gradient(45deg, #52c41a, #73d13d)'
              : 'linear-gradient(45deg, #ff4d4f, #ff7875)',
            border: 'none',
            boxShadow: '0 4px 16px rgba(82, 196, 26, 0.3)',
          }}
          onClick={() => {
            if (activeTab === 'children') {
              setIsChildModalOpen(true);
            } else if (activeTab === 'rewards') {
              setIsRewardModalOpen(true);
            } else {
              setIsPunishmentModalOpen(true);
            }
          }}
        />
      </div>

      {/* 添加孩子弹窗 */}
      <Modal
        title="添加新的孩子"
        open={isChildModalOpen}
        onCancel={() => setIsChildModalOpen(false)}
        footer={null}
        className="responsive-modal"
      >
        <Form
          form={childForm}
          layout="vertical"
          onFinish={handleAddChild}
          className="responsive-form"
        >
          <Form.Item
            name="name"
            label="孩子名称"
            rules={[
              { required: true, message: '请输入孩子名称' },
              { min: 2, message: '名称至少需要2个字符' },
              { max: 10, message: '名称不能超过10个字符' }
            ]}
          >
            <Input 
              placeholder="请输入孩子名称" 
              size="large"
              className="responsive-button"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setIsChildModalOpen(false)}
                className="responsive-button"
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="responsive-button"
                style={{ 
                  background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                  border: 'none',
                }}
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
        className="responsive-modal"
      >
        <Form
          form={rewardForm}
          layout="vertical"
          onFinish={handleAddReward}
          className="responsive-form"
        >
          <Form.Item
            name="name"
            label="奖励名称"
            rules={[
              { required: true, message: '请输入奖励名称' },
              { min: 2, message: '名称至少需要2个字符' },
              { max: 20, message: '名称不能超过20个字符' }
            ]}
          >
            <Input 
              placeholder="请输入奖励名称" 
              size="large"
              className="responsive-button"
            />
          </Form.Item>
          <Form.Item
            name="points"
            label="奖励积分"
            rules={[
              { required: true, message: '请输入奖励积分' },
              { type: 'number', min: 1, max: 100, message: '积分必须在1-100之间' }
            ]}
          >
            <InputNumber 
              placeholder="请输入积分数量" 
              size="large"
              min={1}
              max={100}
              style={{ width: '100%' }}
              className="responsive-button"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setIsRewardModalOpen(false)}
                className="responsive-button"
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="responsive-button"
                style={{ 
                  background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                  border: 'none',
                }}
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
        className="responsive-modal"
      >
        <Form
          form={punishmentForm}
          layout="vertical"
          onFinish={handleAddPunishment}
          className="responsive-form"
        >
          <Form.Item
            name="name"
            label="惩罚名称"
            rules={[
              { required: true, message: '请输入惩罚名称' },
              { min: 2, message: '名称至少需要2个字符' },
              { max: 20, message: '名称不能超过20个字符' }
            ]}
          >
            <Input 
              placeholder="请输入惩罚名称" 
              size="large"
              className="responsive-button"
            />
          </Form.Item>
          <Form.Item
            name="points"
            label="扣除积分"
            rules={[
              { required: true, message: '请输入扣除积分' },
              { type: 'number', min: 1, max: 100, message: '积分必须在1-100之间' }
            ]}
          >
            <InputNumber 
              placeholder="请输入积分数量" 
              size="large"
              min={1}
              max={100}
              style={{ width: '100%' }}
              className="responsive-button"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setIsPunishmentModalOpen(false)}
                className="responsive-button"
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="responsive-button"
                style={{ 
                  background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                  border: 'none',
                }}
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