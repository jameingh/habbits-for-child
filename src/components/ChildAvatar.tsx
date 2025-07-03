import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Child } from '../types';

const { Text } = Typography;

interface ChildAvatarProps {
  child: Child;
  onClick: (child: Child) => void;
}

const ChildAvatar: React.FC<ChildAvatarProps> = ({ child, onClick }) => {
  return (
    <div 
      className="child-avatar-container" 
      onClick={() => onClick(child)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: '12px',
      }}
    >
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Avatar 
          size={80} 
          icon={<UserOutlined />} 
          src={child.avatar}
          style={{ 
            backgroundColor: !child.avatar ? '#1890ff' : undefined,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '3px solid white',
          }}
        />
        {/* 积分指示器 */}
        <div
          style={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            background: child.points >= 0 ? '#52c41a' : '#ff4d4f',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          {child.points >= 0 ? '+' : ''}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Text 
          strong 
          style={{ 
            fontSize: '16px', 
            color: '#333',
            display: 'block',
            marginBottom: '4px',
            wordBreak: 'break-word',
          }}
        >
          {child.name}
        </Text>
        <Text 
          style={{ 
            fontSize: '14px', 
            color: child.points >= 0 ? '#52c41a' : '#ff4d4f',
            fontWeight: 'bold',
          }}
        >
          {child.points} 积分
        </Text>
      </div>
    </div>
  );
};

export default ChildAvatar;