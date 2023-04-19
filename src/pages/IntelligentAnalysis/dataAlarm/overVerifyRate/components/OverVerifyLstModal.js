/**
 * 功  能：超标核实率
 * 创建人：张赟
 * 创建时间：2020.10.17
 */
import React, { Component } from 'react';
import { ExportOutlined,RollbackOutlined } from '@ant-design/icons';
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
  Checkbox,
  Select,
  message,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup';
import PointVerifyLst from '../pointVerifyRate/components/PointVerifyLstModal'
import RegionList from '@/components/RegionList';

const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'overVerifyRate/updateState',
  getData: 'overVerifyRate/getDefectModel',
};
@connect(({ loading, overVerifyRate, autoForm, common }) => ({
  priseList: overVerifyRate.priseList,
  exloading: overVerifyRate.exloading,
  loading: loading.effects[pageUrl.getData],
  total: overVerifyRate.total,
  tableDatas: overVerifyRate.tableDatas,
  regionList: autoForm.regionList,
  attentionList: overVerifyRate.attentionList,
  atmoStationList: common.atmoStationList,
  overVerifyRateForm: overVerifyRate.overVerifyRateForm,
  divisorList: overVerifyRate.divisorList,
  pollutantByType:overVerifyRate.pollutantByType
}))
@Form.create({
  mapPropsToFields(props) {
    return {
      PollutantList: Form.createFormField(props.overVerifyRateForm.PollutantList),
      PollutantType: Form.createFormField(props.overVerifyRateForm.PollutantType),
    };
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'overVerifyRate/updateState',
      payload: {
        overVerifyRateForm: {
          ...props.overVerifyRateForm,
          ...fields,
        },
      },
    });
  },
})
export default class OverVerifyLstModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedValues: [],
      columns: [],
      beginTime:props.beginTime,
      endTime:props.endTime,
    };
  }

  componentDidMount() {
    // this.initData();
    // // 根据企业类型查询监测因子
    // this.getPollutantByType(this.props.pollutantByType, this.getExceptionList);
  }
  componentDidUpdate(props){
    if(props.TVisible!==this.props.TVisible&&this.props.TVisible){
      this.initData(this.props.type);
      this.getPollutantByType(this.props.type, this.getExceptionList);
      this.setState({beginTime:props.beginTime,endTime:props.endTime,})
    }
  }
  // 根据企业类型查询监测因子
  getPollutantByType = (val, cb) => {
    const { dispatch, overVerifyRateForm } = this.props;
    this.props.dispatch({
      type: 'overVerifyRate/getPollutantByType',
      payload: {
        PollutantType: val,
      },
      callback: res => {
        let newCloum = [
          {
            title: <span>行政区</span>,
            dataIndex: 'regionName',
            key: 'regionName',
            align: 'center',
            width: 200,
            render: (text, record) => {
              return <a onClick={()=>{
                const {  overVerifyRateForm: {  PollutantType,RegionCode, }, } = this.props;
                console.log(overVerifyRateForm,record.regionCode)
                if(!this.state.regionLevel){ //省进入市
                  this.setState({
                  regionLevel: 2,
                  RegionCode: record.regionCode
                },()=>{
                  this.updateQueryState({
                    RegionCode: record.regionCode,
                  });
                  this.initData(PollutantType);
                })
              }else{  //进入监测点
                console.log(overVerifyRateForm)
                this.setState({
                  regionLevel: '',
                  RegionCode:  text =='全部合计'? RegionCode: record.regionCode,
                },()=>{
                  this.setState({
                     showDetails:true
                  })
                })
              }
              }}>
                {text}
              </a>
            },
          },
          {
            title: <span>{'数据超标报警企业数'}</span>,
            dataIndex: 'entCount',
            key: 'entCount',

            align: 'center',
          },
          {
            title: <span>数据超标报警监测点数</span>,
            dataIndex: 'pointCount',
            key: 'pointCount',
            width: 210,
            align: 'center',
          },
        ];
        res.map(item => {
          newCloum.push({
            title: <span>{item.PollutantName}</span>,
            dataIndex: item.PollutantCode,
            key: item.PollutantCode,
            width: 420,
            align: 'center',
            children: [
              {
                title: <span>报警次数</span>,
                width: 100,
                dataIndex: item.PollutantCode + '_alarmCount',
                key: item.PollutantCode + '_alarmCount',
                align: 'center',
              },
              {
                title: <span>已核实报警次数</span>,
                width: 110,
                dataIndex: item.PollutantCode + '_respondedCount',
                key: item.PollutantCode + '_respondedCount',
                align: 'center',
              },
              {
                title: <span>未核实报警次数</span>,
                width: 110,
                dataIndex: item.PollutantCode + '_noRespondedCount',
                key: item.PollutantCode + '_noRespondedCount',
                align: 'center',
              },
              {
                title: <span>核实率</span>,
                width: 100,
                dataIndex: item.PollutantCode + '_RespondedRate',
                key: item.PollutantCode + '_RespondedRate',
                align: 'center',
                render: (text, record) => {
                  return <div>{text == '-' ? text : text? `${text}%` : ''}</div>;
                },
              },
            ],
          });
        });
        newCloum.push({
          title: <span>核实率</span>,
          dataIndex: 'AllRespondedRate',
          key: 'AllRespondedRate',
          align: 'center',
          render: (text, record) => {
            return <div>{text == '-' ? text : `${text}%`}</div>;
          },
        });
        this.setState(
          { checkedValues: res.map(item => item.PollutantCode), columns: newCloum },
          () => {
            this.updateQueryState({
              PollutantList: this.state.checkedValues,
            });
            cb && cb();
          },
        );
      },
    });
  };
  initData = (type) => {
    const { dispatch, location, Atmosphere, } = this.props;
   
    const {RegionCode,regionLevel } = this.state;
    // dispatch({ type: 'autoForm/getRegions', payload: { RegionCode: '', PointMark: '2' } }); //获取行政区列表

    dispatch({ type: 'overVerifyRate/getAttentionDegreeList', payload: { RegionCode: ''} }); //获取关注列表

    this.updateQueryState({
      PollutantType: type,
      OperationPersonnel:'',
      RegionCode:'',
      regionLevel:'',
      // beginTime: moment()
      // .subtract(7, 'days')
      // .format('YYYY-MM-DD 00:00:00'),
      // endTime: moment().format('YYYY-MM-DD 23:59:59'),
    });
    setTimeout(() => {
      this.getTableData();
    });
  };
  updateQueryState = payload => {
    const { overVerifyRateForm, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { overVerifyRateForm: { ...overVerifyRateForm, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, overVerifyRateForm } = this.props;
    const {regionLevel} = this.state;
    dispatch({
      type: pageUrl.getData,
      payload: regionLevel?{ 
        ...overVerifyRateForm,
        RegionCode:this.state.RegionCode,
        regionLevel:this.state.regionLevel,
       }:{ 
        ...overVerifyRateForm,
       },
    });
  };

  typeChange = value => {
    this.updateQueryState({
      PollutantType: value,
    });
    this.props.dispatch({
      type: 'overVerifyRate/updateState',
      payload: {
        pollutantByType:value,
      },
    });
    this.getPollutantByType(value, this.getExceptionList);
    setTimeout(() => {
      this.getTableData();
    });
  };
  changePperation=(value)=>{
    this.updateQueryState({
      OperationPersonnel: value?value:'',
    });
  }
  changeRegion = value => {
    //行政区事件

    this.updateQueryState({
      RegionCode: value?value:'',
    });
  };
  changeAttent = value => {
    this.updateQueryState({
      AttentionCode: value,
    });
  };
  changeEnt = (value, data) => {
    //企业事件
    this.updateQueryState({
      EntCode: value,
    });
  };
  //创建并获取模板   导出
  template = () => {
    const { dispatch, overVerifyRateForm } = this.props;
    dispatch({
      type: 'overVerifyRate/exportDefectDataSummary',
      payload: { ...overVerifyRateForm },
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
  };
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
  };
  onRef1 = ref => {
    this.child = ref;
  };

  dateChange = (date, dataType) => {
    this.setState({
      beginTime: date[0].format('YYYY-MM-DD 00:00:00'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    })
    this.updateQueryState({
      dataType: dataType,
      beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };
  // 监测因子change
  onCheckboxChange = checkedValues => {
    let newCloum = [
      {
        title: <span>行政区</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
        render: (text, record) => {
          let RegionCode = text =='全部合计'? '': record.regionCode;
          return <a onClick={()=>{
            this.setState({
              showDetails: true,
              RegionCode: RegionCode
            })
          }}>
            {text}
          </a>
        },
      },
      {
        title: <span>{'数据超标报警企业数'}</span>,
        dataIndex: 'entCount',
        key: 'entCount',
        align: 'center',
      },
      {
        title: <span>数据超标报警监测点数</span>,
        dataIndex: 'pointCount',
        key: 'pointCount',
        width: 210,
        align: 'center',
      },
    ];
    if (checkedValues.length < 1) {
      message.warning('最少勾选一个监测因子！');
      return;
    }

    this.props.divisorList.map((item, key) => {
      let index = checkedValues.findIndex((checkedItem, checkedKey) => {
        if (item.PollutantCode == checkedItem) {
          return true;
        }
      });
      if (index !== -1) {
        newCloum.push({
          title: <span>{item.PollutantName}</span>,
          dataIndex: item.PollutantCode,
          key: item.PollutantCode,

          children: [
            {
              title: <span>报警次数</span>,
              width: 100,
              dataIndex: item.PollutantCode + '_alarmCount',
              key: item.PollutantCode + '_alarmCount',
              align: 'center',
            },
            {
              title: <span>已核实报警次数</span>,
              width: 110,
              dataIndex: item.PollutantCode + '_respondedCount',
              key: item.PollutantCode + '_respondedCount',
              align: 'center',
            },
            {
              title: <span>未核实报警次数</span>,
              width: 110,
              dataIndex: item.PollutantCode + '_noRespondedCount',
              key: item.PollutantCode + '_noRespondedCount',
              align: 'center',
            },
            {
              title: <span>核实率</span>,
              width: 100,
              dataIndex: item.PollutantCode + '_RespondedRate',
              key: item.PollutantCode + '_RespondedRate',
              align: 'center',
              render: (text, record) => {
                return <div>{text == '-' ? text : text? `${text}%` : ''}</div>;
              },
            },
          ],
        });
      } else {
      }
    });
    newCloum.push({
      title: <span>核实率</span>,
      dataIndex: 'AllRespondedRate',
      key: 'AllRespondedRate',
      align: 'center',
      render: (text, record) => {
        return <div>{text == '-' ? text : `${text}%`}</div>;
      },
    });
    this.setState({
      columns: newCloum,
    });
    this.props.dispatch({
      type: 'overVerifyRate/updateState',
      payload: {
        overVerifyRateForm: {
          ...this.props.overVerifyRateForm,
          PollutantList: checkedValues,
        },
      },
    });
  };
  /**显示弹出 */
  showModal=()=>{
    const {
      exloading,
      form: { getFieldDecorator, getFieldValue },
      divisorList,
      overVerifyRateForm: {
        beginTime,
        endTime,
        EntCode,
        RegionCode,
        AttentionCode,
        dataType,
        PollutantType,
        OperationPersonnel
      },
    } = this.props;
    const { checkedValues,regionLevel } = this.state;
    return (
      <Card
        bordered={false}
        title={
          <Form layout="inline">
            <Row>
           {!regionLevel?<><Col md={24} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                <Form.Item>
                  日期查询：
                  <RangePicker_
                    onRef={this.onRef1}
                    allowClear = {false}
                    dataType={dataType}
                    style={{ minWidth: '200px', marginRight: '10px' }}
                    dateValue={[moment(this.state.beginTime), moment(this.state.endTime)]}
                    callback={(dates, dataType) => this.dateChange(dates, dataType)}
                  />
                </Form.Item>
                <Form.Item label="关注程度">
                  <Select
                    placeholder="关注程度"
                    onChange={this.changeAttent}
                    value={AttentionCode}
                    style={{ width: 110 }}
                  >
                    <Option value="">全部</Option>
                    {this.attentchildren()}
                  </Select>
                </Form.Item>
                <Form.Item label="行政区">
                  {/* <Select
                    allowClear
                    placeholder="行政区"
                    onChange={this.changeRegion}
                    value={RegionCode}
                    style={{ width: 100 }}
                  >
                    <Option value="">全部</Option>
                    {this.regchildren()}
                  </Select> */}
               <RegionList style={{ width: 165 }} changeRegion={this.changeRegion} RegionCode={RegionCode}/>

                </Form.Item>
                <Form.Item label="企业类型">
                  <Select
                    placeholder="企业类型"
                    onChange={this.typeChange}
                    value={PollutantType}
                    style={{ width: 100 }}
                  >
                    <Option value="2">废气</Option>
                    <Option value="1">废水</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={24} style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
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
                {getFieldDecorator('PollutantList', {
                  initialValue: checkedValues,
                })(
                  <Checkbox.Group
                    style={{ maxWidth: 'calc(100% - 5.3% - 168px)' }}
                    onChange={this.onCheckboxChange}
                  >
                    {divisorList.map(item => {
                      return (
                        <Checkbox key={item.PollutantCode} value={item.PollutantCode}>
                          {item.PollutantName}
                        </Checkbox>
                      );
                    })}
                  </Checkbox.Group>,
                )}
                <Form.Item>
                  <Button type="primary" onClick={this.queryClick}>
                    查询
                  </Button>
                  <Button
                    style={{ margin: '0 5px' }}
                    icon={<ExportOutlined />}
                    onClick={this.template}
                    loading={exloading}
                  >
                    导出
                  </Button>
                </Form.Item>
              </Col>
              </>
              :
              <Form.Item>
              <Button
                style={{ margin: '0 5px' }}
                icon={<ExportOutlined />}
                onClick={this.template}
                loading={exloading}
              >
                导出
              </Button>
              <Button onClick={() => {
                 this.setState({
                  RegionCode:'',
                   regionLevel:''
                 },()=>{
                  this.getTableData(2);
                 })
             }} ><RollbackOutlined />返回</Button>
            </Form.Item>
                  }
            </Row>
          </Form>
        }
      >
        <SdlTable
          rowKey={(record, index) => `complete${index}`}
          loading={this.props.loading}
          columns={this.state.columns}
          dataSource={this.props.tableDatas.data}
          // pagination={{
            // showSizeChanger: true,
            // showQuickJumper: true,
            // sorter: true,
            // total: this.props.total,
            //defaultPageSize: 20,
            // pageSize: PageSize,
            // current: PageIndex,
            // pageSizeOptions: ['10', '20', '30', '40', '50'],
          // }}
        />
      </Card>
    );
  }
  render() {
    const {TVisible,TCancle} = this.props
    return(
      <Modal
          centered
          title='超标报警核实率'
          visible={TVisible}
          footer={null}
          wrapClassName='spreadOverModal'
          destroyOnClose
          onCancel={TCancle}>
            {
              !this.state.showDetails && this.showModal()
            }
            {
              this.state.showDetails && <PointVerifyLst   RegionCode= {this.state.RegionCode }  onBack={() => {
                this.setState({
                  showDetails: false,
                  RegionCode: this.state.RegionCodeined,
                  regionLevel:2,
                })
              }} />
            }
          </Modal>
    )
  }
}
