/*
 * @Author: lzp
 * @Date: 2019-07-16 09:58:36
 * @LastEditors: lzp
 * @LastEditTime: 2019-07-16 09:58:36
 * @Description: 数据一览
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import InfiniteScroll from 'react-infinite-scroller';
import {
    Table,
    Radio,
    Card,
    TimePicker,
    Icon,
    Button,
    Spin,
    Popover,
    Badge,
    Divider,
    Popconfirm,
    Input,
    List
} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import AListRadio from '@/components/overView/aListRadio';
import PdButton from '@/components/overView/pdButton';
import { getPointStatusImg } from '@/utils/getStatusImg';
import { formatPollutantPopover } from '@/utils/utils';
import { onlyOneEnt } from '@/config';
import Link from 'umi/link';
import SelectPollutantType from '@/components/SelectPollutantType'
import { LegendIcon } from '@/utils/icon';
import style from '../mapview/styles.less'
import { airLevel } from './tools'

const RadioGroup = Radio.Group;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
@connect(({ loading, overview, global, common }) => ({
    columnsdata: overview.columns,
    data: overview.data,
    gwidth: overview.gwidth,
    isloading: loading.effects['overview/querypollutanttypecode'],
    timeLoading: loading.effects['overview/querydatalist'],
    // pollutantTypelist: overview.pollutantTypelist,
    selectpollutantTypeCode: overview.selectpollutantTypeCode,
    dataOverview: overview.dataOverview,
    configInfo: global.configInfo,
    defaultPollutantCode: common.defaultPollutantCode,
    noticeList: global.notices
}))
class dataList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            hasMore: true
        };
    }
    /**页面初始化 */
    componentDidMount() {
        const { dispatch, dataOverview, defaultPollutantCode } = this.props;
        // // 由于数据一览没有全部，初始化为废气
        // !!!this.props.selectpollutantTypeCode &&
        //     dispatch({
        //         type: 'overview/updateState',
        //         payload: {
        //             selectpollutantTypeCode: defaultPollutantCode,
        //         },
        //     });
        // dispatch({
        //     type: 'overview/querypollutanttypecode',
        //     payload: {
        //         selectpollutantTypeCode:this.props.defaultPollutantCode
        //     },
        // });
        dispatch({
            type: 'overview/init',
            payload: {
                callback: res => {
                    dispatch({
                        type: 'overview/updateState',
                        payload: {
                            //更新条件变量
                            selectpollutantTypeCode: this.props.defaultPollutantCode,
                        },
                    });
                    dispatch({
                        type: 'overview/querypollutanttypecode',
                        payload: {},
                    });
                    this.reloadData(dataOverview)
                }
            },
        });

    }
    /**加载数据 */
    reloadData = dataOverview => {
        const { dispatch } = this.props;
        dispatch({
            type: 'overview/updateState',
            payload: {
                //更新条件变量
                dataOverview: dataOverview,
            },
        });
        dispatch({
            type: 'overview/querydatalist',
            payload: {},
        });
    };

    /**刷新页面 */
    Refresh = () => {
        const { dataOverview } = this.props;
        this.reloadData(dataOverview);
    };

    /**时间框更改 */
    pickerChange = (time, timeString) => {
        if (time) {
            let { dataOverview } = this.props;
            dataOverview.time = time;
            this.reloadData(dataOverview);
        }
    };

    /**状态更改 */
    statusChange = value => {
        let { dataOverview } = this.props;
        if (value === dataOverview.selectStatus) {
            dataOverview.selectStatus = null;
        } else {
            dataOverview.selectStatus = value;
        }
        this.reloadData(dataOverview);
    };
    /**传输有效率不足搜索 */
    terateSearch = () => {
        let { dataOverview } = this.props;
        if (dataOverview.terate) {
            dataOverview.terate = null;
        } else {
            dataOverview.terate = 1;
        }
        this.reloadData(dataOverview);
    };

    // /**填充污染物类型 */
    // getPollutantDoc = () => {
    //     const { pollutantTypelist } = this.props;
    //     let res = [];
    //     if (pollutantTypelist) {
    //         pollutantTypelist.map((item, key) => {
    //             res.push(
    //                 <Radio.Button key={key} value={item.pollutantTypeCode}>
    //                     {item.pollutantTypeName}
    //                 </Radio.Button>,
    //             );
    //         });
    //     }
    //     return res;
    // };

    /**获取传输有效率的图例（废水没有传输有效率） */
    getcsyxlButton = () => {
        const { terate } = this.props.dataOverview;
        const { selectpollutantTypeCode } = this.props;
        if (selectpollutantTypeCode == 2) {
            return (
                <span
                    onClick={this.terateSearch}
                    className={terate ? styles.selectStatus : styles.statusButton}
                    style={{ marginRight: 20 }}
                >
                    <span style={{ fontSize: 16, color: '#ffca00' }}>■</span> 传输有效率不达标
        </span>
            );
        }
        return '';
    };

    /**污染物类型选择 */
    onPollutantChange = e => {
        this.setState({
            pollutantCode: e.target.value
        })
        const { dispatch } = this.props;
        const dataOverview = {
            selectStatus: null,
            time: moment(new Date()).add(-1, 'hour'),
            terate: null,
            pointName: null,

        };
        dispatch({
            type: 'overview/updateState',
            payload: {
                //更新条件变量
                dataOverview: dataOverview,
                selectpollutantTypeCode: e.target.value,
            },
        });
        dispatch({
            type: 'overview/querypollutanttypecode',
            payload: {},
        });
        this.reloadData(dataOverview);
    };
    // /**获取详情按钮 */
    // gerpointButton = (record) => (<div>
    //     <li style={{marginBottom:5}}><Button onClick={() => {
    //         this.toHomePage(record)
    //     }}
    //     ><Icon type="fund" style={{ color: '#3C9FDA', marginRight: 5 }} />
    //         企业看板
    //         </Button>
    //     </li>
    //     <li style={{ listStyle: 'none', marginBottom: 5 }}>
    //         <Button onClick={() => {
    //             let viewtype = 'datalistview';
    //             this.props.dispatch(routerRedux.push(`/pointdetail/${record.DGIMN}/${viewtype}`));

    //         }}
    //         ><Icon type="book" style={{ color: '#3C9FDA', marginRight: 5 }} /> 进入站房
    //         </Button>
    //     </li>
    //     <li style={{marginBottom:5}}><Button onClick={() => {
    //         this.toworkbenchmodel(record)
    //     }}
    //     ><Icon type="bar-chart" style={{ color: '#3C9FDA', marginRight: 5 }} />
    //         {/* theme="filled" */}
    //         工作台
    //         </Button>
    //     </li>
    //     <PdButton DGIMN={record.DGIMN} id={record.operationUserID} pname={record.pointName} reloadData={() => this.Refresh()}
    //         exist={record.existTask} pollutantTypeCode={record.pollutantTypeCode} name={record.operationUserName} tel={record.operationtel} viewType="datalist" />
    // </div>)

    entOnSearch = value => {
        let { dataOverview } = this.props;
        dataOverview.entName = value;
        this.reloadData(dataOverview);
    };
    //跳转到首页
    toHomePage = selectent => {
        const { dispatch } = this.props;
        dispatch({
            type: 'homepage/updateState',
            payload: {
                entCode: selectent.entCode,
            },
        });
        this.props.dispatch(routerRedux.push(`/homepage`));
    };
    //跳转到工作台
    toworkbenchmodel = record => {
        const { dispatch } = this.props;
        dispatch({
            type: 'workbenchmodel/updateState',
            payload: {
                entCode: record.entCode,
            },
        });
        this.props.dispatch(routerRedux.push(`/workbench`));
    };

    renderEntSearch = () => {
        if (onlyOneEnt) {
            return '';
        }
        return (
            <Input.Search
                style={{ width: 300, marginRight: 50 }}
                onSearch={this.entOnSearch}
                placeholder="请输入关键字查询"
            />
        );
    };

    // //瀑布流加载
    // handleInfiniteOnLoad = () => {
    //     console.log('666---')
    //     // let { data } = this.state;
    //     // this.setState({
    //     //   loading: true,
    //     // });
    //     // if (data.length > 14) {
    //     //   message.warning('Infinite List loaded all');
    //     //   this.setState({
    //     //     hasMore: false,
    //     //     loading: false,
    //     //   });
    //     //   return;
    //     // }
    //     // this.fetchData(res => {
    //     //   data = data.concat(res.results);
    //     //   this.setState({
    //     //     data,
    //     //     loading: false,
    //     //   });
    //     // });
    //   };


    render() {
        const { selectStatus, terate, time } = this.props.dataOverview;
        const { pollutantCode } = this.state;
        let { selectpollutantTypeCode } = this.props;
        // selectpollutantTypeCode = parseInt(selectpollutantTypeCode);
        const coldata = this.props.columnsdata;
        let { gwidth } = this.props;

        let fixed = false;
        if (coldata && coldata[0] && coldata.length > 4) {
            fixed = true;
        }

        let statusFilters = [
            {
                text: <span><LegendIcon style={{ color: "#34c066" }} />正常</span>,
                value: 1,
            },
            {
                text: <span><LegendIcon style={{ color: "#f04d4d" }} />超标</span>,
                value: 2,
            },
            {
                text: <span><LegendIcon style={{ color: "#999999" }} />离线</span>,
                value: 0,
            },
            {
                text: <span><LegendIcon style={{ color: "#e94" }} />异常</span>,
                value: 3,
            },
        ]

        // 大气站状态筛选
        if (this.state.pollutantCode === 5) {
            statusFilters = airLevel.map(item => {
                return {
                    text: <span><LegendIcon style={{ color: item.color }} />{item.text}</span>,
                    value: item.status,
                }
            })
            statusFilters.unshift({
                text: <span><LegendIcon style={{ color: "#999999" }} />离线</span>,
                value: 0,
            })
        }

        if (pollutantCode == 5) {

        }


        let columns = [
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 80,
                align: 'center',
                fixed: fixed,
                filters: statusFilters,
                onFilter: (value, record) => record.status === value,
                render: (value, record, index) => {
                    return getPointStatusImg(record, this.props.noticeList);
                },
            }, {
                title: '监测点',
                dataIndex: 'pointName',
                key: 'pointName',
                width: 160,
                fixed: fixed,
                render: (value, record, index) => {
                    // const content = this.gerpointButton(record);
                    let lable = [];
                    return (
                        //   <Popover >
                        <span style={{ cursor: 'pointer' }}>
                            {/* {record.abbreviation} - {value} */}
                            {value}
                        </span>
                        //   </Popover>
                    );
                },
            }, {
                title: '监测时间',
                width: 150,
                dataIndex: 'MonitorTime',
                key: 'MonitorTime',
                fixed: fixed,
            }
        ];
        // if (!onlyOneEnt) {
        //     columns = columns.concat({
        //         title: '监控目标',
        //         dataIndex: 'entName',
        //         key: 'entName',
        //         width: 300,
        //         fixed: fixed,
        //         render: (value, record, index) => {
        //             return <span>{value}</span>;
        //         },
        //     });
        // }
        let csyxl = 0;
        // if (selectpollutantTypeCode == 2) {
        //   csyxl = 140;
        // columns = columns.concat(
        //     {
        //         title: '传输有效率',
        //         dataIndex: 'transmissionEffectiveRate',
        //         key: 'transmissionEffectiveRate',
        //         width: 140,
        //         fixed: fixed,
        //         align: 'center',
        //         render: (value, record, index) => ({
        //             props: {
        //                 className: value && value.split('%')[0] < 90 ? styles.red : '',
        //             },
        //             children: value || '-'
        //         })
        //     });
        // }

        let colwidth = 200;
        const scroll = document.body.scrollWidth - 40;
        if (gwidth < scroll && coldata[0]) {
            gwidth = scroll;
            let oneent = 600;
            if (onlyOneEnt) {
                oneent = 300;
            }
            colwidth = (scroll - (oneent + csyxl + 70)) / coldata.length;
        }

        const res = coldata[0]
            ? coldata.map((item, key) => {
                columns = columns.concat({
                    title: item.title,
                    dataIndex: item.field,
                    key: item.field,
                    align: 'center',
                    width: colwidth,
                    render: (text, record, index) => {
                        if (record.stop) {
                            return '停运';
                        }
                        if (item.field === "AQI") {
                            const colorObj = airLevel.find(itm => itm.value == record.AirLevel) || {};
                            const color = colorObj.color;
                            return <Popover content={
                                <div>
                                    <div style={{ marginBottom: 10 }}>
                                        <span style={{ fontWeight: 'Bold', fontSize: 16 }}>空气质量：<span style={{ color: color }}>{record.AirQuality}</span></span>
                                    </div>
                                    <li style={{ listStyle: 'none', marginBottom: 10 }}>
                                        <Badge color={color} text={`首要污染物：${record.PrimaryPollutant}`} />
                                    </li>
                                    <li style={{ listStyle: 'none', marginBottom: 10 }}>
                                        <Badge color={color} text={`污染级别：${record.AirLevel}级`} />
                                    </li>
                                </div>
                            } trigger="hover">
                                <span style={{ color: color }}>{text ? text : "-"}</span>
                            </Popover>
                        }
                        if (record[item.field + "_Value"]) {
                            // const color = record[item.field + "_LevelColor"];
                            const level = record[item.field + "_Level"].replace("级", "");
                            const airLevelObj = airLevel.find(itm => itm.value == level) || {};
                            const airQuality = airLevelObj.text;
                            const color = airLevelObj.color;
                            return <Popover content={
                                <div>
                                    <div style={{ marginBottom: 10 }}>
                                        <span style={{ fontWeight: 'Bold', fontSize: 16 }}>空气质量：<span style={{ color: color }}>{airQuality}</span></span>
                                    </div>
                                    <li style={{ listStyle: 'none', marginBottom: 10 }}>
                                        <Badge color={color} text={`污染级别：${record[item.field + "_Level"]}级`} />
                                    </li>
                                    <li style={{ listStyle: 'none', marginBottom: 10 }}>
                                        <Badge color={color} text={`IAQI：${record[item.field + "_Value"]}`} />
                                    </li>
                                </div>
                            } trigger="hover">
                                <span style={{ color: color }}>{text}</span>
                            </Popover>
                        }
                        return formatPollutantPopover(text, record[`${item.field}_params`]);
                    },
                });
            })
            : [];
        // if (this.props.isloading) {
        //   return (
        //     <Spin
        //       style={{
        //         width: '100%',
        //         height: 'calc(100vh/2)',
        //         display: 'flex',
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //       }}
        //       size="large"
        //     />
        //   );
        // }
        let scrollXWidth = columns.map(col => col.width).reduce((prev, curr) => prev + curr, 0);

        return (
            <BreadcrumbWrapper>
                <div style={{ width: '100%', height: 'calc(100vh - 40px - 100px - 60px)', marginTop: 20 }} className={styles.standardList}>
                    <Card
                        bordered={false}
                        className={styles.cardextra}
                        bodyStyle={{
                            padding: '0px 20px',
                        }}
                        extra={
                            <div>
                                <TimePicker
                                    onChange={this.pickerChange}
                                    style={{ width: 150, marginRight: 20, float: 'left' }}
                                    defaultValue={time}
                                    format="HH:00:00"
                                />

                                {/* <Radio.Group
                                    style={{ marginLeft: 50, float: 'left' }}
                                    onChange={this.onPollutantChange}
                                    defaultValue={selectpollutantTypeCode}
                                >
                                    {this.getPollutantDoc()}
                                </Radio.Group> */}
                                <SelectPollutantType
                                    style={{ marginLeft: 50, float: 'left' }}
                                    showType="radio"
                                    onChange={this.onPollutantChange}
                                    defaultValue={selectpollutantTypeCode}
                                />

                                <div style={{ width: 'calc(100vw - 220px)', marginLeft: 60 }}>
                                    <AListRadio style={{ float: 'right' }} dvalue="b" />
                                    <div style={{ float: 'right', marginTop: 3 }}>
                                        {this.renderEntSearch()}
                                        {/* {this.getcsyxlButton()} */}
                                        {/* <span onClick={() => this.statusChange(1)} className={selectStatus === 1 ? styles.selectStatus : styles.statusButton}><img className={styles.statusButtonImg} src="../../../gisnormal.png" />正常</span>
                                    <span onClick={() => this.statusChange(2)} className={selectStatus === 2 ? styles.selectStatus : styles.statusButton}><img className={styles.statusButtonImg} src="../../../gisover.png" />超标</span>
                                    <span onClick={() => this.statusChange(0)} className={selectStatus === 0 ? styles.selectStatus : styles.statusButton}><img className={styles.statusButtonImg} src="../../../gisunline.png" />离线</span>
                                    <span onClick={() => this.statusChange(3)} className={selectStatus === 3 ? styles.selectStatus : styles.statusButton}><img className={styles.statusButtonImg} src="../../../gisexception.png" />异常</span> */}
                                    </div>
                                </div>
                            </div>
                        }
                    >

                        <Table
                            rowKey={(record, index) => `complete${index}`}
                            style={{
                                marginTop: 20,
                                paddingBottom: 10
                            }}
                            // className={styles.tableCss}
                            columns={columns}
                            size="middle"
                            dataSource={this.props.data}
                            pagination={false}
                            loading={this.props.isloading || this.props.timeLoading}
                            scroll={{ x: scrollXWidth, y: 'calc(100vh - 65px - 100px - 180px)' }}
                            bordered={true}
                        />
                    </Card>
                </div>
            </BreadcrumbWrapper>
        );
    }
}
export default dataList;
