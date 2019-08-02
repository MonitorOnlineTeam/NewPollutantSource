import React, { Component, Fragment } from 'react';
import {
  Card,
  Icon,
  Divider,
  Table,
  message,
  Tag,
  Modal,
  Pagination,
  Popconfirm,
  Button,
  Row,
  Col,
  Empty,
} from 'antd';
import { connect } from 'dva';
import EditPollutant from './editPollutant';
import PollutantView from './pollutantView';
import styles from './index.less';
import MonitorContent from '@/components/MonitorContent';
import SdlTable from '@/components/AutoForm/Table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect(({ loading, standardlibrary, autoForm }) => ({
  ...loading,
  list: standardlibrary.uselist,
  total: standardlibrary.total,
  pageSize: standardlibrary.pageSize,
  pageIndex: standardlibrary.pageIndex,
  requstresult: standardlibrary.requstresult,
  PollutantListByDGIMN: standardlibrary.PollutantListByDGIMN,
}))
class UseStandardLibrary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: this.props.match.params.DGIMN,
      Fvisible: false,
      Pvisible: false,
      title: '',
      width: '500',
      PollutantCode: null,
      standardlibraryModal: false,
    };
  }

  onRef1 = ref => {
    this.child = ref;
  };

  oncancel = () => {
    this.setState({
      Fvisible: false,
    });
  };
  componentDidMount() {
    const { dispatch, match } = this.props;

    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: 'service_StandardLibrary',
      },
    });
  }
  componentWillMount() {
    this.onChange();
    this.getpollutantbydgimn();
  }

  onChange = (pageIndex, pageSize) => {
    this.props.dispatch({
      type: 'standardlibrary/getuselist',
      payload: {
        DGIMN: this.state.DGIMN,
        pageIndex: pageIndex === undefined ? 1 : pageIndex,
        pageSize: pageSize === undefined ? 4 : pageSize,
      },
    });
  };

  getpollutantbydgimn() {
    this.props.dispatch({
      type: 'standardlibrary/getpollutantbydgimn',
      payload: {
        DGIMN: this.state.DGIMN,
      },
    });
  }

  UseALL(StandardLibraryID) {
    this.props.dispatch({
      type: 'standardlibrary/usepoint',
      payload: {
        DGIMN: this.state.DGIMN,
        StandardLibraryID: StandardLibraryID,
        callback: () => {
          // debugger;
          this.setState({
            standardlibraryModal: false,
          });
          if (this.props.requstresult === '1') {
            message.success('应用成功');
          } else {
            message.error('应用失败');
          }
        },
      },
    });
  }

  IsEnabled = (type, record) => {
    this.props.dispatch({
      type: 'standardlibrary/isusepollutant',
      payload: {
        PollutantCode: record.PollutantCode,
        DGIMN: this.state.DGIMN,
        Enalbe: type,
        StandardLibraryID: null,
      },
    });
  };

  renderStandardList = () => {
    console.log(this.props.list);
    const rtnVal = [];
    const that = this;
    if (this.props.list.length > 0) {
      this.props.list.map((item, key) => {
        rtnVal.push(
          <div key={`${key}1`} className={styles.item}>
            <div key={`${key}2`} className={styles.standardlibrary}>
              {item.Name}
            </div>
            <Divider key={`${key}3`} dashed={true} />
            <div key={`${key}4`} className={styles.child}>
              {that.renderPollutantItem(item.child)}
            </div>
            <div key={`${key}5`} className={styles.foot}>
              <div key={`${key}6`} className={styles.use}>
                <div key={`${key}7`} style={{ position: 'relative' }}>
                  <Row key={`${key}8`} justify="center" type="flex">
                    <Col key={`${key}9`} span={9}>
                      <a
                        key={`${key}10`}
                        className={styles.a}
                        onClick={() => {
                          that.setState({
                            StandardLibraryID: item.key,
                            Pvisible: true,
                            title: `${item.Name}中的污染物`,
                            width: '50%',
                          });
                        }}
                      >
                        <Icon key={`${key}11`} type="search" /> 查看更多
                      </a>
                    </Col>
                    <Col key={`${key}11`} span={3}>
                      {' '}
                      <Divider type="vertical" />
                    </Col>
                    <Col key={`${key}12`} span={9}>
                      <Popconfirm
                        placement="left"
                        title="确定要此标准下所有污染物应用到此监测点下吗？"
                        onConfirm={() => that.UseALL(item.key)}
                        okText="是"
                        cancelText="否"
                      >
                        <a key={`${key}13`} className={styles.a}>
                          {' '}
                          <Icon key={`${key}14`} type="appstore" /> 应用全部
                        </a>
                      </Popconfirm>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>,
        );
      });
    } else {
      rtnVal.push(
        <div>
          <img src="/nodata.png" />
        </div>,
      );
    }
    return rtnVal;
  };

  renderPollutantItem = pollutantList => {
    const rtnVal = [];
    pollutantList.map((item, key) => {
      rtnVal.push(
        <div key={`${key}1`} className={styles.pollutant}>
          {
            <Col key={`${key}2`} span={12}>
              <span className={styles.pollutantName}>{item.PollutantName}:</span>
            </Col>
          }{' '}
          <Col key={`${key}3`} span={12}>
            <span className={styles.UpperLimit}>
              {item.UpperLimit}-{item.LowerLimit}
            </span>
          </Col>
        </div>,
      );
    });
    return rtnVal;
  };

  render() {
    const columns = [
      {
        title: '污染物编号',
        dataIndex: 'PollutantCode',
        key: 'PollutantCode',
        width: '10%',
        align: 'left',
        render: (text, record) => text,
      },
      {
        title: '污染物名称',
        dataIndex: 'PollutantName',
        key: 'PollutantName',
        width: '10%',
        align: 'left',
        render: (text, record) => text,
      },

      {
        title: '报警类型',
        dataIndex: 'AlarmType',
        key: 'AlarmType',
        width: '10%',
        render: (text, record) => {
          if (text === 0) {
            return (
              <span>
                {' '}
                <Tag> 无报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 1) {
            return (
              <span>
                {' '}
                <Tag color="green"> 上限报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 2) {
            return (
              <span>
                {' '}
                <Tag color="cyan"> 下线报警 </Tag>{' '}
              </span>
            );
          }
          if (text === 3) {
            return (
              <span>
                {' '}
                <Tag color="lime"> 区间报警 </Tag>{' '}
              </span>
            );
          }
        },
      },
      {
        title: '检出上限',
        dataIndex: 'AbnormalUpperLimit',
        key: 'AbnormalUpperLimit',
        width: '10%',
        align: 'center',
        render: (text, record) => text,
      },
      {
        title: '检出下限',
        dataIndex: 'AbnormalLowerLimit',
        key: 'AbnormalLowerLimit',
        width: '10%',
        align: 'center',
        render: (text, record) => text,
      },
      {
        title: '报警上限',
        dataIndex: 'UpperLimit',
        key: 'UpperLimit',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          if (text === '0') {
            return '-';
          }

          return text;
        },
      },
      {
        title: '报警下限',
        dataIndex: 'LowerLimit',
        key: 'LowerLimit',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          if (text === '0') {
            return '-';
          }

          return text;
        },
      },
      {
        title: '标准值',
        dataIndex: 'StandardValue',
        key: 'StandardValue',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          if (text === 0) {
            return '-';
          }

          return text;
        },
      },
      {
        title: '监测状态',
        dataIndex: 'IsUse',
        key: 'IsUse',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          if (text === '0') {
            return (
              <span>
                <Button size="small" type="dashed">
                  <a
                    title="单击设置为监测中"
                    style={{ color: '#D1D1D1' }}
                    onClick={() => this.IsEnabled(1, record)}
                  >
                    <Icon type="exclamation-circle" /> 未监测
                  </a>
                </Button>
              </span>
            );
          }
          return (
            <span>
              {' '}
              <Button size="small" color="blue">
                {' '}
                <a title="单击从监测中移除" onClick={() => this.IsEnabled(0, record)}>
                  <Icon type="setting" spin={true} /> 监测中
                </a>
              </Button>
            </span>
          );
        },
      },
      {
        title: '操作',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          if (record.IsUse === '1') {
            return (
              <a
                onClick={() =>
                  this.setState({
                    Fvisible: true,
                    title: '编辑污染物',
                    width: '50%',
                    PollutantCode: record.PollutantCode,
                  })
                }
              >
                {' '}
                编辑
              </a>
            );
          }
          return <a style={{ color: '#D1D1D1' }}> 编辑 </a>;
        },
      },
    ];
    console.log('this.props.PollutantListByDGIMN=', this.props.PollutantListByDGIMN);
    const {
      searchConfigItems,
      searchForm,
      tableInfo,
      match: {
        params: { targetName, configId, targetId, pollutantType },
      },
      dispatch,
      pointDataWhere,
      isEdit,
    } = this.props;
    return (
      <PageHeaderWrapper title="监测点维护-设置标准">

        <Card
          bordered={false}
          title={
            <span>
              {targetName + '-' + this.props.match.params.PointName}
              <Button
                style={{ marginLeft: 10 }}
                onClick={() => {
                  history.go(-1);
                }}
                type="link"
                size="small"
              >
                <Icon type="rollback" />
                返回上级
              </Button>
            </span>
          }
          style={{ width: '100%' }}
          extra={
            <Button
              onClick={() => {
                this.setState({
                  standardlibraryModal: true,
                });
              }}
              icon="search"
            >
              查看标准库
            </Button>
          }
        >
          {/* <div className={styles.card}>
                        {
                            this.renderStandardList()
                        }
                    </div>

                    <div className={styles.Pagination}>
                        <Pagination
                            defaultCurrent={1}
                            pageSize={4}
                            total={this.props.total}
                            current={this.props.pageIndex}
                            onChange={this.onChange}
                            size="small"
                        />
                    </div> */}
          {/* <div className={styles.pageHeader} style={{ marginBottom: 10 }}>
                        <Button onClick={() => {
                            this.setState({
                                standardlibraryModal: true
                            })
                        }} icon="search">查看标准库</Button>
                    </div> */}
          <Card className={styles.antCss}>
            <div className={styles.table}>
              <Table
                rowKey={(record, index) => `complete${index}`}
                bordered={false}
                loading={this.props.effects['standardlibrary/getpollutantbydgimn']}
                columns={columns}
                size="small"
                dataSource={
                  this.props.requstresult === '1' ? this.props.PollutantListByDGIMN : null
                }
                pagination={true}
                rowClassName={(record, index, indent) => {
                  if (index === 0) {
                    return;
                  }
                  if (index % 2 !== 0) {
                    return 'light';
                  }
                }}
              />
            </div>
          </Card>
          <Modal
            visible={this.state.standardlibraryModal}
            title={'选择标准库'}
            width={'50%'}
            footer={false}
            destroyOnClose={true} // 清除上次数据
            onCancel={() => {
              this.setState({
                standardlibraryModal: false,
              });
            }}
          >
            {
              <SdlTable
                style={{ marginTop: 10 }}
                configId={'service_StandardLibrary'}
                searchParams={[
                  {
                    Key: 'dbo__T_Cod_PollutantType__PollutantTypeCode',
                    Value: `${pollutantType}`,
                    Where: '$=',
                  },
                ]}
                appendHandleRows={row => {
                  return (
                    <Fragment>
                      <Popconfirm
                        title="确认要应用标准吗?"
                        onConfirm={() => {
                          this.UseALL(row['dbo.T_Base_StandardLibrary.Guid']);
                        }}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                      >
                        <a href="#">应用标准</a>
                      </Popconfirm>
                    </Fragment>
                  );
                }}
              />
            }
          </Modal>
          <Modal
            visible={this.state.Fvisible}
            title={this.state.title}
            width={this.state.width}
            footer={false}
            destroyOnClose={true} // 清除上次数据
            onCancel={() => {
              this.setState({
                Fvisible: false,
              });
            }}
          >
            {
              <EditPollutant
                pid={this.state.PollutantCode}
                DGIMN={this.state.DGIMN}
                onRef={this.onRef1}
                oncancel={this.oncancel}
              />
            }
          </Modal>
          <Modal
            visible={this.state.Pvisible}
            title={this.state.title}
            width={this.state.width}
            footer={false}
            destroyOnClose={true} // 清除上次数据
            onCancel={() => {
              this.setState({
                Pvisible: false,
              });
            }}
          >
            {<PollutantView StandardLibraryID={this.state.StandardLibraryID} />}
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default UseStandardLibrary;
