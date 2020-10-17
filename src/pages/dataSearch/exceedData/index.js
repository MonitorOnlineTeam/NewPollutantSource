/**
 * 功  能：超标数据查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.14
 */
import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message, Tabs, Modal,Icon,InputNumber,Form ,Input } from 'antd'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import moment from 'moment'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import { routerRedux } from 'dva/router';
import { Right } from '@/utils/icon';
import CheckboxGroup from 'antd/lib/checkbox/Group';
const { Option } = Select;
const { TabPane } = Tabs;


const pageUrl = {
    GetAttentionDegreeList: 'enterpriseMonitoringModel/GetAttentionDegreeList',
    getRegions: 'autoForm/getRegions',
    GetPollutantByType:'exceedDataModel/GetPollutantByType',
    GetExceedDataList:'exceedDataModel/GetExceedDataList',
    GetMoalExceedDataList:'exceedDataModel/GetMoalExceedDataList',
    GetExceedNum:'exceedDataModel/GetExceedNum',
    ExportExceedDataList:'exceedDataModel/ExportExceedDataList',
    ExportExceedNum:'exceedDataModel/ExportExceedNum',
}
@connect(({ loading, autoForm,enterpriseMonitoringModel ,exceedDataModel}) => ({
    loading:loading.effects['exceedDataModel/GetExceedDataList'],
    loadingEnt:loading.effects['exceedDataModel/GetMoalExceedDataList'],
    loadingCount:loading.effects['exceedDataModel/GetExceedNum'],
    regionList: autoForm.regionList,
    attention: enterpriseMonitoringModel.attention,
    PollutantByType:exceedDataModel.PollutantByType,
    priseList: exceedDataModel.priseList,
    ExceedDataList:exceedDataModel.ExceedDataList,
    PageSize:exceedDataModel.PageSize,
    PageIndex:exceedDataModel.PageIndex,
    total:exceedDataModel.total,
    RegionDataList:exceedDataModel.RegionDataList,
    EntCountList:exceedDataModel.EntCountList,
    ExceedNumList:exceedDataModel.ExceedNumList,
}))
class index extends PureComponent {
    
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        
        this.state = {
            // regionValue: '',
            // attentionValue: '',
            // outletValue: '',
            visible: false,
            visibleMoni: false,
            visibleEnt:false,
            time: [moment().add(-24, "hour"), moment()],
            dataType: "Hour",
            entType:'1',
            pollutionWaterList:[],
            pollutionGasList:[],
            activeKey:'1',
            panes:[],
            enterpriseValue:'',
            selectPollution:[],
            RegionCode: '',
            AttentionCode: '',
            PollutantTypeCode: '',
            DataType: '',
            BeginTime: '',
            EndTime: '',
            TabType: '',
            PollutantList: [],
            regionCode:'',
            EntCountList:[],
            modalSelectPollution:[],
            modalPollutantList:[],
            modalSelectPollution2:[]
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
        //获取监测因子类型
        this.props.dispatch({
            type: pageUrl.GetPollutantByType,
            payload: {
                type:'1'
            },
        })
    };
    handleSummit=(e)=>{
        const { PollutantByType } = this.props
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            let pollutionData = []
            let selectPollution = []
            PollutantByType.map(item=>{
                let obj = {}
                let Min = null
                let Max = null
                if (values[item.PollutantCode] != '') {
                    let pollution = {}
                    pollution['PollutantName'] = item.PollutantName
                    pollution['PollutantCode'] = values[item.PollutantCode].toString()
                    selectPollution.push(pollution)
                    if(values[item.PollutantCode+'Min'] != undefined)
                    {
                        Min = values[item.PollutantCode+'Min']
                    }
                    if(values[item.PollutantCode+'Max'] != undefined)
                    {
                        Max = values[item.PollutantCode+'Max']
                    }
                    if(Min == null && Max == null)
                    {
                        obj = {
                            PollutantCode:values[item.PollutantCode].toString()
                        }
                    }
                    if(Min != null || Max != null)
                    {
                        obj = {
                            PollutantCode:values[item.PollutantCode].toString(),
                            ExceedMultiple:{
                                Min:Min != null ? Number(Min): Min,
                                Max:Max != null ? Number(Max): Max
                            }
                        }
                    }
                    pollutionData.push(obj)
                }
            })


              this.setState({
                  selectPollution: selectPollution,
                  RegionCode: values.Region == undefined ? '' : values.Region,
                  AttentionCode: values.attention == undefined ? '' : values.attention,
                  PollutantTypeCode: values.outlet == undefined ? '' : values.outlet,
                  DataType: values.dataType == undefined ? '' : values.dataType == 'Hour' ? 'HourData' : 'DayData',
                  BeginTime: values.dateTime[0],
                  EndTime: values.dateTime[1],
                  TabType: values.outlet == undefined ? '' : values.outlet,
                  PollutantList: pollutionData
              })

            this.props.dispatch({
                type:pageUrl.GetExceedDataList,
                payload:{
                    RegionCode: values.Region == undefined ? '' : values.Region,
                    AttentionCode: values.attention == undefined ? '' : values.attention,
                    PollutantTypeCode: values.outlet == undefined ? '' : values.outlet,
                    DataType: values.dataType == undefined ? '' : values.dataType == 'Hour'?'HourData':'DayData',
                    BeginTime: values.dateTime[0],
                    EndTime: values.dateTime[1],
                    TabType: values.outlet == undefined ? '' : values.outlet,
                    PollutantList: pollutionData
                }
            })
            console.log('Received values of form: ', values);
          }
        });

        


    }

    // 导出
    exportReport = (e) => {

        const { PollutantByType } = this.props
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            let pollutionData = []
            let selectPollution = []
            PollutantByType.map(item=>{
                let obj = {}
                let Min = null
                let Max = null
                if (values[item.PollutantCode] != '') {
                    let pollution = {}
                    pollution['PollutantName'] = item.PollutantName
                    pollution['PollutantCode'] = values[item.PollutantCode].toString()
                    selectPollution.push(pollution)
                    if(values[item.PollutantCode+'Min'] != undefined)
                    {
                        Min = values[item.PollutantCode+'Min']
                    }
                    if(values[item.PollutantCode+'Max'] != undefined)
                    {
                        Max = values[item.PollutantCode+'Max']
                    }
                    if(Min == null && Max == null)
                    {
                        obj = {
                            PollutantCode:values[item.PollutantCode].toString()
                        }
                    }
                    if(Min != null || Max != null)
                    {
                        obj = {
                            PollutantCode:values[item.PollutantCode].toString(),
                            ExceedMultiple:{
                                Min:Min != null ? Number(Min): Min,
                                Max:Max != null ? Number(Max): Max
                            }
                        }
                    }
                    pollutionData.push(obj)
                }
            })
              this.setState({
                  selectPollution: selectPollution,
                  RegionCode: values.Region == undefined ? '' : values.Region,
                  AttentionCode: values.attention == undefined ? '' : values.attention,
                  PollutantTypeCode: values.outlet == undefined ? '' : values.outlet,
                  DataType: values.dataType == undefined ? '' : values.dataType == 'Hour' ? 'HourData' : 'DayData',
                  BeginTime: values.dateTime[0],
                  EndTime: values.dateTime[1],
                  TabType: values.outlet == undefined ? '' : values.outlet,
                  PollutantList: pollutionData
              })

            this.props.dispatch({
                type:pageUrl.ExportExceedDataList,
                payload:{
                    RegionCode: values.Region == undefined ? '' : values.Region,
                    AttentionCode: values.attention == undefined ? '' : values.attention,
                    PollutantTypeCode: values.outlet == undefined ? '' : values.outlet,
                    DataType: values.dataType == undefined ? '' : values.dataType == 'Hour'?'HourData':'DayData',
                    BeginTime: values.dateTime[0],
                    EndTime: values.dateTime[1],
                    TabType: values.outlet == undefined ? '' : values.outlet,
                    PollutantList: pollutionData,
                    PageSize:25,
                    PageIndex:1
                }
            })
            console.log('Received values of form: ', values);
          }
        });
    }

    paneAdd = (region,text)=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution} = this.state
        const activeKey = `newTab${this.newTabIndex++}`;
        this.props.dispatch({
            type:pageUrl.GetExceedDataList,
            payload:{
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: region,
                PollutantList: PollutantList,
                PageSize:25,
                PageIndex:1
            }
        }).then(()=>{
            if(this.props.RegionDataList.length > 0)
            {

                const fixed = false
                const columns = [
                    {
                        title: "行政区",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'Region',
                        key: 'Region',
                    },
                    {
                        title: "企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'EntName',
                        key: 'EntName',
                    },
                    {
                        title: "监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'PointNum',
                        key: 'PointNum',
                    },
                    {
                        title: "数据类型",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'DataType',
                        key: 'DataType',
                    }
                ]
                selectPollution.map(item=>{
                    let addColumns ={}
                    addColumns = {
                        title: item.PollutantName,
                        align: 'center',
                        fixed: fixed,
                        children: [
                            {
                                title: "超标监测点数",
                                width: 100,
                                align: 'center',
                                fixed: fixed,
                                dataIndex: 'PollutantData.PointNum-'+item.PollutantCode,
                                key: 'PollutantData.PointNum-'+item.PollutantCode,
                            },
                            {
                                title: "超标次数",
                                width: 100,
                                align: 'center',
                                fixed: fixed,
                                dataIndex: 'PollutantData.ExceedNum-'+item.PollutantCode,
                                key: 'PollutantData.ExceedNum-'+item.PollutantCode,
                                render: (text) => {
                                    return <a onClick={this.exCountHandle}>{text}</a>
                                }
                            },
                            {
                                title: "最大超标倍数",
                                width: 100,
                                align: 'center',
                                fixed: fixed,
                                dataIndex: 'PollutantData.MaxMultiple-'+item.PollutantCode,
                                key: 'PollutantData.MaxMultiple-'+item.PollutantCode,
                                render: (text) => {
                                    return text == null?'-':text
                                }
                            },
                        ]
                    }
        
                    columns.push(addColumns)
                })

                let index = ''
                panes.map(item => {
                    if (item.title == text) {
                        return index = item.key
                    }
                })
                if (index != '') {
                    this.setState({ panes, activeKey:index,regionCode:region });
                }
                if (index == '') {
                    panes.push({
                        title: text, content: <SdlTable columns={columns} dataSource={this.props.RegionDataList}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSize: this.props.PageSize,
                            current: this.props.PageIndex,
                            onChange: this.RegiononChange,
                            pageSizeOptions: ['25', '30', '40', '100'],
                            total: this.props.total,
                          }}
                        />, key: activeKey, closable: true
                    });
                    this.setState({ panes, activeKey,regionCode:region });
                }
            }
        })
    }
    //超标企业数查询
    exEntHandle =(pointCode,rCode)=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode} = this.state

        let arr = []
        PollutantList.map(item=>{
            if(item.PollutantCode == pointCode)
            {
                return arr.push(item)
            }
        })

        let modalSelectPollution  = []
        selectPollution.map(item=>{
            if(item.PollutantCode == arr[0].PollutantCode)
            {
                return modalSelectPollution.push(item)
            }
        })  
        this.props.dispatch({
            //获取企业列表
            type: 'exceedDataModel/GetEntByRegion',
            payload: { RegionCode: rCode },
        });
        this.props.dispatch({
            type:pageUrl.GetMoalExceedDataList,
            payload:{
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: rCode,
                PollutantList: arr,
                PageSize:25,
                PageIndex:1,
                EntCode:''
            }
        }).then(()=>{
            if(this.props.EntCountList.length >0)
            {
                this.setState({
                    visible:true,
                    modalSelectPollution:modalSelectPollution,
                    modalPollutantList:arr,
                    regionCode:rCode
                })
            }
        })
    }
    //超标次数弹框
    exCountHandle=(pointCode,rCode,flag)=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode} = this.state
        console.log(pointCode)
        console.log(rCode)
        let arr = []
        PollutantList.map(item=>{
            if(item.PollutantCode == pointCode)
            {
                return arr.push(item)
            }
        })

        let modalSelectPollution  = []
        selectPollution.map(item=>{
            if(item.PollutantCode == arr[0].PollutantCode)
            {
                return modalSelectPollution.push(item)
            }
        })  
        this.props.dispatch({
            //获取企业列表
            type: 'exceedDataModel/GetEntByRegion',
            payload: { RegionCode: rCode },
        });
        this.props.dispatch({
            type:pageUrl.GetExceedNum,
            payload:{
                RegionCode: rCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: '',
                PollutantList: arr,
                PageSize:25,
                PageIndex:1,
                EntCode:''
            }
        }).then(()=>{
            if(this.props.ExceedNumList.length >0)
            {
                if(flag)
                {
                    this.setState({
                        visibleEnt:true,
                        modalSelectPollution2:modalSelectPollution,
                        modalPollutantList:arr
                    }) 
                }
                else{
                    this.setState({
                        visibleMoni:true,
                        modalSelectPollution2:modalSelectPollution,
                        modalPollutantList:arr
                    })
                }
                
            }
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
    //获取关注度列表
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
    onRef1 = (ref) => {
        this.childrenHand = ref;
      }

    cardTitle = () => {
        const { PollutantByType } = this.props
        const { getFieldDecorator  } = this.props.form;
        return (
            <>
                <div>
                    
                    <Form onSubmit={this.handleSummit} layout="inline">
                       
                        <Form.Item label='行政区' >
                            {
                                getFieldDecorator('Region', {
                                    
                                })(
                                        <Select
                                            allowClear
                                            showSearch
                                            style={{ width: 200, marginLeft: 10, marginRight: 20 }}
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
                                                
                                            }}>
                                            {this.children()}
                                        </Select>
                                )
                            }

                        </Form.Item>
                        <Form.Item label="关注度" >
                            {
                                getFieldDecorator('attention', {

                                })(
                                    <Select
                                            allowClear
                                            style={{ width: 200, marginLeft: 10, marginRight: 20 }}
                                            placeholder="关注度"
                                            maxTagCount={2}
                                            maxTagTextLength={5}
                                            maxTagPlaceholder="..."
                                            onChange={(value) => {
                                                
                                            }}>
                                            {this.attention()}
                                        </Select>
                                )
                            }

                        </Form.Item>
                        <Form.Item label="企业类型" >
                            {
                                getFieldDecorator('outlet', {
                                    initialValue:'1'
                                })(
                                    <Select
                                            allowClear
                                            style={{ width: 200, marginLeft: 10, marginRight: 20 }}
                                            //defaultValue={'1'}
                                            placeholder="企业类型"
                                            maxTagCount={2}
                                            maxTagTextLength={5}
                                            maxTagPlaceholder="..."
                                            onChange={(value) => {
                                                this.props.dispatch({
                                                    type: pageUrl.GetPollutantByType,
                                                    payload: {
                                                        type: value
                                                    }
                                                }).then(() => {
                                                    this.setState({
                                                        entType: value,
                                                    })
                                                })
                                            }}>
                                            <Option value="1">废水</Option>
                                            <Option value="2">废气</Option>
                                        </Select>
                                )
                            }

                        </Form.Item>
                        <Form.Item label='数据类型' >
                            {
                                getFieldDecorator('dataType', {
                                    initialValue:'Hour'
                                })(
                                        <Radio.Group  style={{ marginRight: 20, marginLeft: 10 }} onChange={(e) => {
                                            this.setState({
                                                dataType: e.target.value,
                                                time: e.target.value === 'Day' ? [moment().add(-1, "month")] : [moment().add(-24, "hour"), moment()]
                                            })
                                            e.target.value === "Day" ? this.childrenHand.onPanelChange([moment().add(-1, "month"), moment()]) : this.childrenHand.onPanelChange([moment().add(-24, "hour"), moment()]);
                                        }}>
                                            <Radio.Button value="Hour">小时</Radio.Button>
                                            <Radio.Button value="Day">日均</Radio.Button>
                                        </Radio.Group>
                                )
                            }

                        </Form.Item>
                        <Form.Item >
                            {
                                getFieldDecorator('dateTime',{
                                    initialValue:this.state.time
                                })(
                                    <RangePicker_ onRef={this.onRef1} isVerification={true} dataType={this.state.dataType} style={{ width: 400, minWidth: '200px', marginRight: '10px' }} callback={
                                        (dates, dataType) => {
                                            this.setState({
                                                time: dates
                                            })
                                        }
                                    } />    
                                )
                            }
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" style={{ marginRight: 10 }} htmlType='submit' >查询</Button>
                        </Form.Item>
                        <Form.Item >
                        <Button style={{ marginRight: 10 }} htmlType='submit' onClick={this.exportReport}><Icon type="export" />导出</Button>
                        </Form.Item>
                        <div >
                        <Form.Item label='监测因子'></Form.Item>
                        
                        {
                            this.state.entType == '1' &&
                            PollutantByType.map((item,i) =>
                            (i+1) % 6 == 0 ?
                            <span>
                                <br/>
                                <Form.Item >
                                    <span>
                                        <Form.Item>
                                            {
                                                getFieldDecorator(item.PollutantCode, {
                                                    initialValue:''
                                                })
                                                    (
                                                        <Checkbox.Group>
                                                            <Checkbox value={item.PollutantCode}>{item.PollutantName}</Checkbox>
                                                        </Checkbox.Group>
                                                    )
                                            }
                                        </Form.Item>
                                        <Form.Item>
                                            <Form.Item>
                                                {
                                                    getFieldDecorator(item.PollutantCode+'Min',{})(
                                                    <span style={{marginLeft: -10 }}>
                                                        <span style={{ fontSize: 14 }}>超标倍数:</span>
                                                        <InputNumber size='small' style={{ width: 50, marginRight: 5,marginLeft: 5 }} />
                                                        <span style={{ fontSize: 14 }}>至</span>
                                                    </span>
                                                    )
                                                }
                                            </Form.Item>
                                            <Form.Item>
                                                {
                                                    getFieldDecorator(item.PollutantCode+'Max',{})(
                                                        <InputNumber size='small' style={{ marginRight: 5,marginLeft: -12, width: 50 }} />
                                                    )
                                                }
                                            </Form.Item>
                                        </Form.Item>

                                    </span>

                                </Form.Item></span>
                            
                            :<Form.Item >
                                    <span>
                                        <Form.Item>
                                            {
                                                getFieldDecorator(item.PollutantCode, {
                                                    initialValue:''
                                                })
                                                    (
                                                        <Checkbox.Group>
                                                            <Checkbox value={item.PollutantCode}>{item.PollutantName}</Checkbox>
                                                        </Checkbox.Group>
                                                    )
                                            }
                                        </Form.Item>
                                        <Form.Item>
                                            <Form.Item>
                                                {
                                                    getFieldDecorator(item.PollutantCode+'Min',{})(
                                                    <span style={{marginLeft: -10 }}>
                                                        <span style={{ fontSize: 14 }}>超标倍数:</span>
                                                        <InputNumber size='small' style={{ width: 50, marginRight: 5,marginLeft: 5 }} />
                                                        <span style={{ fontSize: 14 }}>至</span>
                                                    </span>
                                                    )
                                                }
                                            </Form.Item>
                                            <Form.Item>
                                                {
                                                    getFieldDecorator(item.PollutantCode+'Max',{})(
                                                        <InputNumber size='small' style={{ marginRight: 5,marginLeft: -12, width: 50 }} />
                                                    )
                                                }
                                            </Form.Item>
                                        </Form.Item>

                                    </span>

                                </Form.Item>
                                
                            )
                        }
                        {
                            this.state.entType == '2' &&
                            PollutantByType.map((item,i) =>
                            (i+1) % 6 == 0 ? <span>
                                <br/>
                                <Form.Item >
                                    <span>
                                        <Form.Item>
                                            {
                                                getFieldDecorator(item.PollutantCode, {})
                                                    (
                                                        <Checkbox.Group>
                                                            <Checkbox value={item.PollutantName}>{item.PollutantName}</Checkbox>
                                                        </Checkbox.Group>
                                                    )
                                            }
                                        </Form.Item>
                                        <Form.Item>
                                            {
                                                getFieldDecorator(item.PollutantCode + 'Value', {})(
                                                    <span>
                                                        <span style={{ fontSize: 14 }}>超标倍数:</span>
                                                        <InputNumber size='small' style={{ width: 50, marginRight: 5 }} />
                                                        <span style={{ fontSize: 14 }}>至</span>
                                                        <InputNumber size='small' style={{ marginRight: 5, marginLeft: 5, width: 50 }} />
                                                    </span>
                                                )
                                            }
                                        </Form.Item>

                                    </span>

                                </Form.Item>
                                </span>
                            :  <Form.Item >
                                    <span>
                                        <Form.Item>
                                            {
                                                getFieldDecorator(item.PollutantCode, {})
                                                    (
                                                        <Checkbox.Group>
                                                            <Checkbox value={item.PollutantName}>{item.PollutantName}</Checkbox>
                                                        </Checkbox.Group>
                                                    )
                                            }
                                        </Form.Item>
                                        <Form.Item>
                                            {
                                                getFieldDecorator(item.PollutantCode + 'Value', {})(
                                                    <span>
                                                        <span style={{ fontSize: 14 }}>超标倍数:</span>
                                                        <InputNumber size='small' style={{ width: 50, marginRight: 5 }} />
                                                        <span style={{ fontSize: 14 }}>至</span>
                                                        <InputNumber size='small' style={{ marginRight: 5, marginLeft: 5, width: 50 }} />
                                                    </span>
                                                )
                                            }
                                        </Form.Item>

                                    </span>

                                </Form.Item>
                            )
                        }
                        </div>
                    </Form>

                </div>
            </>
        )
    }
    RegiononChange =(PageIndex, PageSize) => {
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode} = this.state

        this.props.dispatch({
            type:pageUrl.GetExceedDataList,
            payload:{
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: regionCode,
                PollutantList: PollutantList,
                pageSize:pageSize,
                PageIndex:PageIndex
            }
        })
    }
    onChange = (PageIndex, PageSize) => {
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution} = this.state

        this.props.dispatch({
            type:pageUrl.GetExceedDataList,
            payload:{
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: TabType,
                PollutantList: PollutantList,
                pageSize:pageSize,
                PageIndex:PageIndex
            }
        })
    }
    onChangeHandle=(activeKey)=>{
        this.setState({ activeKey });
    }
    onEdit=(targetKey, action)=>{
        this[action](targetKey);
    }
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
        this.setState({ panes, activeKey });
      };

    pageContent = () => {
        const fixed = false
        
        const {ExceedDataList ,loading} = this.props
        const {selectPollution} = this.state

        const columns = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'Region',
                key: 'Region',
                render: (text, record) => {
                    return <a onClick={this.paneAdd.bind(this,record.RegionCode,text)}> {text} </a>
                }
            },
            {
                title: "企业数",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'EntNum',
                key: 'EntNum',
            },
            {
                title: "监测点数",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'PointNum',
                key: 'PointNum',
            },
            {
                title: "数据类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'DataType',
                key: 'DataType',
            },
        ]
        selectPollution.map(item=>{
            let addColumns ={}
            addColumns = {
                title: item.PollutantName,
                align: 'center',
                fixed: fixed,
                children: [
                    {
                        title: "超标企业数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'PollutantData.EntNum-'+item.PollutantCode,
                        key: 'PollutantData.EntNum-'+item.PollutantCode,
                        render: (text,record) => {
                            return <a onClick={this.exEntHandle.bind(this,record.PollutantData['PolCode-'+item.PollutantCode],record.RegionCode)}>{text}</a>
                        }
                    },
                    {
                        title: "超标监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'PollutantData.PointNum-'+item.PollutantCode,
                        key: 'PollutantData.PointNum-'+item.PollutantCode,
                    },
                    {
                        title: "超标次数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'PollutantData.ExceedNum-'+item.PollutantCode,
                        key: 'PollutantData.ExceedNum-'+item.PollutantCode,
                        render: (text,record) => {
                            return <a onClick={this.exCountHandle.bind(this,record.PollutantData['PolCode-'+item.PollutantCode],record.RegionCode,false)}>{text}</a>
                        }
                    },
                    {
                        title: "最大超标倍数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'PollutantData.MaxMultiple-'+item.PollutantCode,
                        key: 'PollutantData.MaxMultiple-'+item.PollutantCode,
                        render: (text) => {
                            return text == null?'-':text
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
            {
                        loading ? <PageLoading /> :
                            <SdlTable columns={columns} dataSource={ExceedDataList}
                            pagination={{
                                showSizeChanger: true,
                                showQuickJumper: true,
                                pageSize: this.props.PageSize,
                                current: this.props.PageIndex,
                                onChange: this.onChange,
                                pageSizeOptions: ['25', '30', '40', '100'],
                                total: this.props.total,
                              }}
                            />
            }
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

    CancelHandel = () => {
        this.setState({
            visible: false,
            visibleMoni: false
        })
    }
    //超标次数弹框
    entExCountHandle = ()=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode,modalPollutantList,enterpriseValue} = this.state

        this.props.dispatch({
            type:pageUrl.GetMoalExceedDataList,
            payload:{
                EntCode:enterpriseValue,
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: regionCode,
                PollutantList: modalPollutantList,
                PageSize:25,
                PageIndex:1
            }
        })
        this.setState({
            visibleEnt:true
        })
    }
    //关闭弹框
    entCancelHandel =()=>{
        this.setState({
            visibleEnt:false
        })
    }
    //企业数查询按钮
    EntButtonCountHandle =()=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode,modalPollutantList,enterpriseValue} = this.state
       
        this.props.dispatch({
            type:pageUrl.GetMoalExceedDataList,
            payload:{
                EntCode:enterpriseValue,
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: regionCode,
                PollutantList: modalPollutantList,
                PageSize:25,
                PageIndex:1
            }
        })
    }
    //企业数查询按钮
    EntButtonCountHandleExpor=()=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode,modalPollutantList,enterpriseValue} = this.state
       console.log(regionCode)
        this.props.dispatch({
            type:pageUrl.ExportExceedDataList,
            payload:{
                EntCode:enterpriseValue,
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: regionCode,
                PollutantList: modalPollutantList,
            }
        })
    }
    //超标次数按钮查询
    ExButtonCountHandle =()=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode,modalPollutantList,enterpriseValue} = this.state
      
        this.props.dispatch({
            type:pageUrl.GetExceedNum,
            payload:{
                EntCode:enterpriseValue,
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: '',
                PollutantList: modalPollutantList,
                PageSize:25,
                PageIndex:1
            }
        })
    }
    ExButtonCountHandleExport =()=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode,modalPollutantList,enterpriseValue} = this.state
        console.log(enterpriseValue)
        this.props.dispatch({
            type:pageUrl.ExportExceedNum,
            payload:{
                EntCode:enterpriseValue,
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: '',
                PollutantList: modalPollutantList,
            }
        })
    }
    EntexportReport =()=>{
        const { panes,RegionCode ,AttentionCode ,PollutantTypeCode,DataType,BeginTime,EndTime,TabType,PollutantList ,selectPollution ,regionCode,modalPollutantList,enterpriseValue} = this.state
        console.log(enterpriseValue)
        this.props.dispatch({
            type:pageUrl.ExportExceedNum,
            payload:{
                EntCode:enterpriseValue,
                RegionCode: RegionCode,
                AttentionCode: AttentionCode,
                PollutantTypeCode: PollutantTypeCode,
                DataType: DataType,
                BeginTime: BeginTime,
                EndTime: EndTime,
                TabType: '',
                PollutantList: modalPollutantList,
            }
        })
    }
    render() {
        const { loading,EntCountList ,loadingEnt,ExceedNumList,loadingCount} = this.props
        const {modalSelectPollution,modalSelectPollution2} = this.state
        const fixed = false
        const columns = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'Region',
                key: 'Region',
            },
            {
                title: "企业名称",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'EntName',
                key: 'EntName',
            },
            {
                title: "监测点数",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'PointNum',
                key: 'PointNum',
            },
            {
                title: "数据类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'DataType',
                key: 'DataType',
            },
        ]

        modalSelectPollution.map(item=>{
            let addColumns ={}
            addColumns = {
                title: item.PollutantName,
                align: 'center',
                fixed: fixed,
                children: [
                    {
                        title: "超标监测点数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'PollutantData.PointNum-'+item.PollutantCode,
                        key: 'PollutantData.PointNum-'+item.PollutantCode,
                    },
                    {
                        title: "超标次数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'PollutantData.ExceedNum-'+item.PollutantCode,
                        key: 'PollutantData.ExceedNum-'+item.PollutantCode,
                        render: (text,record) => {
                            return <a onClick={this.exCountHandle.bind(this,record.PollutantData['PolCode-'+item.PollutantCode],record.RegionCode,true)}>{text}</a>
                        }
                    },
                    {
                        title: "最大超标倍数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'PollutantData.MaxMultiple-'+item.PollutantCode,
                        key: 'PollutantData.MaxMultiple-'+item.PollutantCode,
                        render: (text) => {
                            return text == null?'-':text
                        }
                    },
                ]
            }
            columns.push(addColumns)
        })


        const columns3 = [
            {
                title: "行政区",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'RegionName',
                key: 'RegionName',
            },
            {
                title: "企业名称",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'EntName',
                key: 'EntName',
            },
            {
                title: "监测点名称",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'PointName',
                key: 'PointName',
            },
            {
                title: "数据类型",
                width: 100,
                align: 'center',
                fixed: fixed,
                dataIndex: 'DataType',
                key: 'DataType',
            },
            {
                title: "监测点",
                width: 100,
                align: '监测时间',
                fixed: fixed,
                dataIndex: 'OverTime',
                key: 'OverTime',
            }
        ]

        modalSelectPollution2.map(item=>{
            let addColumns ={}
            addColumns = {
                title: item.PollutantName,
                align: 'center',
                fixed: fixed,
                children: [
                    {
                        title: "监测值",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'MonitorValue',
                        key: 'MonitorValue',
                        render: (text) => {
                            return text == null?'-':text
                        }
                    },
                    {
                        title: "标准值",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'StandValue',
                        key: 'StandValue',
                        render: (text) => {
                            return text == null?'-':text
                        }
                    },
                    {
                        title: "超标倍数",
                        width: 100,
                        align: 'center',
                        fixed: fixed,
                        dataIndex: 'Multiple',
                        key: 'Multiple',
                        render: (text) => {
                            return text == null?'-':text
                        }
                    },
                ]
            }
            columns3.push(addColumns)
        })

        return (
            <>
                <div id="siteParamsPage">
                    <BreadcrumbWrapper title="超标数据查询">
                        <Card
                            title={this.cardTitle()}
                            extra={
                                <>
                                </>
                            }
                            className="contentContainer"
                        >
                            {loading ? <PageLoading /> : this.pageContent()}
                        </Card>
                        <Modal
                            centered
                            title="超标企业数统计"
                            visible={this.state.visible}
                            footer={null}
                            width={800}
                            onCancel={this.CancelHandel}
                        >
                            <div style={{marginBottom:10}}>
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
                                <Button type='primary' style={{marginRight:10}} onClick={this.EntButtonCountHandle}> 查询</Button>
                                <Button onClick={this.EntButtonCountHandleExpor}><Icon type="export" /> 导出</Button>
                            </div>
                            {
                                loadingEnt?<PageLoading/>:<SdlTable columns={columns} dataSource={EntCountList} pagination={false} />
                            }
                            
                            
                        </Modal>
                        <Modal
                            centered
                            title="超标次数统计"
                            visible={this.state.visibleMoni}
                            footer={null}
                            width={800}
                            onCancel={this.CancelHandel}
                        >
                            <div style={{marginBottom:10}}>
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
                                <Button type='primary' style={{marginRight:10}} onClick={this.ExButtonCountHandle}> 查询</Button>
                                <Button onClick={this.ExButtonCountHandleExport}><Icon type="export" /> 导出</Button>
                            </div>
                            {
                                loadingCount?<PageLoading/>:<SdlTable columns={columns3} dataSource={ExceedNumList} pagination={false} />
                            }
                            
                        </Modal>
                        <Modal
                            centered
                            title="企业超标次数统计"
                            visible={this.state.visibleEnt}
                            footer={null}
                            width={800}
                            onCancel={this.entCancelHandel}
                        >
                            <div style={{marginBottom:10}}>
                                <Button onClick={this.EntexportReport}><Icon type="export" /> 导出</Button>
                            </div>
                            <SdlTable columns={columns3} dataSource={ExceedNumList} pagination={false} />
                        </Modal>
                    </BreadcrumbWrapper>
                </div>
            </>
        );
    }
}
const indexx = Form.create()(index)

export default indexx;

