import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Card, Typography, Space, Empty } from 'antd';
import { PlusOutlined, SettingOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';
import ChildAvatar from '../components/ChildAvatar';
import { Child } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const { children, addChild, deleteChild } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleAddChild = (values: any) => {
    addChild({
      name: values.name,
    });
    form.resetFields();
    setIsModalOpen(false);
    message.success('添加成功');
  };

  const handleChildClick = (child: Child) => {
    navigate(`/child/${child.id}`);
  };

  const handleSettingClick = () => {
    navigate('/settings');
  };

  // 计算总积分和平均积分
  const totalPoints = children.reduce((sum, child) => sum + child.points, 0);
  const averagePoints = children.length > 0 ? Math.round(totalPoints / children.length) : 0;

  return (
    <div 
      className="home-page" 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        position: 'relative'
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
        <div style={{ flex: 1 }} />
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
          儿童习惯养成积分奖励
        </Title>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="text"
            icon={<SettingOutlined />}
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
            onClick={handleSettingClick}
          />
        </div>
      </div>

      {/* 统计卡片 */}
      {children.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <Card
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: 'none',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {children.length}
                </div>
                <Text type="secondary">孩子数量</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {totalPoints}
                </div>
                <Text type="secondary">总积分</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                  {averagePoints}
                </div>
                <Text type="secondary">平均积分</Text>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 孩子列表 */}
      <div style={{ marginBottom: '100px' }}>
        {children.length === 0 ? (
          <Card
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: 'none',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              padding: '40px 20px',
            }}
          >
            <Empty
              image={<TrophyOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
              description={
                <div>
                  <Text style={{ fontSize: '16px', color: '#666' }}>
                    还没有添加孩子
                  </Text>
                  <br />
                  <Text style={{ fontSize: '14px', color: '#999' }}>
                    点击右下角的"+"按钮开始添加第一个孩子吧！
                  </Text>
                </div>
              }
            />
          </Card>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
              padding: '0 10px',
            }}
          >
            {children.map(child => (
              <Card
                key={child.id}
                hoverable
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                bodyStyle={{ padding: '20px' }}
                onClick={() => handleChildClick(child)}
              >
                {/* 删除按钮 */}
                <Button
                  danger
                  size="small"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    borderRadius: '50%',
                    minWidth: '24px',
                    height: '24px',
                    padding: 0,
                    zIndex: 10,
                    background: 'rgba(255, 77, 79, 0.9)',
                    border: 'none',
                    color: 'white',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
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
                  ×
                </Button>

                {/* 积分徽章 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: child.points >= 0 ? '#52c41a' : '#ff4d4f',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <StarOutlined />
                  {child.points}
                </div>

                <ChildAvatar child={child} onClick={() => {}} />
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 添加孩子按钮 */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        className="float-button"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
          border: 'none',
          boxShadow: '0 8px 24px rgba(24, 144, 255, 0.4)',
          zIndex: 1000,
        }}
        onClick={() => setIsModalOpen(true)}
      />

      {/* 添加孩子的弹窗 */}
      <Modal
        title={
          <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            添加新的孩子
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={400}
        style={{ top: '20vh' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddChild}
          style={{ marginTop: '20px' }}
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
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setIsModalOpen(false)}
                style={{ borderRadius: '8px' }}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{ 
                  borderRadius: '8px',
                  background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
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

export default HomePage;