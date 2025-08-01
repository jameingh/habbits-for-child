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
        padding: '1rem',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Avatar 
          size={size} 
          icon={<UserOutlined />} 
          src={child.avatar}
          style={{ 
            background: child.avatar ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '4px solid rgba(255, 255, 255, 0.8)',
            boxShadow: 'var(--shadow-lg)',
            transition: 'all 0.3s ease',
          }}
        />
        {/* 积分指示器 */}
        <div
          style={{
            position: 'absolute',
            bottom: -8,
            right: -8,
            background: child.points >= 0 
              ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' 
              : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            borderRadius: '50%',
            width: Math.max(24, size * 0.3),
            height: Math.max(24, size * 0.3),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.max(12, size * 0.15),
            fontWeight: 'bold',
            border: '3px solid rgba(255, 255, 255, 0.9)',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.3s ease',
          }}
        >
          {child.points >= 0 ? `+${child.points}` : child.points}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Text 
          strong 
          style={{ 
            fontSize: size > 60 ? '1rem' : '0.875rem',
            color: 'var(--text-primary)',
            display: 'block',
            marginBottom: '0.5rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            fontWeight: 600,
          }}
        >
          {child.name}
        </Text>
        <div
          style={{
            fontSize: size > 60 ? '0.75rem' : '0.625rem',
            fontWeight: 600,
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-md)',
            background: child.points >= 0 
              ? 'rgba(79, 172, 254, 0.1)' 
              : 'rgba(250, 112, 154, 0.1)',
            color: child.points >= 0 ? '#4facfe' : '#fa709a',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          {child.points >= 0 ? `+${child.points}` : child.points} 积分
        </div>
      </div>
    </div>
  );
};

export default ChildAvatar;