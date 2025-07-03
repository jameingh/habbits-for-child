import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Child } from '../types';

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
        margin: '10px',
        cursor: 'pointer',
      }}
    >
      <Avatar 
        size={80} 
        icon={<UserOutlined />} 
        src={child.avatar}
        style={{ 
          backgroundColor: !child.avatar ? '#1677ff' : undefined,
        }}
      />
      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <div>{child.name}</div>
        <div style={{ fontSize: '12px' }}>{child.points} 分</div>
      </div>
    </div>
  );
};

export default ChildAvatar;