import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import ChildAvatar from '../components/ChildAvatar';
import { Child } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

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

  return (
    <div className="home-page" style={{ padding: '20px', height: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>儿童习惯养成积分奖励</h1>
      </div>
      
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          padding: '20px',
        }}
      >
        {children.map(child => (
          <div key={child.id} style={{ position: 'relative' }}>
            <ChildAvatar 
              child={child} 
              onClick={handleChildClick} 
            />
            <Button
              danger
              size="small"
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                borderRadius: '50%',
                minWidth: '24px',
                height: '24px',
                padding: 0,
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
          </div>
        ))}
      </div>

      {/* 添加孩子按钮 */}
      <Button
        type="text"
        icon={<PlusOutlined />}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '24px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '50%',
        }}
        onClick={() => setIsModalOpen(true)}
      />

      {/* 设置按钮 */}
      <Button
        type="text"
        icon={<SettingOutlined />}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          fontSize: '24px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '50%',
        }}
        onClick={handleSettingClick}
      />

      {/* 添加孩子的弹窗 */}
      <Modal
        title="添加孩子"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddChild}
        >
          <Form.Item
            name="name"
            label="孩子名称"
            rules={[{ required: true, message: '请输入孩子名称' }]}
          >
            <Input placeholder="请输入孩子名称" />
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

export default HomePage;