
/*
 * @desc:出厂测试管理
 * @Author: wjw
 * @Date: 2020年03月27日10:11:59
 */
import React, { Component, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Spin,
    Tooltip,
    Radio,
    Empty,
    Select,
    Modal,
    Tag,
    Divider,
    Dropdown,
    Menu,
    Popconfirm,
    message,
    DatePicker,
    InputNumber,
} from 'antd';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import ButtonGroup_ from '@/components/ButtonGroup'
import PollutantSelect from '@/components/PollutantSelect'
import { PointIcon, DelIcon } from '@/utils/icon'
import MonitorContent from '@/components/MonitorContent';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable/index';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { sdlMessage } from '@/utils/utils';
import html2canvas from 'html2canvas';

var QRCode = require('qrcode.react');
const { confirm } = Modal;

@connect(({ loading, dataquery, point }) => ({
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

export default class factorytest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayType: 'chart',
            displayName: '查看数据',
            rangeDate: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            format: 'YYYY-MM-DD HH:mm:ss',
            selectDisplay: false,
            dd: [],
            selectP: '',
            dgimn: '',
            dateValue: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            dataType: "realtime",
            loadingDL: false,
            qrcodevalue: '',
            isQRCode: false,
            qrdgimn: ''
        };
    }

    componentDidMount() {
        //this.changeDgimn(this.state.dgimn)
    }

    /** dgimn改變時候切換數據源 */
    componentWillReceiveProps = nextProps => {
        // if (nextProps.DGIMN !== this.props.DGIMN) {
        //     this.changeDgimn(nextProps.DGIMN);
        // }
    }

    /** 根据排口dgimn获取它下面的所有污染物 */
    getpointpollutants = dgimn => {
        this.props.dispatch({
            type: 'dataquery/querypollutantlist',
            payload: {
                dgimn,
            },
        });
    }

    /** 数据类型切换 */
    _handleDateTypeChange = (e) => {
        const { historyparams } = this.props;
        const dataType = e.target.value;
        this.setState({ dataType });

        this.children.onDataTypeChange(dataType);
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
            style={{ width: '80%', margin: '5px' }}
            onChange={this.handlePollutantChange}
            placeholder="请选择污染物"
            maxTagCount={2}
            maxTagTextLength={5}
            maxTagPlaceholder="..."
        />);
    }

    /**切换污染物 */
    handlePollutantChange = (value, selectedOptions) => {
        const res = [];
        let { historyparams } = this.props;
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

        this.reloaddatalist(historyparams);
    };

    /** 获取第一个污染物 */
    getpropspollutantcode = () => {
        if (this.props.pollutantlist[0]) {
            return this.props.pollutantlist[0].PollutantCode;
        }
        return null;
    }

    /** 后台请求数据 */
    reloaddatalist = historyparams => {
        const {
            dispatch,
        } = this.props;
        dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams,
            },
        })
        dispatch({
            type: 'dataquery/queryhistorydatalist',
            payload: {},
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
        let { historyparams } = this.props;
        const { rangeDate, dateValue } = this.state;
        historyparams = {
            ...historyparams,
            pollutantCodes: '',
            pollutantNames: '',
            // beginTime: rangeDate[0].format('YYYY-MM-DD HH:mm:ss'),
            // endTime: rangeDate[1].format('YYYY-MM-DD HH:mm:ss'),
            beginTime: dateValue[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: dateValue[1].format('YYYY-MM-DD HH:mm:ss'),
        }
        dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams,
            },
        })
        this.getpointpollutants(dgimn);
    }


    /** 渲染数据展示 */

    loaddata = () => {
        const { dataloading, option, datatable, columns } = this.props;
        const { displayType, dgimn } = this.state;
        if (dataloading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh - 400px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }

        if (displayType === 'chart') {
            if (option) {
                return (<Card style={{ width: '100%', height: 'calc(100vh - 350px)', overflow: 'auto', ...this.props.style }}><ReactEcharts
                    theme="light"
                    option={option}
                    lazyUpdate
                    notMerge
                    id="rightLine"
                    style={{ width: '100%', height: 'calc(100vh - 400px)', padding: 20 }}
                /></Card>);
            }

            return (<div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>);
        }
        return (
            <Card style={{ width: '100%', height: 'calc(100vh - 350px)', overflow: 'auto', ...this.props.style }}>
                <SdlTable
                    rowKey={(record, index) => `complete${index}`}
                    dataSource={datatable}
                    columns={columns}
                    resizable
                    // scroll={{ y: this.props.tableHeight || 'calc(100vh - 550px)' }}
                    Pagination={null}
                />
            </Card>
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
     * 回调获取时间并重新请求数据
     */
    dateCallback = (dates, dataType) => {
        let { historyparams } = this.props;
        this.setState({
            dateValue: dates
        })
        historyparams = {
            ...historyparams,
            beginTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
            datatype: dataType
        }
        this.reloaddatalist(historyparams);
    }

    onRef1 = (ref) => {
        this.children = ref;
    }

    //导出图片
    exportImage = () => {
        this.setState({
            loadingDL: true
        });
        let { dgimn } = this.state;
        const newCanvas = document.createElement("canvas");
        const element = document.querySelector('.qrdiv');
        const dom_width = parseInt(window.getComputedStyle(element).width);
        const dom_height = parseInt(window.getComputedStyle(element).height);
        console.log(dom_width)
        console.log(dom_height)
        //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
        newCanvas.width = dom_width * 2;
        newCanvas.height = dom_height * 2;
        newCanvas.style.width = dom_width + "px";
        newCanvas.style.height = dom_height + "px";
        const context = newCanvas.getContext("2d");
        context.scale(1.8, 1.8);

        html2canvas(element, { canvas: newCanvas }).then((canvas) => {
            const imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url
            const base64ToBlob = (code) => {
                let parts = code.split(';base64,');
                let contentType = parts[0].split(':')[1];
                let raw = window.atob(parts[1]);
                let rawLength = raw.length;

                let uInt8Array = new Uint8Array(rawLength);

                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }
                return new Blob([uInt8Array], { type: contentType });
            };
            const blob = base64ToBlob(imgUri);
            // window.location.href = imgUri; // 下载图片
            // 利用createObjectURL，模拟文件下载
            const fileName = `${dgimn}.png`;
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                const blobURL = window.URL.createObjectURL(blob)
                const vlink = document.createElement('a');
                vlink.style.display = 'none';
                vlink.href = blobURL;
                vlink.setAttribute('download', fileName);

                if (typeof vlink.download === 'undefined') {
                    vlink.setAttribute('target', '_blank');
                }

                document.body.appendChild(vlink);

                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", false, false);
                vlink.dispatchEvent(evt);

                document.body.removeChild(vlink);
                window.URL.revokeObjectURL(blobURL);
            }
        });
        this.setState({
            loadingDL: false
        });
    }


    onSubmitForm = (values) => {
        let { dgimn } = this.state;
        let that = this;
        if (dgimn) {
            that.setState({
                isQRCode: true,
                qrdgimn: dgimn,
                qrcodevalue: `https://api.chsdl.net/wxwryapi/flag=sdl,mn=${dgimn}`
            });
            //debugger;
            that.props.dispatch({
                type: "point/factoryTest",
                payload: {
                    DGIMN: dgimn,
                    callback: function (res) {
                        if (res) {
                            that.changeDgimn(dgimn)
                        }
                    }
                }
            })
        } else {
            that.setState({
                isQRCode: false,
                qrdgimn: '',
                qrcodevalue: ``
            });
            //that.changeDgimn(dgimn)
        }
    }
    onChangeDGIMN = (e) => {
        //console.log("e=", e.target.value);
        this.setState({
            dgimn: e.target.value
        });
        //isQRCode
    }
    render() {
        const { dataType, dateValue, dgimn, loadingDL, qrcodevalue, isQRCode, qrdgimn } = this.state;

        return (
            <PageHeaderWrapper>
                <div className="contentContainer">
                    <Row gutter={16} style={{ marginLeft: 0, marginRight: 0 }}>
                        <Col span={6}>
                            <Card title="操作">
                                <Form
                                    layout={'inline'}
                                >

                                    <Form.Item
                                        label="MN号"
                                        name="DGIMN"
                                        rules={[{ required: true, message: '请输入MN号' }]}
                                    >
                                        <Input placeholder="请输入MN号" value={dgimn} onChange={this.onChangeDGIMN} />
                                    </Form.Item>


                                    <Form.Item>
                                        <Button type="primary" onClick={this.onSubmitForm}> 生成</Button>
                                    </Form.Item>
                                </Form>
                                <Divider></Divider>
                                <div>
                                    {isQRCode ? <div>
                                        <div className="qrdiv" style={{ textAlign: 'center' }}>
                                            <div id='qr'>
                                                <QRCode
                                                    value={qrcodevalue}
                                                    size={200}
                                                    imageSettings={{ src: '/upload/gg.png', height: 20, width: 20, excavate: true }}
                                                />
                                            </div>
                                            <div id='mn' style={{ width: 200, textAlign: 'center', margin: '0 auto' }}>
                                                <span style={{ wordWrap: 'break-word' }}>
                                                    {qrdgimn}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <Button type="primary" style={{ width: 200 }} onClick={this.exportImage} loading={loadingDL}>下载</Button>
                                        </div>
                                    </div> : <div></div>}
                                </div>

                            </Card>
                        </Col>
                        <Col span={18}>
                            <Card title="数据查询" bordered={true}>
                                <div>
                                    <Row>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={7}>
                                            {!this.props.isloading && this.getpollutantSelect()}
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={7}>
                                            <RangePicker_ style={{ width: '90%', marginRight: '5px', textAlign: 'left' }} dateValue={dateValue}
                                                dataType={dataType}
                                                format={this.state.format}
                                                onRef={this.onRef1}
                                                isVerification={true}
                                                // onChange={this._handleDateChange} 
                                                callback={(dates, dataType) => this.dateCallback(dates, dataType)}
                                                allowClear={false} showTime={this.state.format} />
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={18} xxl={5}>
                                            <ButtonGroup_ style={{ width: '100%', marginRight: '5px' }} checked="realtime" onChange={this._handleDateTypeChange} />
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={5}>
                                            <Radio.Group style={{ width: '100%', marginRight: '5px' }} defaultValue="chart" buttonStyle="solid" onChange={e => {
                                                this.displayChange(e.target.value)
                                            }}>
                                                <Radio.Button value="chart">图表</Radio.Button>
                                                <Radio.Button value="data">数据</Radio.Button>
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                </div>
                                {this.loaddata()}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </PageHeaderWrapper>
        );
    }
}
