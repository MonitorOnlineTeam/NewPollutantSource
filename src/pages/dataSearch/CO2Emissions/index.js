import React, { PureComponent } from 'react';
import NavigationTree from '@/components/NavigationTree'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { Card, Row, Col, Divider, Statistic, Tooltip } from 'antd';
import { InfoCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import styles from './index.less'
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/pages/Charts';
import moment from 'moment'

const gridStyle = {
  // width: '32%',
  position: 'relative',
  padding: "20px 24px 8px",
  // marginBottom: 10,
  // marginRight: "10px",
  boxShadow: "1px -2px 2px -2px rgb(0 0 0 / 16%), 1px 2px 6px 0 rgb(0 0 0 / 12%)",
};

const iconStyle = {
  marginLeft: 6,
  color: "rgb(128, 128, 128)",
  position: 'absolute',
  right: 24,
  top: 24,
}

const beginDay = new Date().getTime() - 1000 * 60 * 60 * 24;
const fakeY = [1, 2, 1, 3, 1, 1, 3, 2, 1, 3, 1, 2, 2, 4, 2, 3, 1, 3, 1, 1, 2, 3, 1, 1];
const visitData = [];
for (let i = 0; i < 24; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * i)).format('YYYY-MM-DD HH'),
    y: fakeY[i],
  });
}

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeSelect: {}
    };
  }
  render() {
    const { treeSelect } = this.state;
    console.log("visitData=", visitData)
    return (
      <>
        <NavigationTree
          checkpPol="2"
          polShow
          // polShow
          domId="#CO2Emissions"
          onItemClick={value => {
            if (value.length) {
              this.setState({ treeSelect: value[0] })
            } else {
              message.error("请在左侧勾选监测点")
            }
          }}
        />
        <div id="CO2Emissions">
          <BreadcrumbWrapper>
            <Card>
              <h3>{`${treeSelect.entName} - ${treeSelect.pointName}`}</h3>
              <Divider dashed style={{ marginBottom: 0 }} />
              <Row gutter={64}>
                <Col span={12}>
                  <Card title={<span style={{ color: 'rgba(0, 0, 0, .7)', fontSize: 15 }}>烟气分析数据</span>}>
                    <Row>
                      <Col span={8}>
                        <Statistic title="CO2" value={13.33} suffix="mg/m2" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="CO" value={25.269} suffix="mg/m2" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="O2" value={5.020} suffix="%" />
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title={<span style={{ color: 'rgba(0, 0, 0, .7)', fontSize: 15 }}>SIS系统数据</span>}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Statistic title="机组发电功率" value={282.83} suffix="MW" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="烟气体积流量" value={794.72} suffix="kNm3/h" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="外购电力功率" value={0} suffix="MW" />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Card style={{ marginTop: 20 }}>
                <h3>本日排放统计</h3>
                <Divider dashed style={{ marginTop: 10 }} />
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card.Grid className={styles.gridStyle}>
                      <Statistic title="机组发电量" value={61} suffix="MWh" />
                      <div className={styles.contentFixed}>
                        <span>周同比&nbsp;&nbsp;&nbsp;12%<CaretUpOutlined style={{ color: '#f5222d', marginLeft: 4 }} /></span>
                        <span>日同比&nbsp;&nbsp;&nbsp;11%<CaretDownOutlined style={{ color: '#52c41a', marginLeft: 4 }} /></span>
                      </div>
                      <div className={styles.footer}>
                        月度累计发电量  1452MWh
                      </div>
                    </Card.Grid>
                  </Col>
                  <Col span={8}>
                    <Card.Grid className={styles.gridStyle}>
                      <Statistic title="外购电量" value={0} suffix="MWh" />
                      <div className={styles.contentFixed}>
                        <span>周同比&nbsp;&nbsp;&nbsp;0%<CaretUpOutlined style={{ color: '#f5222d', marginLeft: 4 }} /></span>
                        <span>日同比&nbsp;&nbsp;&nbsp;12%<CaretDownOutlined style={{ color: '#52c41a', marginLeft: 4 }} /></span>
                      </div>
                      <div className={styles.footer}>
                        月度累计外购电量  113MWh
                      </div>
                    </Card.Grid>
                  </Col>
                  <Col span={8}>
                    <Card.Grid className={styles.gridStyle} style={{ marginRight: 0 }}>
                      <Statistic title={
                        <div>
                          外购电力CO2排放量
                      <Tooltip title="发电企业外购入电量（WMh）乘以供电排放因子（tCO2/MWh）计算得出外购电力CO2排放量">
                            <InfoCircleOutlined style={{ marginLeft: 6, color: "#808080" }} />
                          </Tooltip>
                        </div>
                      } value={0} suffix="t" />
                      <div className={styles.contentFixed}>
                        <span>周同比&nbsp;&nbsp;&nbsp;0%<CaretUpOutlined style={{ color: '#f5222d', marginLeft: 4 }} /></span>
                        <span>日同比&nbsp;&nbsp;&nbsp;11%<CaretDownOutlined style={{ color: '#52c41a', marginLeft: 4 }} /></span>
                      </div>
                      <div className={styles.footer}>
                        月度累计外购电力CO2排放量  214t
                      </div>
                    </Card.Grid>
                  </Col>
                  <Col span={8}>
                    <Card.Grid className={styles.gridStyle}>
                      <Statistic title={
                        <div>
                          烟道CO2排放量
                      <Tooltip title="小时烟气排放量乘以CO2小时均值浓度得到CO2小时排放量，汇总小时排放量得到烟道CO2日总排放量">
                            <InfoCircleOutlined style={{ marginLeft: 6, color: "#808080" }} />
                          </Tooltip>
                        </div>
                      } value={45} suffix="t" />
                      <MiniBar data={visitData} />
                      <div className={styles.footer}>
                        月度累计排放量  184t
                      </div>
                    </Card.Grid>
                  </Col>
                  <Col span={8}>
                    <Card.Grid className={styles.gridStyle}>
                      <Statistic title={
                        <div>
                          CO2总排放量
                      <Tooltip title="由当日烟道排放量与外购电力CO2排放量汇总得来">
                            <InfoCircleOutlined style={{ marginLeft: 6, color: "#808080", float: 'right' }} />
                          </Tooltip>
                        </div>
                      } value={45} suffix="t" />
                      <MiniProgress style={{ marginTop: 22 }} percent={78} strokeWidth={8} target={80} color="#13C2C2" />
                      <div className={styles.contentFixed}>
                        <span>周同比&nbsp;&nbsp;&nbsp;7%<CaretUpOutlined style={{ color: '#f5222d', marginLeft: 4 }} /></span>
                        <span>日同比&nbsp;&nbsp;&nbsp;4%<CaretDownOutlined style={{ color: '#52c41a', marginLeft: 4 }} /></span>
                      </div>
                      {/* <div className={styles.footer}>
                    月度累计排放量  173t
                  </div> */}
                    </Card.Grid>
                  </Col>
                </Row>
              </Card>
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

// 碳排放监测
export default index;