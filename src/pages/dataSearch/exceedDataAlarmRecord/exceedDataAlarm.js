/**
 * 功  能：超标数据报警核实记录查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.19
 */
import React, { PureComponent, Fragment } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Checkbox,
    Row,
    Col,
    Radio,
    Select,
    DatePicker,
    Empty,
    message,
    Tabs,
    Modal,
} from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import { routerRedux } from 'dva/router';
import { Right } from '@/utils/icon';
import style from '@/pages/dataSearch/tableClass.less'
import { downloadFile } from '@/utils/utils';
import { compose } from 'redux';
import FileDown from '@/components/AttachmentView/index'
import VerifyDetailsPop from './VerifyDetailsPop'
import OperationUnitList from '@/components/OperationUnitList'
const { Option } = Select;
const { TabPane } = Tabs;


const pageUrl = {
    GetAttentionDegreeList: 'enterpriseMonitoringModel/GetAttentionDegreeList',
    getRegions: 'autoForm/getRegions',
    GetEntByRegion:'exceedDataAlarmModel/GetEntByRegion',
    GetAlarmVerifyRate:'exceedDataAlarmModel/GetAlarmVerifyRate',
    GetAlarmVerifyRateDetail:'exceedDataAlarmModel/GetAlarmVerifyRateDetail',
    GetAlarmVerifyDetail:'exceedDataAlarmModel/GetAlarmVerifyDetail',
    GetPollutantCodeList:'exceedDataAlarmModel/GetPollutantCodeList',
    GetOverToExamineOperation:'exceedDataAlarmModel/GetOverToExamineOperation',
    ExportAlarmVerifyRate:'exceedDataAlarmModel/ExportAlarmVerifyRate',
    ExportAlarmVerifyRateDetail:'exceedDataAlarmModel/ExportAlarmVerifyRateDetail',
    ExportAlarmVerifyDetail:'exceedDataAlarmModel/ExportAlarmVerifyDetail',
}
@connect(({ loading, autoForm, enterpriseMonitoringModel ,exceedDataAlarmModel}) => ({
    loading: loading.effects['exceedDataAlarmModel/GetAlarmVerifyRate'],
    loadingRateDetail:loading.effects['exceedDataAlarmModel/GetAlarmVerifyRateDetail'],
    loadingDetail:loading.effects['exceedDataAlarmModel/GetAlarmVerifyDetail'],
    regionList: autoForm.regionList,
    attention: enterpriseMonitoringModel.attention,
    total: enterpriseMonitoringModel.total,
    PageSize: enterpriseMonitoringModel.PageSize,
    PageIndex: enterpriseMonitoringModel.PageIndex,
    AlarmList:exceedDataAlarmModel.AlarmList,
    column:exceedDataAlarmModel.column,
    AlarmDetailList:exceedDataAlarmModel.AlarmDetailList,
    pollutantCodeList:exceedDataAlarmModel.pollutantCodeList,
    AlarmDealTypeList:exceedDataAlarmModel.AlarmDealTypeList,
    ManagementDetail:exceedDataAlarmModel.ManagementDetail,
    priseList:exceedDataAlarmModel.priseList,
    DGIMN:''
}))
class index extends PureComponent {
    constructor(props) {
        super(props);
        this.newTabIndex = 0
        this.state = {
            regionCode:'',
            //////////////
            dataType: "Hour",
            time: [moment().add(-24, "hour"), moment()],
            activeKey:'1',
            panes:[],
            entType:'1',
            regionValue: '',
            attentionValue: '',
            outletValue: '1',
            OperationEntCode:'',
            regVisible: false,
            regVisibleAlready: false,
            regVisibleStay: false,
            entVisible:false,
            detailsVisible:false,
            detailsVisible2:false,
            statusAlram:'',
            pollutantCodeList:[],
            AlarmDealTypeList:[],
            DealType:'2',
            enterpriseValue:'',
            ModalTitle:'',
            PollutantCode:'',
            remark:'',
            filePath:'',
            entCode:'',
            status:'',
            exportRegion:'1',
            DGIMN:''
        };
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        //获取行政区列表
        this.props.dispatch({
            type: pageUrl.getRegions,
            payload: {
                PointMark: '2',
                RegionCode: ''
            },
        });
        //获取关注度列表
        this.props.dispatch({
            type: pageUrl.GetAttentionDegreeList,
            payload: {},
        });
        
        //获取监测因子列表
        this.props.dispatch({
            type:pageUrl.GetPollutantCodeList,
            payload:{
                PollutantType:this.state.outletValue
            }
        }).then(()=>{
            if(this.props.pollutantCodeList.length > 0)
            {
                const {outletValue,dataType,time} = this.state
        
                this.props.dispatch({
                    type: pageUrl.GetAlarmVerifyRate,
                    payload: {
                        RegionCode: '',
                        attentionCode: '',
                        PollutantType: outletValue == undefined ? '' : outletValue,
                        DataType: dataType == 'Hour' ? 'HourData' : 'DayData',
                        BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                        EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                        PageSize: 20,
                        PageIndex: 1,
                        PollutantCodeList: this.props.pollutantCodeList.map(poll=>poll.PollutantCode),
                    }
                })
                this.setState({
                    pollutantCodeList:this.props.pollutantCodeList.map(poll=>poll.PollutantCode)
                })
            }
        })
        //获取核实结果
        this.props.dispatch({
            type: pageUrl.GetOverToExamineOperation,
            payload: {
                PollutantType:''
            },
        }).then(()=>{
            if(this.props.AlarmDealTypeList.length > 0)
            {
                this.setState({
                    AlarmDealTypeList:this.props.AlarmDealTypeList.map(poll=>poll.code)
                })
            }
        })

    };


    // 导出
    exportReport = () => {
        const {regionValue,attentionValue,outletValue,dataType,time,pollutantCodeList,exportRegion,OperationEntCode} = this.state
        console.log
        if(exportRegion != '1')
        {
            this.props.dispatch({
                type:pageUrl.ExportAlarmVerifyRateDetail,
                payload: {
                    RegionCode: exportRegion,
                    attentionCode: attentionValue == undefined?'':attentionValue,
                    PollutantType: outletValue == undefined?'':outletValue,
                    DataType: dataType == 'Hour'?'HourData':'DayData',
                    BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                    EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                    PollutantCodeList: pollutantCodeList,
                    OperationEntCode:OperationEntCode,
                }
            })
        }
        else{
            this.props.dispatch({
                type:pageUrl.ExportAlarmVerifyRate,
                payload: {
                    RegionCode: regionValue == undefined?'':regionValue,
                    attentionCode: attentionValue == undefined?'':attentionValue,
                    PollutantType: outletValue == undefined?'':outletValue,
                    DataType: dataType == 'Hour'?'HourData':'DayData',
                    BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                    EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                    PollutantCodeList: pollutantCodeList,
                    OperationEntCode:OperationEntCode,
                }
            })
        }
        
    }

    //查询数据
    getChartAndTableData =()=>{
        const {regionValue,attentionValue,outletValue,dataType,time,pollutantCodeList,OperationEntCode} = this.state
        
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyRate,
            payload: {
                RegionCode: regionValue == undefined?'':regionValue,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                PageSize: 20,
                PageIndex: 1,
                PollutantCodeList: pollutantCodeList,
                OperationEntCode:OperationEntCode,
            }
        })
        this.setState({
            entType:outletValue
        })

    }

    children = () => {
        const { regionList } = this.props;
        const selectList = [];
        if (regionList.length > 0) {
            regionList[0].children.map(item => {
                selectList.push(
                    <Option key={item.key} value={item.value} title={item.title}>
                        {item.title}
                    </Option>,
                );
            });
            return selectList;
        }
    };

    attention = () => {
        const { attention } = this.props;
        const selectList = [];
        if (attention.length > 0) {
            attention.map(item => {
                selectList.push(
                    <Option key={item.AttentionCode} value={item.AttentionCode} title={item.AttentionName}>
                        {item.AttentionName}
                    </Option>,
                );
            });
            return selectList;
        }
    }
    checkBoxChange =(checkedValues)=>{
        this.setState({
            pollutantCodeList:checkedValues
        })
    }
    onRef1 = (ref) => {
        this.childrenHand = ref;
      }
    cardTitle = () => {
        const { time} = this.state;
        const {pollutantCodeList} = this.props
        return <>
            <Select
                allowClear
                showSearch
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="行政区"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                optionFilterProp="children"
                filterOption={(input, option) => {
                    if (option && option.props && option.props.title) {
                        return option.props.title === input || option.props.title.indexOf(input) !== -1
                    } else {
                        return true
                    }
                }}
                onChange={(value) => {
                    this.setState({
                        regionValue: value
                    })
                }}>
                {this.children()}
            </Select>
            <Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="关注程度"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                onChange={(value) => {
                    this.setState({
                        attentionValue: value,
                    })
                }}>
                {this.attention()}
            </Select>

            <Select
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="排口类型"
                maxTagCount={2}
                maxTagTextLength={5}
                defaultValue={this.state.entType}
                maxTagPlaceholder="..."
                onChange={(value) => {
                    //获取监测因子列表
                    this.props.dispatch({
                        type: pageUrl.GetPollutantCodeList,
                        payload: {
                            PollutantType: value
                        }
                    }).then(() => {
                        if (this.props.pollutantCodeList.length > 0) {
                            this.setState({
                                pollutantCodeList: this.props.pollutantCodeList.map(poll => poll.PollutantCode)
                            })
                        }
                    })
                    this.setState({
                        outletValue: value,
                    })
                }}>
                <Option value="1">废水</Option>
                <Option value="2">废气</Option>
            </Select>
            <Radio.Group defaultValue="Hour" style={{ marginRight: 10 }} onChange={(e) => {
                this.setState({
                  dataType: e.target.value,
                  time:e.target.value === 'Day' ?[moment().add(-1, "month")]:[moment().add(-24, "hour"), moment()]
                })
                e.target.value === "Day" ?this.childrenHand.onPanelChange([moment().add(-1, "month"), moment()]):this.childrenHand.onPanelChange([moment().add(-24, "hour"), moment()]);
              }}>
                <Radio.Button value="Hour">小时</Radio.Button>
                <Radio.Button value="Day">日均</Radio.Button>
              </Radio.Group>

            <RangePicker_ allowClear={false} onRef={this.onRef1} isVerification={true} dateValue={time} dataType={this.state.dataType} style={{ width: 400, minWidth: '200px', marginRight: '10px' }} callback={
                (dates, dataType) => {
                    this.setState({
                        time: dates
                    })
                }
            } />
            <div style={{ marginTop: 10 }}>
            {/* <Select
                allowClear
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                placeholder="运维状态"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
                onChange={(value) => {
                    this.setState({
                        operationpersonnel: value,
                    })
                }}>
                <Option value="1">已设置运维人员</Option>
                <Option value="2">未设置运维人员</Option>
            </Select> */}
                <OperationUnitList style={{ width: 200, marginLeft: 10, marginRight: 10 }} onChange={(value) => { this.setState({OperationEntCode: value,  })  }}/>
                <Checkbox.Group defaultValue={pollutantCodeList.map(item=>item.PollutantCode)} value={this.state.pollutantCodeList} onChange={this.checkBoxChange}>
                {
                    pollutantCodeList.map(poll=>
                    <Checkbox value={poll.PollutantCode}>{poll.PollutantName}</Checkbox>
                    )
                }
                </Checkbox.Group>

                <Button type="primary" style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
            <Button style={{ marginRight: 10 }} onClick={this.exportReport}><ExportOutlined />导出</Button>
                <span style={{ fontSize: 14, color: 'red' }}>已核实指运维人员已核实的超标报警</span>
            </div>
        </>;
    }

    
    onChange = (PageIndex, PageSize) => {

    }
    //行政区 报警次数
    AlarmNumHandle=(regionCode,PollutantCode,regionName)=>{
        const {regionValue,attentionValue,outletValue,dataType,time,AlarmDealTypeList,OperationEntCode,DGIMN} = this.state
        this.props.dispatch({
            //获取企业列表
            type: pageUrl.GetEntByRegion,
            payload: { RegionCode: regionCode },
        });
        this.setState({
            DealType:'2',
            regVisible:true,
            regionCode:regionCode,
            PollutantCode:PollutantCode,
            ModalTitle:regionName + moment(time[0]).format('YYYY年MM月DD号HH时') + '至'+moment(time[1]).format('YYYY年MM月DD号HH时')+'超标报警情况'
        })
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                //PageSize: 10,
                //PageIndex: 1,
                PollutantCode: PollutantCode,
                Status:'',
                EntCode:'',
                VerifyStatus:AlarmDealTypeList,
                OperationEntCode:OperationEntCode,
                DGIMN:DGIMN == undefined?'':DGIMN,
            }
        })
        

    }
    //行政区 已核实报警次数
    AlreadyAlarmNumHandle=(regionCode,PollutantCode,regionName)=>{
        const {regionValue,attentionValue,outletValue,dataType,time,AlarmDealTypeList,OperationEntCode,DGIMN} = this.state
        this.setState({
            DealType:'1',
            regVisibleAlready:true,
            regionCode:regionCode,
            PollutantCode:PollutantCode,
            ModalTitle:regionName + moment(time[0]).format('YYYY年MM月DD号HH时') + '至'+moment(time[1]).format('YYYY年MM月DD号HH时')+'超标报警已核实情况'
        })
        this.props.dispatch({
            //获取企业列表
            type: pageUrl.GetEntByRegion,
            payload: { RegionCode: regionCode },
        });
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                //PageSize: 10,
                //PageIndex: 1,
                PollutantCode: PollutantCode,
                Status:'1',
                EntCode:'',
                VerifyStatus:AlarmDealTypeList,
                OperationEntCode:OperationEntCode,
                DGIMN:DGIMN?DGIMN:''
            }
        })
        
    }
    //行政区 待核实报警次数
    StayAlarmNumHandle=(regionCode,PollutantCode,regionName)=>{
        const {regionValue,attentionValue,outletValue,dataType,time,AlarmDealTypeList,OperationEntCode,DGIMN} = this.state
        this.props.dispatch({
            //获取企业列表
            type: pageUrl.GetEntByRegion,
            payload: { RegionCode: regionCode },
        });
        this.setState({
            DealType:'0',
            regVisibleStay:true,
            regionCode:regionCode,
            PollutantCode:PollutantCode,
            ModalTitle:regionName + moment(time[0]).format('YYYY年MM月DD号HH时') + '至'+moment(time[1]).format('YYYY年MM月DD号HH时')+'超标报警待核实情况'
        })
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                //PageSize: 10,
                //PageIndex: 1,
                PollutantCode: PollutantCode,
                Status:'0',
                EntCode:'',
                VerifyStatus:AlarmDealTypeList,
                OperationEntCode:OperationEntCode,
                DGIMN:DGIMN?DGIMN:''
            }
        })
        
    }
    // 企业弹框
    EntAlarmHandle =(reCode,entCode,status,PollutantCode,entName,pointName,DGIMN)=>{
        const {attentionValue,outletValue,dataType,time,regionCode,AlarmDealTypeList,OperationEntCode} = this.state
        let deal = ''
        if(status == '')
        {
            deal = '核实情况'
        }
        if(status == '0')
        {
            deal = '待核实情况'
        }
        if(status == '1')
        {
            deal = '已核实情况'
        }
        if(entCode == undefined)
        {
            this.setState({
                entVisible: true,
                ModalTitle: '全部合计' + '于' + moment(time[0]).format('YYYY年MM月DD号HH时') + '至' + moment(time[1]).format('YYYY年MM月DD号HH时') + '超标报警' + deal,
                status:status,
                PollutantCode:PollutantCode
    
            })
        }
        else
        {
            this.setState({
                entVisible: true,
                ModalTitle: entName + '-' + pointName + '于' + moment(time[0]).format('YYYY年MM月DD号HH时') + '至' + moment(time[1]).format('YYYY年MM月DD号HH时') + '超标报警' + deal,
                status:status,
                entCode:entCode,
                regionCode:reCode,
                PollutantCode:PollutantCode,
                DGIMN:DGIMN
            })
        }
        
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyDetail,
            payload: {
                RegionCode: reCode == ""?regionCode:reCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                //PageSize: 10,
               // PageIndex: 1,
                PollutantCode: PollutantCode,
                Status:status=="2"?"":status,
                EntCode:entCode == undefined?'':entCode,
                VerifyStatus:AlarmDealTypeList,
                DGIMN:DGIMN?DGIMN:'',
                OperationEntCode:OperationEntCode
            }
        })
        
    }


    //行政区 报警次数=>详情
    DetailsHandle =(verifyImage,remark)=>{
        let filename = ''
        if(verifyImage == null || verifyImage == '')
        {
            filename = ''
        }
        else{
            filename = verifyImage[0].FileName
        }
        this.setState({
            detailsVisible:true,
            remark:remark,
            filePath:filename
        })
    }
    //行政区 已核实报警次数=>详情
    DetailsHandle2 =(verifyImage,remark)=>{
        let filename = ''
        if(verifyImage == null || verifyImage == '')
        {
            filename = ''
        }
        else{
            filename = verifyImage[0].FileName
        }
        this.setState({
            detailsVisible2:true,
            remark:remark,
            filePath:filename
        })
    }
    
    //获取企业列表
    entList = () => {
        const { priseList } = this.props;
        const selectList = [];
        if (priseList.length > 0) {
            priseList.map(item => {
                selectList.push(
                    <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
                        {item.EntName}
                    </Option>,
                );
            });
            return selectList;
        }
    };

    //添加标签
    paneAdd = (text,region)=>{
        const {column,AlarmDetailList,loadingRateDetail} = this.props
        const {panes,regionValue,attentionValue,outletValue,dataType,time,pollutantCodeList,OperationEntCode} = this.state
        const activeKey = `${region}newTab${this.newTabIndex++}`;
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyRateDetail,
            payload: {
                RegionCode: region==""?regionValue:region,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime:moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                //PageSize: 20,
                //PageIndex: 1,
                PollutantCodeList: pollutantCodeList,
                OperationEntCode:OperationEntCode,
            }
        }).then(()=>{
            if(this.props.AlarmDetailList.length > 0)
            {
                const fixed = false
                const columns = [
                    {
                        title: "行政区",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'regionName',
                        key: 'regionName',
                    },
                    {
                        title: "企业名称",
                        width: 150,
                        align: 'left',
                        fixed: fixed,
                        dataIndex: 'entName',
                        key: 'entName',
                        render:(text)=>{
                            return typeof(text) == 'number'?'-':text
                        }
                    },
                    {
                        title: "监测点名称",
                        width: 100,
                        align: 'left',
                        fixed: fixed,
                        dataIndex: 'pointName',
                        key: 'pointName',
                        render:(text)=>{
                            return typeof(text) == 'number'?'-':text
                        }
                    },
                    {
                        title: "数据类型",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'dataType',
                        key: 'dataType',
                    },
                ]
                column.map(col=>{
                    let addColumns = {
                        title: col.PollutantName,
                        align: 'center',
                        fixed: fixed,
                        children: [
                            {
                                title: "报警次数",
                                width: 100,
                                align: 'center',
                                fixed: fixed,
                                dataIndex: col.PollutantCode+'_alarmCount',
                                key: col.PollutantCode+'_alarmCount',
                                render: (text,record) => {
                                    return <a onClick={this.EntAlarmHandle.bind(this,record.regionCode,record.entCode,'',col.PollutantCode,record.entName,record.pointName,record.DGIMN)}>{text}</a>
                                }
                            },
                            {
                                title: "已核实报警次数",
                                width: 100,
                                align: 'center',
                                fixed: fixed,
                                dataIndex: col.PollutantCode+'_respondedCount',
                                key: col.PollutantCode+'_respondedCount',
                                render: (text,record) => {
                                    return <a onClick={this.EntAlarmHandle.bind(this,record.regionCode,record.entCode,'1',col.PollutantCode,record.entName,record.pointName,record.DGIMN)}>{text}</a>
                                }
                            },
                            {
                                title: "待核实报警次数",
                                width: 100,
                                align: 'center',
                                fixed: fixed,
                                dataIndex: col.PollutantCode+'_noRespondedCount',
                                key: col.PollutantCode+'_noRespondedCount',
                                render: (text,record) => {
                                    return <a onClick={this.EntAlarmHandle.bind(this,record.regionCode,record.entCode,'0',col.PollutantCode,record.entName,record.pointName,record.DGIMN)}>{text}</a>
                                }
                            },
                        ]
                    }
                    columns.push(addColumns)
                })
                
                let key = ''
                let indexx = 0
                panes.map((item, index) => {
                    if (item.title == text) {
                        indexx = index
                        return key = item.key
                    }
                })
                let alarmDetailList = this.props.AlarmDetailList.filter(item=>item.regionName !== "全部合计" )
                if (key != '') {
                    let obj = {
                        title: text, content: <SdlTable  columns={columns} dataSource={alarmDetailList}
                        loading={loadingRateDetail}
                        // pagination={
                            // {
                                // showSizeChanger: true,
                                // showQuickJumper: true,
                                //defaultPageSize:20,
                            //     pageSizeOptions: ['20', '30', '40', '50'],
                            // }
                        // }    
                        // pagination={{
                            //     showSizeChanger: true,
                            //     showQuickJumper: true,
                            //     pageSize: this.props.PageSize,
                            //     current: this.props.PageIndex,
                            //     onChange: this.RegiononChange,
                            //     pageSizeOptions: ['25', '30', '40', '100'],
                            //     total: this.props.total,
                            // }}
                        />, key: key, closable: true
                    }
        
                    panes.splice(indexx, 1, obj);
                    this.setState({ panes, activeKey: key, regionCode: region,exportRegion:region});
                }
                if (key == '') {
                    panes.push({
                        title: text, content: <SdlTable  columns={columns} dataSource={alarmDetailList}
                        loading={loadingRateDetail}
                        // pagination={
                        //     {
                        //         showSizeChanger: true,
                        //         showQuickJumper: true,
                                //defaultPageSize:20,
                                // pageSizeOptions: ['20', '30', '40', '50'],
                            // }
                        // }    
                        // pagination={{
                            //     showSizeChanger: true,
                            //     showQuickJumper: true,
                            //     pageSize: this.props.PageSize,
                            //     current: this.props.PageIndex,
                            //     onChange: this.RegiononChange,
                            //     pageSizeOptions: ['25', '30', '40', '100'],
                            //     total: this.props.total,
                            // }}
                        />, key: activeKey, closable: true
                    });
                    this.setState({ panes, activeKey,regionCode:region,exportRegion:region});
                }
            }
        })
    }
    //删除标签
    remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }
        else{
            activeKey = '1'
        }
        let arr = activeKey.split('new')
        this.setState({ panes, activeKey,exportRegion:arr[0] });
      };
      //切换标签
    onChangeHandle=(activeKey)=>{
        let arr = activeKey.split('new')
        this.setState({ activeKey,exportRegion:arr[0] });
    }
    onEdit=(targetKey, action)=>{
        this[action](targetKey);
    }
    pageContent = () => {
        const { AlarmList ,column,loading,loadingRateDetail} = this.props
        const fixed = false
        const columns = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'regionName',
                key: 'regionName',
                render: (text, record) => {
                    return <a onClick={this.paneAdd.bind(this,text,record.regionCode)}> {text} </a>
                }
            },
            {
                title: "超标报警企业数",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'entCount',
                key: 'entCount',
            },
            {
                title: "超标报警监测点数",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'pointCount',
                key: 'pointCount',
            },
            {
                title: "数据类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dataType',
                key: 'dataType',
            },
        ]

        column.map(col=>{
            let addColumns ={
                title: col.PollutantName,
                align: 'center',
                fixed: fixed,
                children: [
                    {
                        title: "报警次数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: col.PollutantCode+'_alarmCount',
                        key: col.PollutantCode+'_alarmCount',
                        render: (text,record) => {
                            return <a onClick={this.AlarmNumHandle.bind(this,record.regionCode,col.PollutantCode,record.regionName)}>{text}</a>
                        }
                    },
                    {
                        title: "已核实报警次数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: col.PollutantCode+'_respondedCount',
                        key: col.PollutantCode+'_respondedCount',
                        render: (text,record) => {
                            return <a onClick={this.AlreadyAlarmNumHandle.bind(this,record.regionCode,col.PollutantCode,record.regionName)}>{text}</a>
                        }
                    },
                    {
                        title: "待核实报警次数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: col.PollutantCode+'_noRespondedCount',
                        key: col.PollutantCode+'_noRespondedCount',
                        render: (text,record) => {
                            return <a onClick={this.StayAlarmNumHandle.bind(this,record.regionCode,col.PollutantCode,record.regionName)}>{text}</a>
                        }
                    },
                ]
            }
            columns.push(addColumns)
        })

        return <>{

            <Tabs 
            hideAdd
            type="editable-card"
            onChange={this.onChangeHandle}
            activeKey={this.state.activeKey}
            onEdit={this.onEdit}
            >
                <TabPane tab={this.state.entType == '1'?'废水':'废气'} key='1' closable={false}>
                    <SdlTable columns={columns} dataSource={AlarmList}
                    loading={loading}
                        // pagination={{
                        //     showSizeChanger: true,
                        //     showQuickJumper: true,
                        //     pageSize: this.props.pageSize,
                        //     current: this.props.PageIndex,
                        //     onChange: this.onChange,
                        //     pageSizeOptions: ['20', '30', '40', '100'],
                        //     total: this.props.total,
                        // }} 
                        pagination={
                            false
                        }
                    />
                </TabPane>
                {
                    this.state.panes.map(pane=>(
                        <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                            {pane.content}
                        </TabPane>
                    ))
            }
            </Tabs>

            
        }
        </>
        //
    }

    RegCancelHandel = () => {
        this.setState({
            regVisible: false,
            regVisibleAlready: false,
            regVisibleStay:false,
            entVisible:false
        })
    }
    CancelHandel  = () => {
        this.setState({
            detailsVisible: false,
            detailsVisible2:false
        })
    }
    //报警次数数据按钮查询信息
    AlertsButtonHandle =()=>{
        const {regionValue,attentionValue,outletValue,dataType,time,DealType,regionCode,enterpriseValue,PollutantCode,AlarmDealTypeList,OperationEntCode,DGIMN} = this.state
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                //PageSize: 10,
                //PageIndex: 1,
                PollutantCode: PollutantCode,
                Status:DealType=='2'?'':DealType,
                EntCode:enterpriseValue == undefined?'':enterpriseValue,
                VerifyStatus:AlarmDealTypeList,
                DGIMN:DGIMN?DGIMN:'',
                OperationEntCode:OperationEntCode

            }
        })
    }
    //报警次数数据   导出
    ButtonHandleExpor=()=>{
        const {regionValue,attentionValue,outletValue,dataType,time,DealType,regionCode,enterpriseValue,PollutantCode,AlarmDealTypeList,OperationEntCode} = this.state
        this.props.dispatch({
            type:pageUrl.ExportAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                PollutantCode: PollutantCode,
                Status:DealType=='2'?'':DealType,
                EntCode:enterpriseValue == undefined?'':enterpriseValue,
                VerifyStatus:AlarmDealTypeList,
                OperationEntCode:OperationEntCode,
            }
        })
    }
    //已核实报警按钮查询信息
    AlreadyButtonCountHandle=()=>{

        const {regionValue,attentionValue,outletValue,dataType,time,DealType,regionCode,enterpriseValue,PollutantCode,AlarmDealTypeList,OperationEntCode,DGIMN} = this.state
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                //PageSize: 10,
                //PageIndex: 1,
                PollutantCode: PollutantCode,
                Status:'1',
                EntCode:enterpriseValue == undefined?'':enterpriseValue,
                VerifyStatus:AlarmDealTypeList,
                DGIMN:DGIMN?DGIMN:'',
                OperationEntCode:OperationEntCode
            }
        })
    }
    //已核实报警   导出
    AlreadyButtonHandleExpor=()=>{
        const {regionValue,attentionValue,outletValue,dataType,time,DealType,regionCode,enterpriseValue,PollutantCode,AlarmDealTypeList,OperationEntCode} = this.state
        this.props.dispatch({
            type:pageUrl.ExportAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime:moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                PollutantCode: PollutantCode,
                Status:'1',
                EntCode:enterpriseValue == undefined?'':enterpriseValue,
                VerifyStatus:AlarmDealTypeList,
                OperationEntCode:OperationEntCode
            }
        })
    }
    ////待核实报警按钮查询信息
    StayButtonCountHandle=()=>{
        const {regionValue,attentionValue,outletValue,dataType,time,DealType,regionCode,enterpriseValue,PollutantCode,OperationEntCode,DGIMN} = this.state
        this.props.dispatch({
            type:pageUrl.GetAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime:moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                //PageSize: 10,
                //PageIndex: 1,
                PollutantCode: PollutantCode,
                Status:'0',
                EntCode:enterpriseValue == undefined?'':enterpriseValue,
                VerifyStatus:[],
                DGIMN:DGIMN?DGIMN:'',
                OperationEntCode:OperationEntCode
            }
        })
    }
     //待核实报警   导出
    StayButtonHandleExpor=()=>{
        const {regionValue,attentionValue,outletValue,dataType,time,DealType,regionCode,enterpriseValue,PollutantCode,OperationEntCode} = this.state
        this.props.dispatch({
            type:pageUrl.ExportAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime:moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                PollutantCode: PollutantCode,
                Status:'0',
                EntCode:enterpriseValue == undefined?'':enterpriseValue,
                VerifyStatus:[],
                OperationEntCode:OperationEntCode
            }
        })
    }
    ButtonCountHandleExpor=()=>{
        const {attentionValue,outletValue,dataType,time,regionCode,PollutantCode,status,entCode,OperationEntCode} = this.state
        this.props.dispatch({
            type:pageUrl.ExportAlarmVerifyDetail,
            payload: {
                RegionCode: regionCode,
                attentionCode: attentionValue == undefined?'':attentionValue,
                PollutantType: outletValue == undefined?'':outletValue,
                DataType: dataType == 'Hour'?'HourData':'DayData',
                BeginTime:moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
                EndTime: moment(time[1]).format("YYYY-MM-DD HH:mm:ss"),
                PollutantCode: PollutantCode,
                Status:status=="2"?"":status,
                EntCode:entCode,
                VerifyStatus:[],
                OperationEntCode:OperationEntCode
            }
        })
    }
    AlarmDealCheckBoxChange =(checkedValues)=>{
        this.setState({
            AlarmDealTypeList:checkedValues
        })
    }
    downloadFile=(filePath)=>{
        downloadFile(filePath)
    }
    render() {
        const { loading,priseList ,AlarmDealTypeList,ManagementDetail,loadingDetail} = this.props
        const fixed = false
        const columns2 = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'regionName',
                key: 'regionName',
            },
            {
                title: "企业名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName',
            },
            {
                title: "监测点名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'pointName',
                key: 'pointName',
            },
            {
                title: "运维单位",
                align: 'center',
                fixed: fixed,
                dataIndex: 'operationEntName',
                key: 'operationEntName',
                render: (text, record) => {
                    return <div style={{textAlign:'left'}}>{text}</div>
                  }
              },
            {
                title: "数据类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dataType',
                key: 'dataType',
            },
            {
                title: "首次报警时间",
                width: 120,
                align: 'center',
                fixed: fixed,
                dataIndex: 'firstTime',
                key: 'firstTime',
                defaultSortOrder: 'descend',
                sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
            },
            {
                title: "报警因子",
                width: 90,
                align: 'center',
                fixed: fixed,
                dataIndex: 'pollutantName',
                key: 'pollutantName',
            },
            {
                title: "报警信息",
                width: 200,
                align: 'left',
                fixed: fixed,
                dataIndex: 'message',
                key: 'message',
            },
            {
                title: "核实人",
                width: 90,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dealPerson',
                key: 'dealPerson',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'verifyTime',
                key: 'verifyTime',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实状态",
                width: 90,
                align: 'center',
                fixed: fixed,
                dataIndex: 'status',
                key: 'status',
                render:(text)=>{
                    return text == ''?'-':text == 0?'待核实':'已核实'
                    }
            },
            {
                title: "核实结果",
                width: 90,
                align: 'center',
                fixed: fixed,
                dataIndex: 'verifymessage',
                key: 'verifymessage',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实详情",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'remark',
                key: 'remark',
                render:(text,record)=>{
                    let sourc = []
                     if(!record.verifyImage&&!record.remark )
                     {
                        sourc = []
                     }
                     else
                     {
                        let obj = {};
                        record.verifyImage&&record.verifyImage.map(item=>{
                            obj = {
                                name:item.FileName,
                                attach:'/upload/'+item.FileName
                            }
                        })
                        obj.remark = text;
                        sourc.push(obj)
                     }
                     return sourc.length>0? <VerifyDetailsPop dataSource={sourc}/>:'-'
                //return record.status==''?'-':record.status == 0?'-':<a onClick={this.DetailsHandle.bind(this,record.verifyImage,record.remark)}>详情</a>
                }
            },
        ]
        const columns3 = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'regionName',
                key: 'regionName',
            },
            {
                title: "企业名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName',
            },
            {
                title: "监测点名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'pointName',
                key: 'pointName',
            },
            {
                title: "运维单位",
                align: 'center',
                fixed: fixed,
                dataIndex: 'operationEntName',
                key: 'operationEntName',
                render: (text, record) => {
                    return <div style={{textAlign:'left'}}>{text}</div>
                  }
              },
            {
                title: "数据类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dataType',
                key: 'dataType',
            },
            {
                title: "首次报警时间",
                width: 120,
                align: 'center',
                fixed: fixed,
                dataIndex: 'firstTime',
                key: 'firstTime',
                defaultSortOrder: 'descend',
                sorter: (a, b) => moment(a.firstTime).valueOf() - moment(b.firstTime).valueOf()
            },
            {
                title: "报警因子",
                width: 90,
                align: 'center',
                fixed: fixed,
                dataIndex: 'pollutantName',
                key: 'pollutantName',
            },
            {
                title: "报警信息",
                width: 200,
                align: 'center',
                fixed: fixed,
                dataIndex: 'message',
                key: 'message',
            },
            {
                title: "核实人",
                width: 90,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dealPerson',
                key: 'dealPerson',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'verifyTime',
                key: 'verifyTime',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实状态",
                width: 90,
                align: 'center',
                fixed: fixed,
                dataIndex: 'status',
                key: 'status',
                render:(text)=>{
                    return text == ''?'-':text == '0'?'待核实':'已核实'
                    }
            },
            {
                title: "核实结果",
                width: 90,
                align: 'center',
                fixed: fixed,
                dataIndex: 'verifymessage',
                key: 'verifymessage',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实详情",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'remark',
                key: 'remark',
                render:(text,record)=>{
                    let sourc = [];
                   
                     if(!record.verifyImage&&!record.remark )
                     {
                        sourc = []
                     }
                     else
                     {     
                        let obj = {};
                        record.verifyImage&&record.verifyImage.map(item=>{
                            obj = {
                                name:item.FileName,
                                attach:'/upload/'+item.FileName,
                            }
                        })
                        obj.remark = text;
                        sourc.push(obj)
                     }
                     return  <VerifyDetailsPop dataSource={sourc}/>
                    //  return sourc.length>0? <FileDown dataSource={sourc}/>:'-'
                    }
            },
        ]
        const columns4 = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'regionName',
                key: 'regionName',
            },
            {
                title: "企业名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName',
            },
            {
                title: "监测点名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'pointName',
                key: 'pointName',
            },
            {
                title: "运维单位",
                align: 'center',
                fixed: fixed,
                dataIndex: 'operationEntName',
                key: 'operationEntName',
                render: (text, record) => {
                    return <div style={{textAlign:'left'}}>{text}</div>
                  }
              },
            {
                title: "数据类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dataType',
                key: 'dataType',
            },
            {
                title: "报警因子",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'pollutantName',
                key: 'pollutantName',
            },
            {
                title: "报警信息",
                width: 200,
                align: 'left',
                fixed: fixed,
                dataIndex: 'message',
                key: 'message',
            },
            {
                title: "核实人",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dealPerson',
                key: 'dealPerson',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实结果",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'verifymessage',
                key: 'verifymessage',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'verifyTime',
                key: 'verifyTime',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实状态",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'status',
                key: 'status',
                render:(text)=>{
                    return text == ''?'-':text == '0'?'待核实':'已核实'
                    }
            } ,
            {
                title: "核实详情",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'remark',
                key: 'remark',
                render:(text,record)=>{
                    let sourc = []
                    if(!record.remark && (record.verifyImage == null || record.verifyImage == '' || record.status ==0) )
                     {
                        sourc = []
                     }
                     else
                     {
                       let obj = {};
                        record.verifyImage&&record.verifyImage.map(item=>{
                            obj = {
                                name:item.FileName,
                                attach:'/upload/'+item.FileName
                            }
                        })
                        obj.remark = text;
                        sourc.push(obj)
                     }
                     return sourc.length>0? <VerifyDetailsPop dataSource={sourc}/>:'-'
                    }
            },
        ]
        const columns5 = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'regionName',
                key: 'regionName',
            },
            {
                title: "企业名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'entName',
                key: 'entName',
                render:(text)=>{
                    return text == undefined?'-':text
                }
            },
            {
                title: "监测点名称",
                width: 100,
                align: 'left',
                fixed: fixed,
                dataIndex: 'pointName',
                key: 'pointName',
                render:(text)=>{
                    return text == undefined?'-':text
                }
            },
            {
                title: "运维单位",
                align: 'center',
                fixed: fixed,
                dataIndex: 'operationEntName',
                key: 'operationEntName',
                render: (text, record) => {
                    return <div style={{textAlign:'left'}}>{text}</div>
                  }
              },

            {
                title: "数据类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dataType',
                key: 'dataType',
            },
            {
                title: "首次超标时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'firstTime',
                key: 'firstTime',
            },
            {
                title: "报警因子",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'pollutantName',
                key: 'pollutantName',
            },
            {
                title: "报警信息",
                width: 200,
                align: 'left',
                fixed: fixed,
                dataIndex: 'message',
                key: 'message',
            },
            {
                title: "核实人",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'dealPerson',
                key: 'dealPerson',
                render:(text)=>{
                    return text == ''?'-':text
                }
            },
            {
                title: "核实结果",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'verifymessage',
                key: 'verifymessage',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实时间",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'verifyTime',
                key: 'verifyTime',
                render:(text)=>{
                    return text == ''?'-':text
                    }
            },
            {
                title: "核实状态",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'status',
                key: 'status',
                render:(text)=>{
                    return text == ''?'-':text=='0'?'待核实':'已核实'
                }
            },
            {
                title: "核实详情",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'remark',
                key: 'remark',
                render:(text,record)=>{
                    let sourc = []
                    if(!record.verifyImage&&!record.remark)
                    {
                       sourc = []
                    }
                    else
                    {
                       let obj = {};
                       record.verifyImage&&record.verifyImage.map(item=>{
                            obj = {
                               name:item.FileName,
                               attach:'/upload/'+item.FileName
                           }
                       })
                       obj.remark = text;
                       sourc.push(obj)
                    }
                    return sourc.length>0? <VerifyDetailsPop dataSource={sourc}/>:'-'
                }
            },
        ]
        return <>
            <div id="siteParamsPage" className={style.cardTitle}>
                <BreadcrumbWrapper title="超标数据报警核实记录查询">
                    <Card
                        extra={
                            <>
                               {
                                   this.cardTitle()
                               }
                            </>
                        }
                        className={style.dataTable}
                    >

                        {this.pageContent()}
                    </Card>
                    <Modal
                        centered
                        title={this.state.ModalTitle}
                        visible={this.state.regVisible}
                        footer={null}
                        width={1300}
                        onCancel={this.RegCancelHandel}
                    >
                        <div style={{ marginBottom: 10 }}>
                            <Select
                                allowClear
                                showSearch
                                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                                placeholder="企业列表"
                                maxTagCount={2}
                                maxTagTextLength={5}
                                maxTagPlaceholder="..."
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    if (option && option.props && option.props.title) {
                                        return option.props.title === input || option.props.title.indexOf(input) !== -1
                                    } else {
                                        return true
                                    }
                                }}
                                onChange={(value) => {
                                    this.setState({
                                        enterpriseValue: value
                                    })
                                }}>
                                {this.entList()}
                            </Select>
                            <Radio.Group value={this.state.DealType} style={{ marginRight: 10,marginLeft: 10 }} onChange={(e) => {
                                this.setState({
                                    DealType: e.target.value,
                                })
                            }}>
                                <Radio.Button value="2">全部</Radio.Button>
                                <Radio.Button value="1">已核实</Radio.Button>
                                <Radio.Button value="0">待核实</Radio.Button>
                            </Radio.Group>
                            <Button type='primary' style={{ marginRight: 10 }} onClick={this.AlertsButtonHandle}> 查询</Button>
                            <Button onClick={this.ButtonHandleExpor}><ExportOutlined /> 导出</Button>
                            <div style={{marginTop:10}}>
                            {this.state.DealType === '1'?
                                <div>
                                <label style={{ fontSize: 14, marginRight: 10, marginLeft: 10 }}>核实结果:</label>
                                <Checkbox.Group defaultValue={AlarmDealTypeList.map(item=>item.code)}  onChange={this.AlarmDealCheckBoxChange}>
                                    {
                                        AlarmDealTypeList.map(poll =>
                                            <Checkbox value={poll.code}>{poll.name}</Checkbox>
                                        )
                                    }
                                </Checkbox.Group>
                                </div>
                                :null }
                            </div>
                        </div>
                        {
                           <SdlTable scroll={{ y: 500 }} loading={loadingDetail} columns={columns2} dataSource={ManagementDetail} pagination={false} />
                        }
                    </Modal>
                    <Modal
                        centered
                        title={this.state.ModalTitle}
                        visible={this.state.regVisibleAlready}
                        footer={null}
                        width={1300}
                        onCancel={this.RegCancelHandel}
                    >
                        <div style={{ marginBottom: 10 }}>
                            <Select
                                allowClear
                                showSearch
                                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                                placeholder="企业列表"
                                maxTagCount={2}
                                maxTagTextLength={5}
                                maxTagPlaceholder="..."
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    if (option && option.props && option.props.title) {
                                        return option.props.title === input || option.props.title.indexOf(input) !== -1
                                    } else {
                                        return true
                                    }
                                }}
                                onChange={(value) => {
                                    this.setState({
                                        enterpriseValue: value
                                    })
                                }}>
                                {this.entList()}
                            </Select>
                            <Button type='primary' style={{ marginRight: 10 }} onClick={this.AlreadyButtonCountHandle}> 查询</Button>
                            <Button onClick={this.AlreadyButtonHandleExpor}><ExportOutlined /> 导出</Button>
                            <div style={{marginTop:10}}>
                                <label style={{ fontSize: 14, marginRight: 10, marginLeft: 10 }}>核实结果:</label>
                                <Checkbox.Group defaultValue={AlarmDealTypeList.map(item=>item.code)} onChange={this.AlarmDealCheckBoxChange}>
                                    {
                                        AlarmDealTypeList.map(poll =>
                                            <Checkbox value={poll.code}>{poll.name}</Checkbox>
                                        )
                                    }
                                </Checkbox.Group>
                            </div>
                        </div>
                        {
                            <SdlTable scroll={{ y: 500 }} loading={loadingDetail} columns={columns3} dataSource={ManagementDetail} pagination={false} />
                        }
                        
                    </Modal>
                    <Modal
                        centered
                        title={this.state.ModalTitle}
                        visible={this.state.regVisibleStay}
                        footer={null}
                        width={1300}
                        onCancel={this.RegCancelHandel}
                    >
                        <div style={{ marginBottom: 10 }}>
                            <Select
                                allowClear
                                showSearch
                                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                                placeholder="企业列表"
                                maxTagCount={2}
                                maxTagTextLength={5}
                                maxTagPlaceholder="..."
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    if (option && option.props && option.props.title) {
                                        return option.props.title === input || option.props.title.indexOf(input) !== -1
                                    } else {
                                        return true
                                    }
                                }}
                                onChange={(value) => {
                                    this.setState({
                                        enterpriseValue: value
                                    })
                                }}>
                                {this.entList()}
                            </Select>
                            <Button type='primary' style={{ marginRight: 10 }} onClick={this.StayButtonCountHandle}> 查询</Button>
                            <Button onClick={this.StayButtonHandleExpor}><ExportOutlined /> 导出</Button>
                        </div>
                        {
                            <SdlTable scroll={{ y: 500 }} loading={loadingDetail} columns={columns4} dataSource={ManagementDetail} pagination={false} />
                        }
                        
                    </Modal>
                    <Modal
                        centered
                        title={this.state.ModalTitle}
                        visible={this.state.entVisible}
                        footer={null}
                        width={1300}
                        onCancel={this.RegCancelHandel}
                    >
                        <div style={{ marginBottom: 10 }}>
                            <Button onClick={this.ButtonCountHandleExpor}><ExportOutlined /> 导出</Button>
                        </div>
                        {
                            <SdlTable loading={loadingDetail} columns={columns5} scroll={{ y: 500 }} dataSource={ManagementDetail} pagination={false} />
                        }
                        
                    </Modal>
                    <Modal
                        centered
                        title="核实信息"
                        visible={this.state.detailsVisible}
                        footer={null}
                        width={500}
                        onCancel={this.CancelHandel}
                    >
                        <div style={{ marginBottom: 10 }}>
                            <div>
                                <label>备注:</label>
                                <span>{this.state.remark}</span>
                            </div>
                            <div>
                                <label>附件:</label>
                                <a onClick={this.downloadFile.bind(this,this.state.filePath)}>{this.state.filePath}</a>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        centered
                        title="核实信息"
                        visible={this.state.detailsVisible2}
                        footer={null}
                        width={500}
                        onCancel={this.CancelHandel}
                    >
                        <div style={{ marginBottom: 10 }}>
                            <div>
                                <label>备注:</label>
                                <span>{this.state.remark}</span>
                            </div>
                            <div>
                                <label>附件:</label>
                                <a onClick={this.downloadFile.bind(this,this.state.filePath)}>{this.state.filePath}</a>
                            </div>
                        </div>
                    </Modal>
                </BreadcrumbWrapper>
            </div>
        </>;
    }
}

export default index;

