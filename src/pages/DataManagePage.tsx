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
    <div className="responsive-container">
      {/* 头部区域 */}
      <div className="responsive-header">
        <Title level={1} className="responsive-title" style={{ color: 'white', marginBottom: '8px' }}>
          数据管理
        </Title>
        <Text className="responsive-text" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          导出、导入和管理你的应用数据
        </Text>
      </div>

      {/* 导航栏 */}
      <div className="responsive-navbar">
        <Button
          type="text"
          icon={<HomeOutlined />}
          onClick={handleHomeClick}
          className="responsive-button"
          style={{
            color: 'white',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          返回首页
        </Button>
        <div></div>
      </div>

      {/* 主内容区域包装器 */}
      <div className="main-content-wrapper">
        {/* 数据统计 */}
        <Card className="responsive-card" bodyStyle={{ padding: '24px' }} style={{ width: '100%', maxWidth: '800px', marginBottom: '24px' }}>
          <Title level={3} className="responsive-subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
            数据统计
          </Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={12} sm={6}>
              <Statistic
                title="孩子数量"
                value={children.length}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="奖励项目"
                value={rewardItems.length}
                prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="惩罚项目"
                value={punishmentItems.length}
                prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                valueStyle={{ color: '#ff4d4f', textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="历史记录"
                value={records.length}
                prefix={<HistoryOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1', textAlign: 'center' }}
              />
            </Col>
          </Row>
          {children.length > 0 && (
            <Row gutter={[16, 16]} justify="center" style={{ marginTop: '24px' }}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="总积分"
                  value={totalPoints}
                  prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14', textAlign: 'center' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="平均积分"
                  value={averagePoints}
                  prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14', textAlign: 'center' }}
                />
              </Col>
            </Row>
          )}
        </Card>

        {/* 数据操作 */}
        <Card className="responsive-card" bodyStyle={{ padding: '24px' }} style={{ width: '100%', maxWidth: '800px' }}>
          <Title level={3} className="responsive-subtitle" style={{ textAlign: 'center', marginBottom: '24px' }}>
            数据操作
          </Title>
          
          <div className="responsive-content">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 导出数据 */}
              <Card
                className="responsive-card"
                style={{
                  background: 'rgba(24, 144, 255, 0.1)',
                  border: '1px solid rgba(24, 144, 255, 0.2)',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <DownloadOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
                    <Title level={4} className="responsive-subtitle" style={{ margin: '8px 0 4px' }}>
                      导出数据
                    </Title>
                    <Text className="responsive-text" style={{ color: '#666' }}>
                      将你的所有数据导出为JSON文件或复制到剪贴板
                    </Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Space wrap>
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={handleExportData}
                        className="responsive-button"
                        style={{
                          background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                          border: 'none',
                        }}
                      >
                        查看数据
                      </Button>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadData}
                        className="responsive-button"
                        style={{
                          background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                          border: 'none',
                        }}
                      >
                        下载文件
                      </Button>
                    </Space>
                  </div>
                </Space>
              </Card>

              {/* 导入数据 */}
              <Card
                className="responsive-card"
                style={{
                  background: 'rgba(82, 196, 26, 0.1)',
                  border: '1px solid rgba(82, 196, 26, 0.2)',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <UploadOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                    <Title level={4} className="responsive-subtitle" style={{ margin: '8px 0 4px' }}>
                      导入数据
                    </Title>
                    <Text className="responsive-text" style={{ color: '#666' }}>
                      从JSON文件或剪贴板导入数据（将覆盖现有数据）
                    </Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      onClick={() => setIsImportModalOpen(true)}
                      className="responsive-button"
                      style={{
                        background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                        border: 'none',
                      }}
                    >
                      导入数据
                    </Button>
                  </div>
                </Space>
              </Card>

              {/* 清空数据 */}
              <Card
                className="responsive-card"
                style={{
                  background: 'rgba(255, 77, 79, 0.1)',
                  border: '1px solid rgba(255, 77, 79, 0.2)',
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <DeleteOutlined style={{ fontSize: '32px', color: '#ff4d4f', marginBottom: '8px' }} />
                    <Title level={4} className="responsive-subtitle" style={{ margin: '8px 0 4px' }}>
                      清空数据
                    </Title>
                    <Text className="responsive-text" style={{ color: '#666' }}>
                      删除所有数据，包括孩子、项目和记录（不可恢复）
                    </Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleClearAllData}
                      className="responsive-button"
                      style={{
                        background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                        border: 'none',
                        color: 'white',
                      }}
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
                    <Paragraph className="responsive-text" style={{ margin: '8px 0' }}>
                      • <strong>导出数据</strong>：将当前所有数据保存为JSON格式，可用于备份或迁移
                    </Paragraph>
                    <Paragraph className="responsive-text" style={{ margin: '8px 0' }}>
                      • <strong>导入数据</strong>：从之前导出的JSON文件恢复数据，会覆盖当前所有数据
                    </Paragraph>
                    <Paragraph className="responsive-text" style={{ margin: '8px 0' }}>
                      • <strong>清空数据</strong>：删除所有数据，用于重新开始或解决问题
                    </Paragraph>
                    <Paragraph className="responsive-text" style={{ margin: '8px 0' }}>
                      • 建议定期导出数据进行备份，以防数据丢失
                    </Paragraph>
                  </div>
                }
                type="info"
                showIcon
                                 style={{ marginTop: '16px' }}
               />
            </Space>
          </div>
        </Card>
      </div>

      {/* 导出数据弹窗 */}
      <Modal
        title="导出的数据"
        open={isExportModalOpen}
        onCancel={() => setIsExportModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setIsExportModalOpen(false)} className="responsive-button">
              关闭
            </Button>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopyData}
              className="responsive-button"
              style={{
                background: 'linear-gradient(45deg, #1890ff, #36cfc9)',
                border: 'none',
              }}
            >
              复制到剪贴板
            </Button>
          </Space>
        }
        width={600}
        className="responsive-modal"
      >
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '8px', 
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
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
        className="responsive-modal"
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="注意"
            description="导入数据将覆盖当前所有数据，请确保已备份重要数据。"
            type="warning"
            showIcon
          />
          
          <div>
            <Title level={4} className="responsive-subtitle">从文件导入</Title>
            <Upload
              accept=".json"
              beforeUpload={handleImportFromFile}
              showUploadList={false}
              className="responsive-button"
            >
              <Button icon={<UploadOutlined />} className="responsive-button">
                选择JSON文件
              </Button>
            </Upload>
          </div>
          
          <div>
            <Title level={4} className="responsive-subtitle">从剪贴板导入</Title>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="粘贴JSON数据到这里..."
              style={{
                width: '100%',
                height: '200px',
                padding: '12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsImportModalOpen(false)} className="responsive-button">
                  取消
                </Button>
                <Button
                  type="primary"
                  onClick={handleImportFromText}
                  disabled={!importText.trim()}
                  className="responsive-button"
                  style={{
                    background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                    border: 'none',
                  }}
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