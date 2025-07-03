import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Child } from '../types';

const { Text } = Typography;

interface ChildAvatarProps {
  child: Child;
  onClick?: (child: Child) => void;
  size?: number;
  className?: string;
}

const ChildAvatar: React.FC<ChildAvatarProps> = ({ child, onClick, size = 80, className }) => {
  return (
    <div 
      className={`child-avatar-container ${className || ''}`}
      onClick={onClick ? () => onClick(child) : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 10px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        borderRadius: '12px',
      }}
    >
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Avatar 
          size={size} 
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
            width: Math.max(20, size * 0.3),
            height: Math.max(20, size * 0.3),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.max(10, size * 0.15),
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
            fontSize: Math.max(14, size * 0.2), 
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
            fontSize: Math.max(12, size * 0.175), 
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