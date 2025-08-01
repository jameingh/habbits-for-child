import React, { useState } from 'react';
import { Button, Card, Typography, Space, Upload, message, Modal, Statistic, Row, Col, Alert } from 'antd';
import { HomeOutlined, DownloadOutlined, UploadOutlined, DeleteOutlined, CopyOutlined, FileTextOutlined, UserOutlined, TrophyOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const { Title, Text, Paragraph } = Typography;

const DataManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { children, rewardItems, punishmentItems, records, clearAllData, exportData, importData } = useAppContext();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [importText, setImportText] = useState('');

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleExportData = () => {
    const data = exportData();
    setExportedData(data);
    setIsExportModalOpen(true);
  };

  const handleDownloadData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('数据已导出到文件');
  };

  const handleCopyData = () => {
    navigator.clipboard.writeText(exportedData).then(() => {
      message.success('数据已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const handleImportFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importData(content)) {
        message.success('数据导入成功');
        setIsImportModalOpen(false);
      } else {
        message.error('数据格式错误，导入失败');
      }
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  const handleImportFromText = () => {
    if (importData(importText)) {
      message.success('数据导入成功');
      setIsImportModalOpen(false);
      setImportText('');
    } else {
      message.error('数据格式错误，导入失败');
    }
  };

  const handleClearAllData = () => {
    Modal.confirm({
      title: '确认清空所有数据',
      content: '此操作将删除所有孩子、奖励项目、惩罚项目和记录数据，且无法恢复。确定要继续吗？',
      okText: '确认清空',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        clearAllData();
        message.success('所有数据已清空');
      }
    });
  };

  const totalPoints = children.reduce((sum, child) => sum + child.points, 0);
  const averagePoints = children.length > 0 ? Math.round(totalPoints / children.length) : 0;

  return (
    <div className="settings-container">
      {/* 头部区域 */}
      <div className="hero-section">
        <div className="hero-content">
          <Title level={1} className="hero-title">
            数据管理
          </Title>
          <Text className="hero-subtitle">
            导出、导入和管理你的应用数据
          </Text>
        </div>
        
        {/* 导航按钮 */}
        <div className="nav-buttons">
          <Button
            className="nav-button"
            icon={<HomeOutlined />}
            onClick={handleHomeClick}
          >
            返回首页
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="main-content">
        {/* 数据统计 */}
        <Card className="modern-card" style={{ marginBottom: '2rem' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            数据统计
          </Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={12} sm={6}>
              <Statistic
                title="孩子数量"
                value={children.length}
                prefix={<UserOutlined style={{ color: '#667eea' }} />}
                valueStyle={{ color: '#667eea', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="奖励项目"
                value={rewardItems.length}
                prefix={<TrophyOutlined style={{ color: '#4facfe' }} />}
                valueStyle={{ color: '#4facfe', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="惩罚项目"
                value={punishmentItems.length}
                prefix={<CloseCircleOutlined style={{ color: '#fa709a' }} />}
                valueStyle={{ color: '#fa709a', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="历史记录"
                value={records.length}
                prefix={<HistoryOutlined style={{ color: '#764ba2' }} />}
                valueStyle={{ color: '#764ba2', textAlign: 'center' }}
              />
            </Col>
          </Row>
          {children.length > 0 && (
            <Row gutter={[16, 16]} justify="center" style={{ marginTop: '1.5rem' }}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="总积分"
                  value={totalPoints}
                  prefix={<TrophyOutlined style={{ color: '#43e97b' }} />}
                  valueStyle={{ color: '#43e97b', textAlign: 'center' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="平均积分"
                  value={averagePoints}
                  prefix={<TrophyOutlined style={{ color: '#43e97b' }} />}
                  valueStyle={{ color: '#43e97b', textAlign: 'center' }}
                />
              </Col>
            </Row>
          )}
        </Card>

        {/* 数据操作 */}
        <Card className="modern-card">
          <Title level={3} style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            数据操作
          </Title>
          
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 导出数据 */}
            <Card
              className="modern-card"
              style={{
                background: 'rgba(79, 172, 254, 0.1)',
                border: '1px solid rgba(79, 172, 254, 0.2)',
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <DownloadOutlined style={{ fontSize: '2rem', color: '#4facfe', marginBottom: '0.5rem' }} />
                  <Title level={4} style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-primary)' }}>
                    导出数据
                  </Title>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    将你的所有数据导出为JSON文件或复制到剪贴板
                  </Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Space wrap>
                    <Button
                      className="modern-button success"
                      icon={<FileTextOutlined />}
                      onClick={handleExportData}
                    >
                      查看数据
                    </Button>
                    <Button
                      className="modern-button success"
                      icon={<DownloadOutlined />}
                      onClick={handleDownloadData}
                    >
                      下载文件
                    </Button>
                  </Space>
                </div>
              </Space>
            </Card>

            {/* 导入数据 */}
            <Card
              className="modern-card"
              style={{
                background: 'rgba(67, 233, 123, 0.1)',
                border: '1px solid rgba(67, 233, 123, 0.2)',
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <UploadOutlined style={{ fontSize: '2rem', color: '#43e97b', marginBottom: '0.5rem' }} />
                  <Title level={4} style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-primary)' }}>
                    导入数据
                  </Title>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    从JSON文件或剪贴板导入数据（将覆盖现有数据）
                  </Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    className="modern-button warning"
                    icon={<UploadOutlined />}
                    onClick={() => setIsImportModalOpen(true)}
                  >
                    导入数据
                  </Button>
                </div>
              </Space>
            </Card>

            {/* 清空数据 */}
            <Card
              className="modern-card"
              style={{
                background: 'rgba(250, 112, 154, 0.1)',
                border: '1px solid rgba(250, 112, 154, 0.2)',
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <DeleteOutlined style={{ fontSize: '2rem', color: '#fa709a', marginBottom: '0.5rem' }} />
                  <Title level={4} style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-primary)' }}>
                    清空数据
                  </Title>
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    删除所有数据，包括孩子、项目和记录（不可恢复）
                  </Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    className="modern-button danger"
                    icon={<DeleteOutlined />}
                    onClick={handleClearAllData}
                  >
                    清空所有数据
                  </Button>
                </div>
              </Space>
            </Card>

            {/* 使用说明 */}
            <Alert
              message="使用说明"
              description={
                <div>
                  <Paragraph style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                    • <strong>导出数据</strong>：将当前所有数据保存为JSON格式，可用于备份或迁移
                  </Paragraph>
                  <Paragraph style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                    • <strong>导入数据</strong>：从之前导出的JSON文件恢复数据，会覆盖当前所有数据
                  </Paragraph>
                  <Paragraph style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                    • <strong>清空数据</strong>：删除所有数据，用于重新开始或解决问题
                  </Paragraph>
                  <Paragraph style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                    • 建议定期导出数据进行备份，以防数据丢失
                  </Paragraph>
                </div>
              }
              type="info"
              showIcon
              style={{ marginTop: '1rem' }}
            />
          </Space>
        </Card>
      </div>

      {/* 导出数据弹窗 */}
      <Modal
        title="导出的数据"
        open={isExportModalOpen}
        onCancel={() => setIsExportModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setIsExportModalOpen(false)}>
              关闭
            </Button>
            <Button
              className="modern-button success"
              icon={<CopyOutlined />}
              onClick={handleCopyData}
            >
              复制到剪贴板
            </Button>
          </Space>
        }
        width={600}
        className="clay-modal"
      >
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <pre style={{ 
            background: 'var(--bg-secondary)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-lg)', 
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            color: 'var(--text-primary)'
          }}>
            {exportedData}
          </pre>
        </div>
      </Modal>

      {/* 导入数据弹窗 */}
      <Modal
        title="导入数据"
        open={isImportModalOpen}
        onCancel={() => setIsImportModalOpen(false)}
        footer={null}
        width={600}
        className="clay-modal"
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="注意"
            description="导入数据将覆盖当前所有数据，请确保已备份重要数据。"
            type="warning"
            showIcon
          />
          
          <div>
            <Title level={4} style={{ color: 'var(--text-primary)' }}>从文件导入</Title>
            <Upload
              accept=".json"
              beforeUpload={handleImportFromFile}
              showUploadList={false}
            >
              <Button className="modern-button" icon={<UploadOutlined />}>
                选择JSON文件
              </Button>
            </Upload>
          </div>
          
          <div>
            <Title level={4} style={{ color: 'var(--text-primary)' }}>从剪贴板导入</Title>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="粘贴JSON数据到这里..."
              style={{
                width: '100%',
                height: '200px',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                resize: 'vertical',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)'
              }}
            />
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsImportModalOpen(false)}>
                  取消
                </Button>
                <Button
                  className="modern-button warning"
                  onClick={handleImportFromText}
                  disabled={!importText.trim()}
                >
                  导入数据
                </Button>
              </Space>
            </div>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default DataManagePage; 