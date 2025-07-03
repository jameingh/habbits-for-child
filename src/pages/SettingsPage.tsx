import React, { useState } from 'react';
import { Button, Tabs, Modal, Form, Input, InputNumber, message, Card, Typography, Space, Empty } from 'antd';
import { PlusOutlined, HomeOutlined, TrophyOutlined, CloseCircleOutlined, DatabaseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RewardPunishItem } from '../types';
import { useAppContext } from '../context/AppContext';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const SettingsPage: React.FC = () => {
  const { rewardItems, punishmentItems, addRewardItem, addPunishmentItem, deleteRewardItem, deletePunishmentItem } = useAppContext();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isPunishmentModalOpen, setIsPunishmentModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleAddReward = (values: any) => {
    addRewardItem({
      name: values.name,
      points: values.points,
    });
    form.resetFields();
    setIsRewardModalOpen(false);
    message.success('添加成功');
  };

  const handleAddPunishment = (values: any) => {
    addPunishmentItem({
      name: values.name,
      points: values.points,
    });
    form.resetFields();
    setIsPunishmentModalOpen(false);
    message.success('添加成功');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleDataManageClick = () => {
    navigate('/data-manage');
  };

  // 渲染项目卡片
  const renderItemCard = (item: RewardPunishItem, onDelete: (id: string) => void) => (
    <Card
      key={item.id}
      hoverable
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
          <Text strong style={{ fontSize: '16px', color: '#333' }}>
            {item.name}
          </Text>
          <div style={{ marginTop: '4px' }}>
            <Text
              style={{
                fontSize: '14px',
                color: item.type === 'reward' ? '#52c41a' : '#ff4d4f',
                fontWeight: 'bold',
              }}
            >
              {item.type === 'reward' ? '+' : ''}{item.points} 分
            </Text>
          </div>
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
              content: `确定要删除"${item.name}"吗？`,
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                onDelete(item.id);
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
      className="settings-page" 
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
        <Title 
          level={1} 
          style={{ 
            color: 'white', 
            margin: 0,
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            fontSize: '28px'
          }}
        >
          设置
        </Title>
        <Button
          type="text"
          icon={<DatabaseOutlined />}
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
          onClick={handleDataManageClick}
        />
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
          defaultActiveKey="reward"
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
            <div style={{ minHeight: '400px', position: 'relative' }}>
              {rewardItems.length === 0 ? (
                <Empty
                  image={<TrophyOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
                  description={
                    <Text style={{ color: '#666' }}>
                      还没有添加奖励项目<br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>
                        点击下方按钮添加第一个奖励项目
                      </Text>
                    </Text>
                  }
                  style={{ marginTop: '60px' }}
                />
              ) : (
                <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
                  {rewardItems.map(item => renderItemCard(item, deleteRewardItem))}
                </div>
              )}
              
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  borderRadius: '12px',
                  background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
                }}
                onClick={() => setIsRewardModalOpen(true)}
              >
                添加奖励项目
              </Button>
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
            <div style={{ minHeight: '400px', position: 'relative' }}>
              {punishmentItems.length === 0 ? (
                <Empty
                  image={<CloseCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
                  description={
                    <Text style={{ color: '#666' }}>
                      还没有添加惩罚项目<br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>
                        点击下方按钮添加第一个惩罚项目
                      </Text>
                    </Text>
                  }
                  style={{ marginTop: '60px' }}
                />
              ) : (
                <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
                  {punishmentItems.map(item => renderItemCard(item, deletePunishmentItem))}
                </div>
              )}
              
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  borderRadius: '12px',
                  background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(255, 77, 79, 0.3)',
                }}
                onClick={() => setIsPunishmentModalOpen(true)}
              >
                添加惩罚项目
              </Button>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                <DatabaseOutlined style={{ marginRight: '8px' }} />
                数据管理
              </span>
            } 
            key="data"
          >
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <DatabaseOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '20px' }} />
              <Title level={3} style={{ color: '#333', marginBottom: '12px' }}>
                数据管理中心
              </Title>
              <Text style={{ fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
                管理您的数据，包括数据备份、恢复和清理功能<br />
                确保您的重要数据安全可靠
              </Text>
              <Button 
                type="primary" 
                icon={<DatabaseOutlined />} 
                size="large"
                onClick={handleDataManageClick}
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                  border: 'none',
                  padding: '8px 32px',
                  height: 'auto',
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                }}
              >
                进入数据管理
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 添加奖励项的弹窗 */}
      <Modal
        title={
          <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            <TrophyOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
            添加奖励项目
          </div>
        }
        open={isRewardModalOpen}
        onCancel={() => setIsRewardModalOpen(false)}
        footer={null}
        width={400}
        style={{ top: '20vh' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddReward}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="name"
            label="奖励名称"
            rules={[
              { required: true, message: '请输入奖励名称' },
              { min: 2, message: '名称至少需要2个字符' },
              { max: 15, message: '名称不能超过15个字符' }
            ]}
          >
            <Input 
              placeholder="例如：完成作业、帮助家务等" 
              size="large"
              style={{ borderRadius: '8px' }}
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
              min={1} 
              max={100}
              placeholder="请输入积分数值" 
              size="large"
              style={{ width: '100%', borderRadius: '8px' }} 
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setIsRewardModalOpen(false)}
                style={{ borderRadius: '8px' }}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ 
                  borderRadius: '8px',
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

      {/* 添加惩罚项的弹窗 */}
      <Modal
        title={
          <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            <CloseCircleOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
            添加惩罚项目
          </div>
        }
        open={isPunishmentModalOpen}
        onCancel={() => setIsPunishmentModalOpen(false)}
        footer={null}
        width={400}
        style={{ top: '20vh' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddPunishment}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="name"
            label="惩罚名称"
            rules={[
              { required: true, message: '请输入惩罚名称' },
              { min: 2, message: '名称至少需要2个字符' },
              { max: 15, message: '名称不能超过15个字符' }
            ]}
          >
            <Input 
              placeholder="例如：迟到、不听话、乱扔东西等" 
              size="large"
              style={{ borderRadius: '8px' }}
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
              min={1} 
              max={100}
              placeholder="请输入积分数值" 
              size="large"
              style={{ width: '100%', borderRadius: '8px' }} 
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setIsPunishmentModalOpen(false)}
                style={{ borderRadius: '8px' }}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ 
                  borderRadius: '8px',
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