import { useState, useEffect } from 'react';
import { Card, DatePicker, Row, Col, Statistic, Spin } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';
import { getThongKeMuonTheoThang, getThongKeTongQuan } from '@/services/ThongKe';
import moment from 'moment';
import { TeamOutlined, ToolOutlined, SyncOutlined, BellOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';

const { MonthPicker } = DatePicker;

type ChartPropsType = {
  xAxis: string[];
  yAxis: number[][];
  yLabel: string[];
};

const DashboardPage = () => {
  const [chartProps, setChartProps] = useState<ChartPropsType>({
    xAxis: [],
    yAxis: [],
    yLabel: [],
  });

  const [statsData, setStatsData] = useState({ totalEquipments: 0, borrowedEquipments: 0, pendingRequests: 0 });
  const [month, setMonth] = useState(moment());
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const res = await getThongKeTongQuan();
          setStatsData(res);
        } catch (error) {
          console.error("Failed to fetch stats data:", error);
        } finally {
          setLoadingStats(false);
        }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const response = await getThongKeMuonTheoThang({ month: month.format('YYYY-MM') });
        
        const xAxisData = response.data.map(item => item.tenThietBi);
        const yAxisData = [response.data.map(item => item.soLanMuon)];
        const yLabelData = ['Số lần mượn'];

        setChartProps({
          xAxis: xAxisData,
          yAxis: yAxisData,
          yLabel: yLabelData,
        });

      } catch(error) {
        console.error("Failed to fetch chart data:", error);
        setChartProps({ xAxis: [], yAxis: [], yLabel: [] });
      } finally {
        setLoadingChart(false);
      }
    };
    fetchChartData();
  }, [month]);

  const totalBorrowsInMonth = (chartProps.yAxis[0] || []).reduce((acc, val) => acc + val, 0);

  return (
    <PageContainer>
        <Spin spinning={loadingStats}>
            {/* SỬA Ở ĐÂY: Hiển thị đầy đủ 4 thẻ thống kê */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card>
                      <Statistic title="Tổng số thiết bị" value={statsData.totalEquipments} prefix={<ToolOutlined />} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                      <Statistic title="Đang cho mượn" value={statsData.borrowedEquipments} valueStyle={{ color: '#cf1322' }} prefix={<SyncOutlined />} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                      <Statistic title="Yêu cầu chờ duyệt" value={statsData.pendingRequests} valueStyle={{ color: '#faad14' }} prefix={<BellOutlined />} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                      <Statistic title="Lượt mượn trong tháng" value={totalBorrowsInMonth} prefix={<TeamOutlined />} />
                  </Card>
                </Col>
            </Row>
      </Spin>
      <Card>
        <MonthPicker
          value={month}
          onChange={(date) => setMonth(date || moment())}
          placeholder="Chọn tháng"
          style={{ marginBottom: 16 }}
        />
        <Spin spinning={loadingChart}>
            <ColumnChart
                height={350}
                title="Thống kê thiết bị được mượn nhiều nhất"
                xAxis={chartProps.xAxis}
                yAxis={chartProps.yAxis}
                yLabel={chartProps.yLabel}
            />
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default DashboardPage;