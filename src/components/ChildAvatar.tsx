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
      className={`child-avatar-wrapper ${className || ''}`}
      onClick={onClick ? () => onClick(child) : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ position: 'relative', marginBottom: '6px' }}>
        <Avatar 
          size={size} 
          icon={<UserOutlined />} 
          src={child.avatar}
          style={{ 
            backgroundColor: !child.avatar ? '#1890ff' : undefined,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '3px solid white',
            transition: 'all 0.3s ease',
          }}
        />
        {/* 积分指示器 */}
        <div
          style={{
            position: 'absolute',
            bottom: -6,
            right: -6,
            background: child.points >= 0 ? '#52c41a' : '#ff4d4f',
            color: 'white',
            borderRadius: '50%',
            width: Math.max(22, size * 0.3),
            height: Math.max(22, size * 0.3),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.max(11, size * 0.15),
            fontWeight: 'bold',
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
          }}
        >
          {child.points >= 0 ? '+' : ''}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Text 
          strong 
          style={{ 
            fontSize: 14, 
            color: '#333',
            display: 'block',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {child.name}
        </Text>
        <Text 
          style={{ 
            fontSize: 11, 
            color: '#52c41a',
            fontWeight: 'bold',
            background: 'rgba(82, 196, 26, 0.1)',
            padding: '1px 4px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
          }}
        >
          {child.points}积分
        </Text>
      </div>
    </div>
  );
};

export default ChildAvatar;