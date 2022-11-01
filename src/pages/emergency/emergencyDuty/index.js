import React, { PureComponent } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Card, Avatar, Row, Col, Radio, Table, Tag, Tooltip, Divider } from 'antd'
import styles from '../index.less'
import { IdcardTwoTone, PhoneTwoTone, AlertTwoTone, EyeOutlined, FormOutlined } from '@ant-design/icons'
import CreateAndEditAlarmModal from './CreateAndEditAlarmModal'
import ViewAlarmModal from './ViewAlarmModal'
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable'
import { EditIcon, DetailIcon, DelIcon } from '@/utils/icon'
import { router } from 'umi';



const { Meta } = Card;
const options = [
  { label: '全部', value: undefined },
  { label: '甄别中', value: 1 },
  { label: '处置中', value: 2 },
  { label: '甄别完成', value: 3 },
  { label: '处置完成', value: 4 },
];


@connect(({ loading, emergency }) => ({
  dutyPersonInfo: emergency.dutyPersonInfo,
  dutyTableList: emergency.dutyTableList,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      viewVisible: false,
      dutyStatus: undefined,
      isEdit: false,
      keysParams: {},
      selectedRowKeys: [],
    };

    this._SELF_ = {
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          render: (text, record, index) => {
            return index + 1;
          }
        },
        {
          title: '接警时间',
          dataIndex: 'DutyTime',
          key: 'DutyTime',
        },
        {
          title: '内容',
          dataIndex: 'Comment',
          key: 'Comment',
        },
        {
          title: '是否应急事件',
          dataIndex: 'IsEmergency',
          key: 'IsEmergency',
        },
        {
          title: '状态',
          dataIndex: 'Status',
          key: 'Status',
          render: (text) => {
            switch (text) {
              case 1:
                return <Tag color="error">甄别中</Tag>
              case 2:
                return <Tag color="success">处置中</Tag>
              case 3:
                return <Tag color="default">甄别完成</Tag>
              case 4:
                return <Tag color="default">处置完成</Tag>
            }
          }
        },
        {
          title: '操作',
          key: 'handle',
          children: [
            {
              title: '接警',
              dataIndex: 'jiejing',
              align: 'center',
              width: 100,
              key: 'jiejing',
              render: (text, record) => {
                if (record.Status === 1) {
                  // 甄别状态可以编辑
                  return <Tooltip title="编辑接警">
                    <a onClick={() => {
                      this.setState({
                        isVisible: true, isEdit: true, keysParams: {
                          "dbo.T_Bas_AlarmInfo.AlarmInfoCode": record.AlarmInfoCode
                        }
                      })
                    }}><EditIcon /></a>
                  </Tooltip>
                }
                // 除甄别状态只能查看详情
                return <Tooltip title="接警详情">
                  <a onClick={() => {
                    this.setState({
                      viewVisible: true, keysParams: {
                        "dbo.T_Bas_AlarmInfo.AlarmInfoCode": record.AlarmInfoCode
                      }
                    })
                  }}><DetailIcon /></a>
                </Tooltip>
              }
            },
            {
              title: '甄别',
              dataIndex: 'zhenbie',
              align: 'center',
              width: 120,
              key: 'zhenbie',
              render: (text, record) => {
                return <>
                  <Tooltip title="接警甄别">
                    <a onClick={() => {
                      router.push(`/emergency/identify?code=${record.AlarmInfoCode}`)
                    }}><EyeOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>
                  <Divider type="vertical" />
                  <Tooltip title="甄别详情">
                    <a onClick={() => {
                      router.push(`/emergency/emergencyDuty/details?code=${record.AlarmInfoCode}`)
                    }}><DetailIcon /></a>
                  </Tooltip>
                </>
              }
            },
            {
              title: '处置',
              dataIndex: 'chuzhi',
              align: 'center',
              width: 100,
              key: 'chuzhi',
              render: (text, record) => {
                if (record.Status === 2 || record.Status === 4) {
                  return <Tooltip title="应急处置">
                    <a onClick={() => {
                      if (record.IsCurrent === 0 && record.Status !== 4) {
                        this.onSetCurrent(record.AlarmInfoCode)
                      }
                      router.push(`/emergency/disposal?code=${record.AlarmInfoCode}`)
                    }}><FormOutlined style={{ fontSize: 16 }} /></a>
                  </Tooltip>
                }
                return '-'
              }
            },
          ]
        },

      ],
    }
  }

  componentDidMount() {
    this.getDutyPerson();
    this.getDutyTableList();
  }

  // 获取值班人员和值班领导信息
  getDutyPerson = () => {
    this.props.dispatch({
      type: "emergency/getDutyPerson",
      payload: {}
    })
  }

  // 获取表格数据
  getDutyTableList = () => {
    this.props.dispatch({
      type: "emergency/getDutyTableList",
      payload: {
        Status: this.state.dutyStatus
      },
      callback: (res) => {
        let arr = res.filter(item => item.IsCurrent);
        if (arr.length) {
          this.setState({
            selectedRowKeys: [arr[0].AlarmInfoCode]
          })
          localStorage.setItem("AlarmInfoCode", arr[0].AlarmInfoCode)
        }
      }
    })
  }

  // 设置选中数据
  onSetCurrent = (AlarmInfoCode) => {
    this.props.dispatch({
      type: "emergency/setCurrent",
      payload: {
        AlarmInfoCode: AlarmInfoCode,
        // Status: 2
      }
    })
  }

  // 弹窗操作完后关闭
  onCreateSuccess = () => {
    this.getDutyTableList()
    this.setState({
      isVisible: false
    })
  }

  onShowModal = () => {
    this.setState({
      isVisible: true
    })
  }

  render() {
    const { isVisible, isEdit, keysParams, viewVisible, selectedRowKeys } = this.state;
    const { dutyPersonInfo, dutyTableList } = this.props;
    const { columns } = this._SELF_;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({ selectedRowKeys: selectedRowKeys })
        this.onSetCurrent(selectedRowKeys[0])
      },
      getCheckboxProps: (record) => ({
        disabled: record.Status !== 2,
        // Column configuration not to be checked
        name: record.name,
      }),
    };
    console.log('selectedRowKeys=', selectedRowKeys)
    return (
      <div id="autoHeight">
        <BreadcrumbWrapper>
          <Card bodyStyle={{ padding: 12 }}>
            <Row>
              <Col span={8} style={{ borderRight: "1px solid #f0f0f0" }}>
                <div className={styles.headerInfo} style={{ cursor: 'pointer' }}
                  onClick={this.onShowModal}
                >
                  {/* <span>值班接警</span> */}
                  <div className={styles.content}>
                    <AlertTwoTone style={{ fontSize: 40 }} />
                    <a style={{ display: 'block', marginTop: 10 }}>值班接警</a>
                  </div>
                </div>
              </Col>
              <Col span={8} style={{ borderRight: "1px solid #f0f0f0" }}>
                <div className={styles.headerInfo}>
                  <span>值班领导</span>
                  <div className={styles.content}>
                    <p><IdcardTwoTone style={{ marginRight: 10 }} />{dutyPersonInfo.Leader}</p>
                    <p className={styles.phone}><PhoneTwoTone style={{ marginRight: 6 }} />{dutyPersonInfo.LeaderPhone}</p>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.headerInfo}>
                  <span>值班人员</span>
                  <div className={styles.content}>
                    <p><IdcardTwoTone style={{ marginRight: 10 }} />{dutyPersonInfo.Person}</p>
                    <p className={styles.phone}><PhoneTwoTone style={{ marginRight: 6 }} />{dutyPersonInfo.PersonPhone}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
          <Card
            title="值班接警任务"
            style={{ marginTop: 20 }}
            bodyStyle={{ paddingBottom: 12 }}
            extra={
              <Radio.Group
                options={options}
                onChange={(e) => {
                  this.setState({
                    dutyStatus: e.target.value
                  }, () => {
                    this.getDutyTableList()
                  })
                }}
                defaultValue={undefined}
                optionType="button"
              />
            }
          >
            <SdlTable
              rowKey={(record) => record.AlarmInfoCode}
              rowSelection={{
                type: 'radio',
                ...rowSelection,
              }}
              dataSource={dutyTableList}
              columns={columns}
            />
          </Card>
        </BreadcrumbWrapper>
        <CreateAndEditAlarmModal
          isEdit={isEdit}
          keysParams={keysParams}
          visible={isVisible}
          onCancel={() => { this.setState({ isVisible: false }) }}
          onCreateSuccess={this.onCreateSuccess}
        />
        <ViewAlarmModal
          keysParams={keysParams}
          visible={viewVisible}
          onCancel={() => { this.setState({ viewVisible: false }) }}
        />
      </div>
    );
  }
}

export default index;