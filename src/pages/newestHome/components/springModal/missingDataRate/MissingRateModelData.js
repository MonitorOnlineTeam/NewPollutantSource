/**
 * 功  能：缺失数据报警响应率
 * 创建人：贾安波
 * 创建时间：2020.11
 */
import React, { Component, PureComponent } from 'react';
import { ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Badge,
  Modal,
  Input,
  Button,
  Select,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile, interceptTwo } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import MissingDataRateModelDetail from './MissingDataRateModelDetail'
import EntType from '@/components/EntType'
import RegionList from '@/components/RegionList'
import MissDataSecond from '@/pages/monitoring/missingData/MissDataSecond'
import styles from '@/pages/monitoring/missingData/style.less'

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'MissingRateDataModal/updateState',
  getData: 'MissingRateDataModal/getDefectModel',
};
@connect(({ loading, MissingRateDataModal, autoForm, common }) => ({
  priseList: MissingRateDataModal.priseList,
  exloading: MissingRateDataModal.exloading,
  loading: loading.effects[pageUrl.getData],
  total: MissingRateDataModal.total,
  tableDatas: MissingRateDataModal.tableDatas,
  queryPar: MissingRateDataModal.queryPar,
  regionList: autoForm.regionList,
  attentionList: MissingRateDataModal.attentionList,
  atmoStationList: common.atmoStationList,
  type: MissingRateDataModal.type
}))
@Form.create()
export default class Index extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      entVisible: false,
      location: {
        query: {}
      },
      level: '',
      goback: false,
      regionDetailCode: '',
      missingAlarmVisible: false,
      alarmNumRegionCode: '',
      regionName: '',
      status: '',
    };
    this.commonCol = [
      {
        title: <span>{this.props.types === 'ent' ? '缺失数据报警监测点数' : '缺失数据报警空气检测点数'}</span>,
        dataIndex: 'pointCount',
        key: 'pointCount',
        align: 'center'
      },
      {
        title: <span>缺失数据报警次数</span>,
        dataIndex: 'exceptionCount',
        key: 'exceptionCount',
        // width: '10%',
        align: 'center',
        render: (text, record) => {
          return <a onClick={() => { this.missingAlarmNum(record) }}>{text} </a>
        }
      },
      {
        title: <span>已响应报警次数</span>,
        dataIndex: 'xiangyingCount',
        key: 'xiangyingCount',
        align: 'center',
        render: (text, record) => {
          return <a onClick={() => { this.missingAlarmNum(record, '1') }}>{text} </a>
        }
      },
      {
        title: <span>待响应报警次数</span>,
        dataIndex: 'weixiangyingCount',
        key: 'weixiangyingCount',
        align: 'center',
        render: (text, record) => {
          return <a onClick={() => { this.missingAlarmNum(record, '0') }}>{text} </a>
        }
      },
      {
        title: <span>响应率</span>,
        dataIndex: 'responseRate',
        key: 'responseRate',
        align: 'center',
        render: (text, row) => {
          return <span>{`${interceptTwo(Number(text))}%`}</span>
        }

      },
    ]
    this.columns = [
      {
        title: <span>行政区</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
        render: (text, record) => {
          return <a href='javascript:;' onClick={() => { this.detail(text, record) }} >{text} </a>
        }
      },
      ...this.commonCol
    ];
    this.columns2 = [
      // {
      //   title: <span>行政区</span>,
      //   dataIndex: 'regionName',
      //   key: 'regionName',
      //   align: 'center',
      //   render: (text, record) => {
      //     return <a href='javascript:;' onClick={() => { this.detail(text, record) }} >{text} </a>
      //   }
      // },
      {
        title: '省',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
        render: (text, record, index) => {
          if (text == '全部合计') {
            return { props: { colSpan: 0 }, };
          }
          return text;
        },
      },
      {
        title: '市',
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
        render: (text, record) => {
          return {
            props: { colSpan: record.ProvinceName == '全部合计' ? 2 : 1 },
            children:  <a href='javascript:;' onClick={() => { this.detail(text, record) }} >{record.ProvinceName == '全部合计' ? '全部合计' : text} </a>
          }
        }
      },
      ...this.commonCol
    ];
  }

  componentDidMount() {
    this.initData();
  }
  detail = (text, record) => {
    const { queryPar } = this.props;
    if (this.state.level) { //监测点
      this.setState({
        location: { query: { queryPar: JSON.stringify({ ...queryPar, RegionCode: record.regionCode ? record.regionCode : this.state.regionDetailCode, }) } }
      }, () => {
        this.setState({ entVisible: true })
      })
    } else { //省级详情
      const { dispatch, types, time } = this.props;
      this.setState({ regionDetailCode: record.regionCode, level: 2 }, () => {
          this.getTableData(record.regionCode);
      })

    }
  }
  initData = () => {
    const { dispatch, location, Atmosphere, types, time, defaultPollutantType, } = this.props;
    this.updateQueryState({
      RegionCode: '',
      EntType: types === 'ent' ? "1" : "2",
      beginTime: time[0].format('YYYY-MM-DD 00:00:00'),
      endTime: time[1].format('YYYY-MM-DD 23:59:59'),
      PollutantType: defaultPollutantType,
      // OperationPersonnel:'',
    });
    let entObj = { title: <span>缺失数据报警企业数</span>, dataIndex: 'entCount', key: 'entCount', align: 'center', }

    types === 'ent' ? this.columns.splice(1, 0, entObj) : null;

    //  dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表

    dispatch({ type: 'MissingRateDataModal/getEntByRegion', payload: { RegionCode: '' }, });//获取企业列表

    dispatch({ type: 'MissingRateDataModal/getAttentionDegreeList', payload: { RegionCode: '' }, });//获取关注列表


    setTimeout(() => {
      this.getTableData();
    });
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = (regionCode) => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: this.state.level ? { ...queryPar, RegionCode: regionCode, regionLevel: this.state.level } : { ...queryPar },
    });
  };


  children = () => { //企业列表 or 大气站列表
    const { priseList, atmoStationList, type } = this.props;

    const selectList = [];
    if (type === 'ent') {
      if (priseList.length > 0) {
        priseList.map(item => {
          selectList.push(
            <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
              {item.EntName}
            </Option>,
          );
        });
      } else {
        if (atmoStationList.length > 0) {
          atmoStationList.map(item => {
            selectList.push(
              <Option key={item.StationCode} value={item.StationCode} title={item.StationName}>
                {item.StationName}
              </Option>,
            );
          });
        }
      }
      return selectList;
    }
  };

  typeChange = value => {
    this.updateQueryState({
      PollutantType: value,
    });
  };

  changeRegion = (value) => { //行政区事件

    this.updateQueryState({
      RegionCode: value,
    });
  };
  changeAttent = (value) => {
    this.updateQueryState({
      AttentionCode: value,
    });
  }
  changePperation = (value) => {
    this.updateQueryState({
      OperationPersonnel: value ? value : '',
    });
  }
  changeEnt = (value, data) => { //企业事件
    this.updateQueryState({
      EntCode: value,
    });
  }
  //创建并获取模板   导出
  template = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: 'MissingRateDataModal/exportDefectDataSummary',
      payload: this.state.level ? { ...queryPar, RegionCode: this.state.regionDetailCode, regionLevel: this.state.level, Rate: 1, } : { ...queryPar, Rate: 1, },
      callback: data => {
        downloadFile(`/upload${data}`);
      },
    });
  };
  //查询事件
  queryClick = () => {
    this.getTableData();
  };


  regchildren = () => {
    const { regionList } = this.props;
    const selectList = [];
    if (regionList.length > 0) {
      regionList[0].children.map(item => {
        selectList.push(
          <Option key={item.key} value={item.value}>
            {item.title}
          </Option>,
        );
      });
      return selectList;
    }
  }
  attentchildren = () => {
    const { attentionList } = this.props;
    const selectList = [];
    if (attentionList.length > 0) {
      attentionList.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  }

  onRef1 = (ref) => {
    this.child = ref;
  }
  /** 数据类型切换 */
  _handleDateTypeChange = value => {
    this.child.onDataTypeChange(value)
  }
  dateChange = (date, dataType) => {
    this.updateQueryState({
      // dataType:dataType,
      beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  missingAlarmNum = (record, status) => { //缺失数据报警次数
    this.setState({
      missingAlarmVisible: true,
      regionName: record.regionName,
      alarmNumRegionCode: record.regionCode ? record.regionCode : this.state.regionDetailCode,
      status: status? status : '',
    })
  }
  render() {
    const {
      exloading,
      queryPar: { beginTime, endTime, EntCode, RegionCode, AttentionCode, dataType, PollutantType, OperationPersonnel },
      time,
      types,
    } = this.props;
    const { entVisible, location, level } = this.state;
    return <>
      {entVisible ?
        <MissingDataRateModelDetail types={types} location={location} detailBack={() => {
          this.setState({
            entVisible: false
          })
        }} />
        :
        <div>
          <Form layout="inline">
            <Row style={{ paddingBottom: 15 }}>
              {!level && <><Form.Item>
                日期查询：
                <RangePicker_ allowClear={false} onRef={this.onRef1} dataType={''} style={{ minWidth: '200px', marginRight: '10px' }} dateValue={[moment(time[0]), moment(time[1])]}
                  callback={(dates, dataType) => this.dateChange(dates, dataType)} />
              </Form.Item>
                <Form.Item label='关注程度'>
                  <Select
                    allowClear
                    placeholder="关注程度"
                    onChange={this.changeAttent}
                    value={AttentionCode ? AttentionCode : undefined}
                    style={{ width: 110 }}
                  >
                    {this.attentchildren()}
                  </Select>
                </Form.Item>

                {/* <Form.Item label='运维状态'>
              <Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="运维状态"
                maxTagCount={2}
                value={OperationPersonnel?OperationPersonnel:undefined}
                onChange={this.changePperation}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                >
                <Option value="1">已设置运维人员</Option>
                <Option value="2">未设置运维人员</Option>
              </Select>
              </Form.Item>  */}
                <Form.Item label='行政区'>
                  {/* <Select
                  allowClear
                  placeholder="行政区"
                  onChange={this.changeRegion}
                  value={RegionCode ? RegionCode : undefined}
                  style={{ width: 100 }}
                >
                  {this.regchildren()}
                </Select> */}
                  <RegionList style={{ width: 165 }} changeRegion={this.changeRegion} RegionCode={RegionCode} />

                </Form.Item>
                {types === 'ent' ? <Form.Item label='企业类型'>
                  <Select
                    allowClear
                    placeholder="企业类型"
                    onChange={this.typeChange}
                    value={PollutantType ? PollutantType : undefined}
                    style={{ width: 100 }}
                  >
                    <Option value="2">废气</Option>
                    <Option value="1">废水</Option>
                  </Select>
                </Form.Item> : null}
              </>}
              <Form.Item>
                {!level && <Button type="primary" onClick={this.queryClick}>
                  查询
                </Button>}
                <Button
                  style={{ margin: '0 5px' }}
                  icon={<ExportOutlined />}
                  onClick={this.template}
                  loading={exloading}
                >
                  导出
                </Button>
                {level && <Button onClick={() => {
                  this.setState({ level: '', regionDetailCode: '', goback: true }, () => {
                    this.getTableData();
                  })
                }} ><RollbackOutlined />返回</Button>}
              </Form.Item>
            </Row>
          </Form>
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            loading={this.props.loading}
            columns={ !level ? this.columns : this.columns2}
            dataSource={this.props.tableDatas}
            pagination={false}
          />
          <Modal
            title={`${this.state.regionName} - ${this.props.types === 'ent' ? '缺失数据报警详情(企业)' : '缺失数据报警详情(空气站)'}`}
            visible={this.state.missingAlarmVisible}
            wrapClassName='spreadOverModal spreadOverHiddenModal'
            footer={null}
            destroyOnClose={true}
            onCancel={() => { this.setState({ missingAlarmVisible: false }) }}
            className={styles.missDetailSty}
          >
            <MissDataSecond hideBreadcrumb location={{ query: { queryPar: JSON.stringify({ ...this.props.queryPar, RegionCode: this.state.alarmNumRegionCode, Status: this.state.status }) } }} />
          </Modal>
        </div>
      }
    </>;
  }
}
