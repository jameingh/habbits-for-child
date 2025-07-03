import React, { useState } from 'react';
import { Button, Tabs, List, Modal, Form, Input, InputNumber, message } from 'antd';
import { PlusOutlined, HomeOutlined, TrophyOutlined, CloseCircleOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RewardPunishItem } from '../types';
import { useAppContext } from '../context/AppContext';

const { TabPane } = Tabs;

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

  return (
    <div className="settings-page" style={{ padding: '20px', height: '100vh' }}>
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
        <h1>设置</h1>
        <Button
          type="text"
          icon={<DatabaseOutlined />}
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
          onClick={handleDataManageClick}
        />
      </div>

      <Tabs defaultActiveKey="reward">
        <TabPane 
          tab={<span><TrophyOutlined /> 奖励项</span>} 
          key="reward"
        >
          <div style={{ position: 'relative', minHeight: '300px' }}>
            <List
              itemLayout="horizontal"
              dataSource={rewardItems}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button danger onClick={() => {
                      deleteRewardItem(item.id);
                      message.success('删除成功');
                    }}>删除</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`+${item.points} 分`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无奖励项，请添加' }}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.7)',
              }}
              onClick={() => setIsRewardModalOpen(true)}
            >
              添加奖励
            </Button>
          </div>
        </TabPane>
        <TabPane 
          tab={<span><CloseCircleOutlined /> 惩罚项</span>} 
          key="punishment"
        >
          <div style={{ position: 'relative', minHeight: '300px' }}>
            <List
              itemLayout="horizontal"
              dataSource={punishmentItems}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button danger onClick={() => {
                      deletePunishmentItem(item.id);
                      message.success('删除成功');
                    }}>删除</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.points} 分`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: '暂无惩罚项，请添加' }}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.7)',
              }}
              onClick={() => setIsPunishmentModalOpen(true)}
            >
              添加惩罚
            </Button>
          </div>
        </TabPane>
        <TabPane 
          tab={<span><DatabaseOutlined /> 数据管理</span>} 
          key="data"
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>数据管理</h3>
            <p>管理您的数据，包括备份、恢复和清理功能</p>
            <Button 
              type="primary" 
              icon={<DatabaseOutlined />} 
              size="large"
              onClick={handleDataManageClick}
              style={{ marginTop: '20px' }}
            >
              进入数据管理
            </Button>
          </div>
        </TabPane>
      </Tabs>

      {/* 添加奖励项的弹窗 */}
      <Modal
        title="添加奖励项"
        open={isRewardModalOpen}
        onCancel={() => setIsRewardModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddReward}
        >
          <Form.Item
            name="name"
            label="奖励名称"
            rules={[{ required: true, message: '请输入奖励名称' }]}
          >
            <Input placeholder="请输入奖励名称" />
          </Form.Item>
          <Form.Item
            name="points"
            label="加分值"
            rules={[{ required: true, message: '请输入加分值' }]}
          >
            <InputNumber min={1} placeholder="请输入加分值" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加惩罚项的弹窗 */}
      <Modal
        title="添加惩罚项"
        open={isPunishmentModalOpen}
        onCancel={() => setIsPunishmentModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddPunishment}
        >
          <Form.Item
            name="name"
            label="惩罚名称"
            rules={[{ required: true, message: '请输入惩罚名称' }]}
          >
            <Input placeholder="请输入惩罚名称" />
          </Form.Item>
          <Form.Item
            name="points"
            label="减分值"
            rules={[{ required: true, message: '请输入减分值' }]}
          >
            <InputNumber min={1} placeholder="请输入减分值" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPage;