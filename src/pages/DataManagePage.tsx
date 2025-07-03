import React, { useState } from 'react';
import { Button, Card, Space, Modal, Input, message, Statistic, Row, Col, Typography, Divider } from 'antd';
import { 
  HomeOutlined, 
  ExportOutlined, 
  ImportOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const { TextArea } = Input;
const { Title, Text } = Typography;

const DataManagePage: React.FC = () => {
  const { children, rewardItems, punishmentItems, records, clearAllData, exportData, importData } = useAppContext();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [importDataString, setImportDataString] = useState('');
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleExport = () => {
    const data = exportData();
    setExportedData(data);
    setIsExportModalOpen(true);
  };

  const handleDownload = () => {
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('数据已下载');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportedData).then(() => {
      message.success('数据已复制到剪贴板');
    });
  };

  const handleImport = () => {
    if (!importDataString.trim()) {
      message.error('请输入要导入的数据');
      return;
    }

    const success = importData(importDataString);
    if (success) {
      message.success('数据导入成功');
      setIsImportModalOpen(false);
      setImportDataString('');
    } else {
      message.error('数据导入失败，请检查数据格式');
    }
  };

  const handleClearData = () => {
    Modal.confirm({
      title: '确认清空所有数据',
      content: '此操作将删除所有孩子、奖励项、惩罚项和记录数据，且无法恢复。请确认是否继续？',
      okText: '确认清空',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        clearAllData();
        message.success('所有数据已清空');
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportDataString(content);
      };
      reader.readAsText(file);
    }
  };

  // 计算总积分
  const totalPoints = children.reduce((sum, child) => sum + child.points, 0);
  const totalRecords = records.length;

  return (
    <div className="data-manage-page" style={{ padding: '20px', minHeight: '100vh' }}>
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
        <Title level={2} style={{ margin: 0 }}>数据管理</Title>
        <div style={{ width: '48px' }}></div>
      </div>

      {/* 数据统计 */}
      <Card title="数据统计" style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="孩子数量" value={children.length} />
          </Col>
          <Col span={6}>
            <Statistic title="奖励项目" value={rewardItems.length} />
          </Col>
          <Col span={6}>
            <Statistic title="惩罚项目" value={punishmentItems.length} />
          </Col>
          <Col span={6}>
            <Statistic title="总记录数" value={totalRecords} />
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="总积分" value={totalPoints} />
          </Col>
          <Col span={12}>
            <Statistic 
              title="平均积分" 
              value={children.length > 0 ? Math.round(totalPoints / children.length) : 0} 
            />
          </Col>
        </Row>
      </Card>

      {/* 数据操作 */}
      <Card title="数据操作">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={4}>
              <ExportOutlined /> 导出数据
            </Title>
            <Text type="secondary">
              将当前所有数据导出为JSON文件，可用于备份或迁移到其他设备
            </Text>
            <div style={{ marginTop: '10px' }}>
              <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
                导出数据
              </Button>
            </div>
          </div>

          <Divider />

          <div>
            <Title level={4}>
              <ImportOutlined /> 导入数据
            </Title>
            <Text type="secondary">
              从JSON文件导入数据，将替换当前所有数据
            </Text>
            <div style={{ marginTop: '10px' }}>
              <Space>
                <Button icon={<ImportOutlined />} onClick={() => setIsImportModalOpen(true)}>
                  导入数据
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <Button 
                  icon={<UploadOutlined />} 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  选择文件
                </Button>
              </Space>
            </div>
          </div>

          <Divider />

          <div>
            <Title level={4}>
              <DeleteOutlined /> 清空数据
            </Title>
            <Text type="secondary">
              删除所有数据，包括孩子信息、奖励项、惩罚项和记录
            </Text>
            <div style={{ marginTop: '10px' }}>
              <Button danger icon={<DeleteOutlined />} onClick={handleClearData}>
                清空所有数据
              </Button>
            </div>
          </div>
        </Space>
      </Card>

      {/* 数据存储说明 */}
      <Card title="数据存储说明" style={{ marginTop: '20px' }}>
        <Space direction="vertical">
          <Text>
            <InfoCircleOutlined /> 数据存储在浏览器的本地存储（localStorage）中
          </Text>
          <Text>
            • 数据会在应用重启后自动加载
          </Text>
          <Text>
            • 清除浏览器数据会导致数据丢失
          </Text>
          <Text>
            • 建议定期导出数据进行备份
          </Text>
          <Text>
            • 更换设备时可通过导入功能恢复数据
          </Text>
        </Space>
      </Card>

      {/* 导出数据弹窗 */}
      <Modal
        title="导出数据"
        open={isExportModalOpen}
        onCancel={() => setIsExportModalOpen(false)}
        footer={[
          <Button key="copy" onClick={handleCopyToClipboard}>
            复制到剪贴板
          </Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
            下载文件
          </Button>,
        ]}
        width={800}
      >
        <div style={{ marginBottom: '10px' }}>
          <Text>以下是您的数据，可以复制或下载保存：</Text>
        </div>
        <TextArea
          value={exportedData}
          rows={15}
          readOnly
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        />
      </Modal>

      {/* 导入数据弹窗 */}
      <Modal
        title="导入数据"
        open={isImportModalOpen}
        onCancel={() => setIsImportModalOpen(false)}
        onOk={handleImport}
        okText="导入"
        cancelText="取消"
        width={800}
      >
        <div style={{ marginBottom: '10px' }}>
          <Text>请粘贴要导入的JSON数据：</Text>
        </div>
        <TextArea
          value={importDataString}
          onChange={(e) => setImportDataString(e.target.value)}
          rows={15}
          placeholder="请粘贴JSON数据..."
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        />
        <div style={{ marginTop: '10px' }}>
          <Text type="warning">
            <InfoCircleOutlined /> 导入数据将替换当前所有数据，请确保已备份重要数据
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default DataManagePage; 