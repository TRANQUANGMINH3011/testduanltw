import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Input, Tag, Spin, Space, Modal } from 'antd';
import {
  RightOutlined,
  CameraOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  LaptopOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  SolutionOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FormOutlined,
  CalendarOutlined,
  SwapOutlined,
  TeamOutlined,
  SettingOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { Link, history } from 'umi';
import './index.less';
import { getDevices, Device } from '@/services/device.service';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [topDevices, setTopDevices] = useState<Device[]>([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    const fetchTopDevices = async () => {
      setLoading(true);
      try {
        console.log('Attempting to fetch top devices...');
        const response = await getDevices({ pageSize: 6 });
        console.log('Raw API Response for Top Devices:', response);

        if (!response || !response.data) {
          console.warn('API Response or response.data is undefined/null for top devices.', response);
          setTopDevices([]); // Ensure topDevices is an empty array
          return;
        }

        const devicesWithMockData = (response.data || []).map(device => ({
          ...device,
          // Ensure rating and borrowCount are always numbers
          rating: typeof device.rating === 'number' ? device.rating : Math.floor(Math.random() * (50 - 40) + 40) / 10,
          borrowCount: typeof device.borrowCount === 'number' ? device.borrowCount : Math.floor(Math.random() * (300 - 50) + 50),
        }));
        console.log('Processed Top Devices:', devicesWithMockData);
        setTopDevices(devicesWithMockData);
      } catch (error) {
        console.error('Error fetching top devices:', error);
        setTopDevices([]); // Set empty array on error as well
      } finally {
        setLoading(false);
      }
    };

    fetchTopDevices();
  }, []);

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'available':
        return <Tag color="success">Có sẵn</Tag>;
      case 'borrowed':
        return <Tag color="processing">Đang mượn</Tag>;
      case 'maintenance':
        return <Tag color="warning">Bảo trì</Tag>;
      case 'broken':
        return <Tag color="error">Hỏng</Tag>;
      case 'lost':
        return <Tag color="red">Mất</Tag>;
      default:
        return null;
    }
  };

  const handleViewDetail = (device: Device) => {
    setSelectedDevice(device);
    setIsDetailModalVisible(true);
  };

  return (
    <div className="home-landing">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <Tag color="gold" className="hero-tag">Hệ thống quản lý mượn số 1</Tag>
          <h1>Quản Lý Mượn Đồ Dùng <span className="highlight">Dễ Dàng & Hiệu Quả</span></h1>
          <Paragraph className="hero-description">
            Hệ thống quản lý mượn thiết bị dành cho sinh viên và câu lạc bộ.
            Theo dõi tình trạng thiết bị, quản lý yêu cầu mượn và nhận thông báo tự động.
          </Paragraph>
          <div className="hero-cta">
            <Button type="primary" size="large" className="cta-button">
              Đăng Ký Miễn Phí
            </Button>
            <Input placeholder="Nhập email của bạn" className="email-input" />
          </div>
        </div>
        <div className="hero-images">
          {/* Placeholder for floating device cards */}
          <div className="floating-card ipad-pro">
            <Card>
              <VideoCameraOutlined />
              <p>iPad Pro</p>
              <span>Available</span>
            </Card>
          </div>
          <div className="floating-card projector">
            <Card>
              <AppstoreOutlined />
              <p>Projector</p>
              <span>Available</span>
            </Card>
          </div>
          <div className="floating-card printer">
            <Card>
              <SolutionOutlined />
              <p>Printer</p>
              <span>Available</span>
            </Card>
          </div>
          <div className="floating-card camera">
            <Card>
              <CameraOutlined />
              <p>Camera</p>
              <span>Available</span>
            </Card>
          </div>
          <div className="floating-card headphone">
            <Card>
              <AudioOutlined />
              <p>Headphone</p>
              <span>Available</span>
            </Card>
          </div>
        </div>
      </div>

      {/* Thiết Bị Được Mượn Nhiều Nhất */}
      <div className="section most-borrowed-devices">
        <h2>Thiết Bị Được Mượn Nhiều Nhất</h2>
        <Paragraph className="section-description">
          Khám phá những thiết bị được sinh viên và cán bộ sử dụng thường xuyên nhất.
        </Paragraph>
        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            {topDevices.map((device) => (
              <Col xs={24} sm={12} md={8} lg={8} xl={8} key={device.id}>
                <Card
                  hoverable
                  className="device-card"
                >
                  <div className="device-card-content">
                    <div className="device-image-wrapper">
                      {device.imageUrl ? (
                        <img src={device.imageUrl} alt={device.name} className="device-image" />
                      ) : (
                        <div className="device-icon-placeholder">
                          {/* Placeholder icon based on category or default */}
                          {device.category === 'Laptop' && <LaptopOutlined />}
                          {device.category === 'Camera' && <CameraOutlined />}
                          {device.category === 'Projector' && <VideoCameraOutlined />}
                          {device.category === 'Microphone' && <AudioOutlined />}
                          {device.category === 'Monitor' && <AppstoreOutlined />}
                          {device.category === 'Other' && <AppstoreOutlined />}
                          {!device.category && <AppstoreOutlined />}
                        </div>
                      )}
                    </div>
                    <div className="device-info">
                      <h3>{device.name}</h3>
                      <Paragraph className="device-description">{device.description}</Paragraph>
                      <div className="device-stats">
                        <Tag color="gold">⭐ {device.rating || 'N/A'}</Tag>
                        <Tag color="blue">{device.borrowCount || 'N/A'} lượt mượn</Tag>
                        {getStatusTag(device.status)}
                      </div>
                      <Space className="device-actions">
                        <Button type="link" onClick={() => handleViewDetail(device)}>
                          Xem Chi Tiết
                        </Button>
                      </Space>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/devices">
            <Button className="view-all-button">
              <RightOutlined /> Xem Tất Cả Thiết Bị
            </Button>
          </Link>
        </div>
      </div>

      {/* Tính Năng Nổi Bật */}
      <div className="section features-section">
        <h2>Tính Năng Nổi Bật</h2>
        <Paragraph className="section-description">
          Khám phá những tính năng hiện đại giúp bạn quản lý thiết bị một cách dễ dàng.
        </Paragraph>
        <Row gutter={[24, 24]} className="feature-grid" justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <div className="feature-icon-wrapper bg-blue">
                <AppstoreOutlined />
              </div>
              <h3>Quản Lý Thiết Bị</h3>
              <p>Xem danh sách thiết bị có sẵn với thông tin chi tiết về số lượng và tình trạng.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <div className="feature-icon-wrapper bg-green">
                <FormOutlined />
              </div>
              <h3>Yêu Cầu Mượn</h3>
              <p>Gửi yêu cầu mượn thiết bị với ngày mượn và trả cụ thể, chờ phê duyệt.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <div className="feature-icon-wrapper bg-purple">
                <HistoryOutlined />
              </div>
              <h3>Theo Dõi Lịch Sử</h3>
              <p>Xem lịch sử mượn trả của bản thân và theo dõi tình trạng các yêu cầu.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <div className="feature-icon-wrapper bg-orange">
                <BellOutlined />
              </div>
              <h3>Thông Báo Tự Động</h3>
              <p>Nhận email thông báo khi yêu cầu được duyệt hoặc sắp đến hạn trả.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <div className="feature-icon-wrapper bg-red">
                <UserOutlined />
              </div>
              <h3>Quản Trị Viên</h3>
              <p>Công cụ quản lý dành cho admin để phê duyệt yêu cầu và theo dõi thiết bị.</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable className="feature-card">
              <div className="feature-icon-wrapper bg-blue">
                <TeamOutlined />
              </div>
              <h3>Dành Cho Sinh Viên</h3>
              <p>Giao diện thân thiện, dễ sử dụng dành riêng cho sinh viên và câu lạc bộ.</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Cách Hoạt Động */}
      <div className="section how-it-works-section">
        <h2>Cách Hoạt Động</h2>
        <Paragraph className="section-description">
          Chỉ với 3 bước đơn giản, bạn có thể mượn thiết bị một cách dễ dàng.
        </Paragraph>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={8}>
            <Card className="step-card">
              <div className="step-number">1</div>
              <h3>Duyệt Thiết Bị</h3>
              <p>Xem danh sách thiết bị có sẵn với thông tin chi tiết về số lượng và tình trạng.</p>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="step-card">
              <div className="step-number">2</div>
              <h3>Gửi Yêu Cầu</h3>
              <p>Điền thông tin và gửi yêu cầu mượn thiết bị để chờ phê duyệt.</p>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="step-card">
              <div className="step-number">3</div>
              <h3>Nhận & Trả</h3>
              <p>Nhận thiết bị tại phòng quản lý, trả đúng hạn.</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Kêu gọi hành động (CTA) bottom */}
      <div className="section cta-bottom-section">
        <h2>Sẵn Sàng Bắt Đầu?</h2>
        <Paragraph className="section-description">
          Tham gia hệ thống quản lý mượn đồ dùng hiện đại và tiện lợi ngay hôm nay.
        </Paragraph>
        <div className="cta-input-group">
          <Button type="primary" size="large" className="cta-button">
            Đăng Ký Miễn Phí
          </Button>
          <Input placeholder="Nhập email của bạn" className="email-input" />
        </div>
      </div>

      {/* Về Hệ Thống */}
      <div className="section about-system-section">
        <h2>Về Hệ Thống</h2>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card className="about-card">
              <h3>Dành Cho Sinh Viên</h3>
              <ul>
                <li>Đăng nhập và xem thiết bị có sẵn</li>
                <li>Gửi yêu cầu mượn</li>
                <li>Theo dõi lịch sử mượn</li>
                <li>Nhận thông báo qua email</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="about-card">
              <h3>Dành Cho Quản Trị Viên</h3>
              <ul>
                <li>Phê duyệt yêu cầu</li>
                <li>Quản lý thiết bị</li>
                <li>Thống kê sử dụng</li>
                <li>Phân quyền</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Chân trang (Footer) */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-column">
            <div className="logo-text">lendHUB</div>
            <p className="slogan">Giải pháp quản lý thiết bị hiện đại dành cho sinh viên và câu lạc bộ.</p>
          </div>
          <div className="footer-column">
            <h3>Liên Kết</h3>
            <ul>
              <li><Link to="/user/login">Đăng Nhập</Link></li>
              <li><Link to="/user/register">Đăng Ký</Link></li>
              <li><Link to="/features">Tính Năng</Link></li>
              <li><Link to="/about">Giới Thiệu</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Hỗ Trợ</h3>
            <p>Email: support@example.com</p>
            <p>Điện thoại: (84) 0123-456-789</p>
            <p>Thời gian: 8:00 - 17:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 lendHUB. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>

      {/* Detail Modal for devices */}
      <Modal
        title="Chi tiết thiết bị"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedDevice && (
          <Card>
            <p><strong>Tên thiết bị:</strong> {selectedDevice.name}</p>
            <p><strong>Mã số:</strong> {selectedDevice.serialNumber}</p>
            <p><strong>Danh mục:</strong> {selectedDevice.category}</p>
            <p><strong>Trạng thái:</strong> {getStatusTag(selectedDevice.status)}</p>
            <p><strong>Vị trí:</strong> {selectedDevice.location}</p>
            <p><strong>Mô tả:</strong> {selectedDevice.description || 'Không có mô tả'}</p>
            <Button type="primary" block style={{ marginTop: 20 }} onClick={() => history.push(`/borrow/${selectedDevice.id}`)}>
              Mượn ngay
            </Button>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default HomePage;
