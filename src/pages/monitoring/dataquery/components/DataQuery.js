import React, { Component } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Spin, message, Empty, Radio, Row, Col, Button, Select } from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import ButtonGroup_ from '@/components/ButtonGroup'
import PollutantSelect from '@/components/PollutantSelect'
import SdlTable from '@/components/SdlTable'


const { Option } = Select;
@Form.create()
/**
 * 数据查询组件
 * xpy 2019.07.26
 */
@connect(({ loading, dataquery }) => ({
    pollutantlist: dataquery.pollutantlist,
    dataloading: loading.effects['dataquery/queryhistorydatalist'],
    exportLoading: loading.effects['dataquery/exportHistoryReport'],
    option: dataquery.chartdata,
    selectpoint: dataquery.selectpoint,
    isloading: loading.effects['dataquery/querypollutantlist'],
    columns: dataquery.columns,
    datatable: dataquery.datatable,
    total: dataquery.total,
    tablewidth: dataquery.tablewidth,
    historyparams: dataquery.historyparams,
}))

class DataQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchDataType: 1,
            displayType: 'data',
            displayName: '查看数据',
            rangeDate: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            format: 'YYYY-MM-DD HH:mm:ss',
            selectDisplay: false,
            dd: [],
            selectP: '',
            dgimn: '',
            dateValue: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            dataType: "realtime"
        };
    }

    componentDidMount() {
        this.props.initLoadData && this.changeDgimn(this.props.DGIMN)
    }

    /** dgimn改變時候切換數據源 */
    componentWillReceiveProps = nextProps => {
        if (nextProps.DGIMN !== this.props.DGIMN) {
            this.changeDgimn(nextProps.DGIMN);
        }
    }

    /** 根据排口dgimn获取它下面的所有污染物 */
    getpointpollutants = dgimn => {
        this.props.dispatch({
            type: 'dataquery/querypollutantlist',
            payload: {
                dgimn,
                notLoad: true
            },
            callback: () => {
                this.children.onDataTypeChange(this.state.dataType);
            }
        });
    }

    /** 切换时间 */
    // _handleDateChange = (date, dateString) => {

    //     let { historyparams } = this.props;
    //     switch (historyparams.datatype) {
    //         case 'realtime':
    //             if (date[1].add(-7, 'day') > date[0]) {
    //                 message.info('实时数据时间间隔不能超过7天');
    //                 return;
    //             }
    //             date[1].add(7, 'day')

    //             break;
    //         case 'minute':
    //             if (date[1].add(-1, 'month') > date[0]) {
    //                 message.info('分钟数据时间间隔不能超过1个月');
    //                 return;
    //             }
    //             date[1].add(1, 'month')
    //             break;
    //         case 'hour':
    //             if (date[1].add(-6, 'month') > date[0]) {
    //                 message.info('小时数据时间间隔不能超过6个月');
    //                 return;
    //             }
    //             date[1].add(6, 'month')
    //             break;
    //         case 'day':
    //             if (date[1].add(-12, 'month') > date[0]) {
    //                 message.info('日数据时间间隔不能超过1年');
    //                 return;
    //             }
    //             date[1].add(12, 'month')
    //             break;
    //         default:
    //             return;
    //     }
    //     console.log('date=', date);
    //     this.setState({ rangeDate: date });
    //     historyparams = {
    //         ...historyparams,
    //         beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
    //         endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
    //     }
    //     this.reloaddatalist(historyparams);
    // };

    /** 数据类型切换 */
    // _handleDateTypeChange = e => {
    //     const { rangeDate } = this.state;
    //     let formats;
    //     let beginTime = moment(new Date()).add(-60, 'minutes');
    //     const endTime = moment(new Date());
    //     let { historyparams } = this.props;
    //     switch (e.target.value) {
    //         case 'realtime':
    //             beginTime = moment(new Date()).add(-60, 'minutes');
    //             formats = 'YYYY-MM-DD HH:mm:ss';
    //             break;
    //         case 'minute':
    //             beginTime = moment(new Date()).add(-1, 'day');
    //             formats = 'YYYY-MM-DD HH:mm';
    //             break;
    //         case 'hour':
    //             beginTime = moment(new Date()).add(-1, 'day');
    //             formats = 'YYYY-MM-DD HH';
    //             break;
    //         case 'day':
    //             beginTime = moment(new Date()).add(-1, 'month');
    //             formats = 'YYYY-MM-DD';
    //             break;
    //     }
    //     this.setState({
    //         rangeDate: [beginTime, endTime],
    //         format: formats,
    //     });
    //     historyparams = {
    //         ...historyparams,
    //         beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
    //         endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    //         datatype: e.target.value,
    //     }
    //     this.reloaddatalist(historyparams);
    // }

    /** 数据类型切换 */
    _handleDateTypeChange = (e) => {
        const { historyparams, pollutantlist, dispatch } = this.props;
        const dataType = e.target.value;
        this.setState({ dataType });
        // switch (dataType) {
        //     case "realtime":
        //     case "minute":
        //     case "hour":
        //     case "day":
        //         pollutantlist.map((item)=>{

        //         })

        // }

        dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams,
            },
        })


        this.children.onDataTypeChange(dataType)
    }

    /** 图表转换 */
    displayChange = checked => {
        if (checked !== 'chart') {
            this.setState({
                displayType: 'table',
                displayName: '查看图表',
            });
        } else {
            this.setState({
                displayType: 'chart',
                displayName: '查看数据',
            });
        }
    };

    /** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
    getpollutantSelect = () => {
        const {
            displayType,
            selectP,
        } = this.state;
        const { pollutantlist } = this.props;
        return (<PollutantSelect
            mode="multiple"
            optionDatas={pollutantlist}
            defaultValue={selectP === '' ? this.getpropspollutantcode() : selectP}
            onChange={this.handlePollutantChange}
            placeholder="请选择污染物"
            maxTagCount={1}
            maxTagTextLength={5}
            maxTagPlaceholder="..."
            style={{ width: 200 }}
        />);
    }

    /**切换污染物 */
    handlePollutantChange = (value, selectedOptions) => {
        const res = [];
        let { historyparams, dispatch } = this.props;
        if (selectedOptions.length > 0) {
            selectedOptions.map((item, key) => {
                res.push(item.props.children);
            })
        }
        historyparams = {
            ...historyparams,
            pollutantCodes: value.length > 0 ? value.toString() : '',
            pollutantNames: res.length > 0 ? res.toString() : '',

        }
        this.setState({
            selectP: value.length > 0 ? value : [],
        })

        dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams,
            },
        })
        // this.reloaddatalist(historyparams);
    };

    /** 获取第一个污染物 */
    getpropspollutantcode = () => {
        if (this.props.pollutantlist[0]) {
            return this.props.pollutantlist.map((item) => item.PollutantCode);
        }
        return null;
    }

    /** 后台请求数据 */
    reloaddatalist = historyparams => {
        const {
            dispatch,
        } = this.props;
        historyparams && dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams,
            },
        })
        dispatch({
            type: 'dataquery/queryhistorydatalist',
            payload: {
                searchDataType: this.state.searchDataType,
                Type: this.props.Type
            },
        });
    }

    /** 切换排口 */
    changeDgimn = dgimn => {
        this.setState({
            selectDisplay: true,
            selectP: '',
            dgimn,
        })
        const {
            dispatch,
        } = this.props;
        this.setState({
            searchDataType: 1
        }, () => {
            this.getpointpollutants(dgimn);
        })

        // let { historyparams } = this.props;
        // this.children.onDataTypeChange(this.state.dataType);
        // const { rangeDate, dateValue } = this.state;
        // historyparams = {
        //     ...historyparams,
        //     pollutantCodes: '',
        //     pollutantNames: '',
        //     // beginTime: rangeDate[0].format('YYYY-MM-DD HH:mm:ss'),
        //     // endTime: rangeDate[1].format('YYYY-MM-DD HH:mm:ss'),
        //     beginTime: dateValue[0].format('YYYY-MM-DD HH:mm:ss'),
        //     endTime: dateValue[1].format('YYYY-MM-DD HH:mm:ss'),
        // }
        // dispatch({
        //     type: 'dataquery/updateState',
        //     payload: {
        //         historyparams,
        //     },
        // })
    }


    /** 渲染数据展示 */

    loaddata = () => {
        const { dataloading, option, datatable, columns, chartHeight } = this.props;
        const { displayType } = this.state;
        // if (dataloading) {
        //     return (<Spin
        //         style={{
        //             width: '100%',
        //             height: chartHeight ? chartHeight : 'calc(100vh - 400px)',
        //             display: 'flex',
        //             alignItems: 'center',
        //             justifyContent: 'center',
        //         }}
        //         size="large"
        //     />);
        // }

        if (displayType === 'chart') {
            if (option) {
                return (
                    // <Card.Grid style={{ width: '100%', height: 'calc(100vh - 350px)', overflow: 'auto', ...this.props.style }}>
                    <ReactEcharts
                        theme="light"
                        option={option}
                        lazyUpdate
                        notMerge
                        id="rightLine"
                        style={{ width: '100%', height: chartHeight ? chartHeight : 'calc(100vh - 300px)' }}
                    />
                    // /* </Card.Grid> */
                );
            }

            return (<div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>);
        }
        return (
            // <Card.Grid style={{ width: '100%', height: 'calc(100vh - 350px)', overflow: 'auto', ...this.props.style }}>
            <SdlTable
                rowKey={(record, index) => `complete${index}`}
                dataSource={datatable}
                columns={columns}
                loading={dataloading}
                resizable
                defaultWidth={80}
                scroll={{ y: "calc(100vh - 400px)" || undefined }}
                // pagination={{ pageSize: 20 }}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    defaultPageSize: 20
                }}
            />
            // </Card.Grid>

        );
    }

    exportReport = () => {
        this.props.dispatch({
            type: "dataquery/exportHistoryReport",
            payload: {
                DGIMNs: this.state.dgimn
            }
        })
    }
    /**
     * 回调获取时间(实时、分钟、小时、日)并重新请求数据
     */
    dateCallback = (dates, dataType) => {
        let { historyparams, dispatch } = this.props;
        this.setState({
            dateValue: dates
        })
        historyparams = {
            ...historyparams,
            beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
            datatype: dataType
        }
        dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams,
            },
        })
        this.reloaddatalist(historyparams);
    }
    dateCallbackDataQuery = (dates, dataType) => {
        let { historyparams, dispatch } = this.props;
        this.setState({
            dateValue: dates
        })
        historyparams = {
            ...historyparams,
            beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
            datatype: dataType
        }
        dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams,
            },
        })
    }
    //     /**
    //  * 回调获取时间（月、季度、年）并重新请求数据
    //  */
    //     dateCallbackOther = (dates, dataType) => {
    //         debugger
    //         let { historyparams, dispatch } = this.props;
    //         this.setState({
    //             dateValue: dates
    //         })
    //         historyparams = {
    //             ...historyparams,
    //             beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
    //             endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
    //             datatype: dataType
    //         }
    //         dispatch({
    //             type: 'dataquery/updateState',
    //             payload: {
    //                 historyparams,
    //             },
    //         })
    //     }


    onRef1 = (ref) => {
        this.children = ref;
    }

    render() {
        const { dataType, dateValue, displayType, searchDataType } = this.state;
        const { pointName, entName, pollutantlist, Type, isShowSearchDataType } = this.props;
        let flag = "", mode = [];
        if (pollutantlist && pollutantlist[0]) {
            flag = pollutantlist[0].PollutantType === "5" ? "" : "none";
        }
        switch (dataType) {
            case 'month':
                mode = ['month', 'month'];
                break;
            case 'quarter':
                mode = ['year', 'year'];
                break;
            case 'year':
                mode = ['year', 'year'];
                break;
            default:
                mode = [];
                break;
        }
        return (
            <div>
                <Card
                    // className={!this.props.style ? 'contentContainer' : null}
                    title={
                        <div>
                            <div>
                                {entName + "-" + pointName}
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <Form layout="inline">
                                    <Form.Item style={{ marginRight: 5 }}>
                                        {!this.props.isloading && this.getpollutantSelect()}
                                    </Form.Item>
                                    <Form.Item style={{ marginRight: 5 }}>
                                        {
                                            // mode.length !== 0 ?
                                            <RangePicker_ style={{ width: 360 }} dateValue={dateValue}
                                                dataType={dataType}
                                                format={this.state.format}
                                                onRef={this.onRef1}
                                                isVerification={true}
                                                mode={mode}
                                                dataQuery={true}
                                                // onChange={this._handleDateChange}
                                                callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                                                callbackDataQuery={(dates, dataType) => this.dateCallbackDataQuery(dates, dataType)}
                                                allowClear={false} showTime={this.state.format} />
                                            //     :
                                            // <RangePicker_ style={{ width: 360 }} dateValue={dateValue}
                                            //     dataType={dataType}
                                            //     format={this.state.format}
                                            //     onRef={this.onRef1}
                                            //     isVerification={true}
                                            //     // onChange={this._handleDateChange}
                                            //     callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                                            //     allowClear={false} showTime={this.state.format} />
                                        }
                                    </Form.Item>
                                    {
                                        Type === '5' && isShowSearchDataType && <Form.Item style={{ marginRight: 5 }}>
                                            <Select style={{ width: 100 }} value={searchDataType} onChange={(value) => { this.setState({ searchDataType: value }) }}>
                                                <Option value={1}>原始</Option>
                                                <Option value={2}>审核</Option>
                                            </Select>
                                        </Form.Item>
                                    }
                                    <Form.Item style={{ marginRight: 5 }}>
                                        <Button type="primary" loading={false} onClick={() => { this.reloaddatalist() }} style={{ marginRight: 10 }}>查询</Button>
                                        <Button type="primary" loading={this.props.exportLoading} onClick={() => { this.exportReport(); }}>导出</Button>
                                    </Form.Item>
                                    <Form.Item style={{ marginRight: 5 }}>
                                        <ButtonGroup_ style={{ width: '100%' }} pollutantType={Type} checked={Type == 10 ? 'hour' : "realtime"} showOtherTypes={flag} onChange={this._handleDateTypeChange} />
                                    </Form.Item>
                                    <Form.Item style={{ marginRight: 5 }}>
                                        <Radio.Group style={{ width: '100%' }} defaultValue={displayType} buttonStyle="solid" onChange={e => {
                                            this.displayChange(e.target.value)
                                        }}>
                                            <Radio.Button value="chart">图表</Radio.Button>
                                            <Radio.Button value="data">数据</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>

                    }
                >
                    {this.loaddata()}


                </Card>
            </div >
        );
    }
}
export default DataQuery;
