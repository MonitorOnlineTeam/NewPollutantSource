/**
 * 功  能：异常买模型识别 模型库管理  排放特征学习
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Tabs, Descriptions, Form, Typography, Badge, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ReactEcharts from 'echarts-for-react';
import { PollutantListConst } from '@/pages/AbnormalIdentifyModel/CONST';
const { Option } = Select;

const namespace = 'ModelBaseManage'


const dvaPropsData = ({ loading, ModelBaseManage, global, }) => ({
    tableLoading: loading.effects[`${namespace}/GetProjectLogsInfoList`],
    configInfo: global.configInfo,
    exportLoading: loading.effects[`${namespace}/ExportCarList`],
})


const Index = (props) => {



    const [form] = Form.useForm();





    const { tableLoading, } = props;

    const [dataSource, setDataSource] = useState([
        { aa: '工况', bb: '102条', cc: '0条' },
        { aa: '陡变', bb: '102条', cc: '0条' },
        { aa: '振幅', bb: '102条', cc: '0条' },
        { aa: '振动范围', bb: '102条', cc: '0条' },
    ])
    const [chartData, setChartData] = useState([]);
    const [echarts1, setEcharts1] = useState();
    const [echarts2, setEcharts2] = useState();

    useEffect(() => {
        getPageData({ pollutantCode: PollutantListConst[0]?.PollutantCode ? [PollutantListConst[0]?.PollutantCode] : [] });

    }, []);
    // 获取页面数据
    const getPageData = (par) => {
        props.dispatch({
            type: 'AbnormalIdentifyModel/StatisNormalRange',
            payload: { entCode: [], ...par },
            callback: res => {
                // 创建一个空数组用于存储处理后的数据
                let processedData = [];
                // 遍历PollutantListConst数组
                for (let i = 0; i < PollutantListConst.length; i++) {
                    // 创建一个空对象用于存储处理后的数据
                    let data = {
                        PollutantName: PollutantListConst[i].PollutantName,
                        PollutantCode: PollutantListConst[i].PollutantCode,
                        LowerData: [],
                        diffData: [],
                        xData: [],
                        Datas: [],
                    };

                    // 遍历
                    for (let j = 0; j < res.length; j++) {
                        // 如果PollutantCode匹配，则将数据添加到对应的数组中
                        if (res[j].PollutantCode === PollutantListConst[i].PollutantCode) {
                            data.LowerData.push(res[j].LowerLimit);
                            data.diffData.push(res[j].InterRange);
                            data.Datas.push(res[j]);
                            data.xData.push(j);
                        }
                    }

                    // 将处理后的数据添加到processedData数组中
                    processedData.push(data);
                }
                console.log(processedData, 111111)
                setChartData(processedData);
            },
        });
    };
    const columns = [
        {
            title: '项目',
            dataIndex: 'aa',
            key: 'aa',
            align: 'center',
            width: 140,
            ellipsis: true,
        },
        {
            title: '处理成功',
            dataIndex: 'bb',
            key: 'bb',
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '处理失败',
            dataIndex: 'cc',
            key: 'cc',
            align: 'center',
            width: 120,
            ellipsis: true,
            render: (text, record) => {
                return text > 0 ? <span className='red' >{text}</span> : text
            }
        },
        {
            title: '操作',
            align: 'center',
            ellipsis: true,
            width: 120,
            render: (text, record) => {
                return <a>查看日志</a>
            }
        },
    ];




    const TitleComponents = ({ title }) => {
        return <div style={{ display: 'inline-block', fontSize: 18, fontWeight: 'bold', padding: '0 12px 12px 0' }}>{title}</div>
    }
    const getOption = (data) => {
        let echarts = echarts2,
            colors = ['#5abffc', '#58cdfd', 'rgba(36,220,247,.4)'];
        let dataValue = data;
        if (echarts)
            return {
                title: {
                    text: `{v|${dataValue}}{unit|%}`,
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        rich: {
                            v: { fontSize: 22, fontWeight: 'bold', color: colors[1] },
                            unit: { fontSize: 22, fontWeight: 'bold', color: colors[1] },
                        },
                    },
                },
                series: [
                    /** 内心圆 */
                    {
                        //内圆
                        type: 'pie',
                        radius: ['64%', '0%'],
                        center: ['50%', '50%'],
                        z: 1,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.RadialGradient(
                                    0.5,
                                    0.5,
                                    0.5,
                                    [
                                        {
                                            offset: 0,
                                            color: 'transparent',
                                        },
                                        {
                                            offset: 0.5,
                                            color: 'transparent',
                                        },
                                        {
                                            offset: 1,
                                            color: 'transparent',
                                        },
                                    ],
                                    false,
                                ),
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        },
                        hoverAnimation: false,
                        label: {
                            show: false,
                        },
                        tooltip: {
                            show: false,
                        },
                        data: [100],
                        animationType: 'scale',
                    },
                    /** 饼图 */
                    {
                        name: '已完成',
                        type: 'pie',
                        startAngle: 90,
                        z: 0,
                        label: {
                            position: 'center',
                        },
                        radius: ['64%', '52%'],
                        silent: true,
                        animation: false, // 关闭饼图动画
                        data: [
                            {
                                value: dataValue,
                                itemStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0.2,
                                        x2: 1,
                                        y2: 0,
                                        colorStops: [
                                            { offset: 0, color: colors[0] },
                                            { offset: 1, color: colors[1] },
                                        ],
                                    },
                                },
                            },
                            {
                                name: '未完成',
                                value: 100 - dataValue,
                                label: { show: false },
                                itemStyle: { color: '#f0f2f5' },
                            },
                        ],
                    },
                    /** 饼图上刻度 */
                    {
                        type: 'gauge',
                        center: ['50%', '50%'],
                        // radius: ['56%', '44%'],
                        radius: '86%', // 错位调整此处

                        startAngle: 0,
                        endAngle: 360,
                        splitNumber: 16,
                        axisLine: { show: false },
                        splitLine: {
                            length: 106,
                            // length: '24%',
                            lineStyle: {
                                width: 3,
                                color: '#fff',
                            },
                        },
                        axisTick: { show: false },
                        axisLabel: { show: false },
                    },
                    {
                        type: 'pie',
                        name: '内层细圆环',
                        radius: ['70%', '72%'],
                        hoverAnimation: false,
                        clockWise: false,
                        itemStyle: {
                            normal: {
                                color: colors[2],
                            },
                        },
                        label: {
                            show: false,
                        },
                        data: [100],
                    },
                ],
            };

        return {};
    };
    // const getOption2 = (title) => {
    //     const grid = {
    //         left: 100,
    //         right: 0,
    //         bottom: 20,
    //         top: 10,
    //         // containLabel: true
    //     }
    //     if (title === '波动范围') {
    //         return {
    //             grid: {
    //                ...grid,
    //             },
    //             xAxis: {
    //               type: 'category',
    //               data: ["谷神生物科技集团有限公司_谷神生物",
    //           "衡阳永清环保能源有限公司_1#废气放排口",
    //           "衡阳永清环保能源有限公司_2#废气放排口",
    //           "衡阳永清环保能源有限公司_3#废气放排口",
    //           "湖南惠明环保科技有限公司_1#废气放排口",
    //           "湖南惠明环保科技有限公司_2#废气放排口",
    //           "湖南惠明环保科技有限公司_3#废气放排口",
    //           "湖南省锐驰环保科技有限公司_2#废气总排口",
    //           "桂阳县兴达环保金属回收加工有限公司_废气总排口",
    //           "祁阳凯迪绿色能源开发有限公司_总排口",
    //           "贵州黄平尖峰水泥有限公司_窑尾排口",
    //           "国电长源汉川第一发电有限公司_1#脱硫净烟气",
    //           "沈阳经济技术开发区热电有限公司_经开热电1#2#3#4#炉总出口",
    //           "沈阳经济技术开发区热电有限公司_经开热电5#气炉出口",
    //           "中石化大港分公司热电部_6#脱硫出口（超低总排口）",
    //           "中石化大港分公司热电部_7#脱硫出口（超低总排口）",
    //           "中石化大港分公司热电部_8#脱硫出口（超低总排口）",
    //           "中石化大港分公司热电部_9#脱硫出口（超低总排口）",
    //           "中石化大港分公司热电部_10#脱硫出口（超低总排口）",
    //           "天津金隅振兴环保科技有限公司_2#窑尾",
    //           "邯钢集团邯宝钢铁有限公司_2#360烧结机头脱硫脱硝废气排放口",
    //           "河北新金钢铁有限公司_3#1080m³高炉出铁除尘",
    //           "河北新金钢铁有限公司_3#1080m³高炉供料除尘",
    //           "河北新金钢铁有限公司_2*120T转炉二次除尘",
    //           "河北新金钢铁有限公司_2#200m³烧结机机尾除尘",
    //           "河北新金钢铁有限公司_白灰炉脱硝出口",
    //           "河北新金钢铁有限公司_卷板2#加热炉空烟排口",
    //           "河北新金钢铁有限公司_东区高炉原料地沟中转除尘",
    //           "河北新金钢铁有限公司_2×120T炼钢转炉三次除尘排口",
    //           "河北新金钢铁有限公司_卷板2#加热炉煤烟排口",
    //           "华新水泥（赤壁）有限公司_窑尾排放口",
    //           "华润电力湖北有限公司_1#废气排放口",
    //           "华润电力湖北有限公司_3#废气排放口",
    //           "崇阳昌华实业有限公司_窑尾排放口",
    //           "华润电力湖北有限公司_2#废气排放口",
    //           "国电长源汉川第一发电有限公司_3#脱硫净烟气",
    //           "湖北华电西塞山发电有限公司_2号机组",
    //           "湖北华电西塞山发电有限公司_1号机组",
    //           "国电长源汉川第一发电有限公司_4#脱硫净烟气",
    //           "国电长源汉川第一发电有限公司_2#脱硫净烟气",
    //           "湖北大展钢铁有限公司_废气排口",
    //           "湖州未知企业67_4#排放口",
    //           "湖州未知企业65_排放口",
    //           "湖州未知企业75_排放口",
    //           "湖州未知企业73_排放口",
    //           "湖州未知企业85_排放口",
    //           "湖州未知企业34_1#排放口",
    //           "湖州未知企业58_6#排放口",
    //           "湖州未知企业77_排放口",
    //           "湖州未知企业53_2#排放口",
    //           "湖州未知企业37_排放口",
    //           "湖州未知企业74_1#排放口",
    //           "湖州未知企业56_排放口",
    //           "大唐淮北发电厂_1#脱硫出口",
    //           "大唐淮北发电厂_2#脱硫出口",
    //           "安徽金冠玻璃有限责任公司_总排口",
    //           "临涣焦化股份有限公司_焦炉2#烟囱(DA008)",
    //           "临涣焦化股份有限公司_焦炉3#烟囱(DA012)",
    //           "临涣焦化股份有限公司_焦炉4#烟囱(DA016)",
    //           "临涣焦化股份有限公司_3#加煤除尘(DA014)",
    //           "临涣焦化股份有限公司_4#加煤除尘(DA018)",
    //           "临涣焦化股份有限公司_3#推焦除尘(DA013)",
    //           "临涣焦化股份有限公司_1#推焦排口",
    //           "临涣焦化股份有限公司_1#加煤排口",
    //           "临涣焦化股份有限公司_2#加煤排口",
    //           "临涣焦化股份有限公司_2#推焦排口",
    //           "临涣焦化股份有限公司_干熄焦3#排口",
    //           "临涣焦化股份有限公司_干熄焦4#排口",
    //           "临涣焦化股份有限公司_干熄焦1#排口",
    //           "临涣焦化股份有限公司_干熄焦2#排口",
    //           "临涣焦化股份有限公司_1#机侧除尘",
    //           "临涣焦化股份有限公司_2#机侧除尘",
    //           "临涣焦化股份有限公司_5#加煤除尘",
    //           "临涣焦化股份有限公司_5#推焦除尘",
    //           "淮北申皖发电有限公司_1#脱硫出口",
    //           "淮北申皖发电有限公司_2#脱硫出口",
    //           "上海电气（淮北）生物质热电有限公司_1#脱硫排口",
    //           "上海电气（淮北）生物质热电有限公司_2#脱硫排口",
    //           "淮北申能发电有限公司_脱硫出口",
    //           "淮北天澈碳基新材料科技有限公司_总排口",
    //           "安徽英科医疗用品有限公司_1期（锅炉排气筒29）",
    //           "安徽英科医疗用品有限公司_2期（锅炉排气筒28）",
    //           "安徽英科医疗用品有限公司_5号烟囱排口",
    //           "淮北众城水泥有限责任公司_5000T烟囱窑尾排口",
    //           "淮北众城水泥有限责任公司_4500T烟囱窑尾排口",
    //           "临涣中利发电有限公司_1#脱硫出口",
    //           "临涣中利发电有限公司_2#脱硫出口",
    //           "临涣焦化股份有限公司_焦炉1#烟囱(DA005)",
    //           "淮北涣城发电有限公司_3#脱硫出口",
    //           "淮北涣城发电有限公司_4#脱硫出口",
    //           "新疆昆仑钢铁有限公司_烧结出口",
    //           "新疆米东天山水泥有限责任公司山水泥有限责任公司_3#窑尾",
    //           "新疆米东天山水泥有限责任公司山水泥有限责任公司_2#窑尾",
    //           "新疆米东天山水泥有限责任公司山水泥有限责任公司_1#窑尾",
    //           "宝武集团鄂城钢铁有限公司_3#转炉二次除尘烟囱",
    //           "宝武集团鄂城钢铁有限公司_1#高炉出铁场除尘排放口",
    //           "宝武集团鄂城钢铁有限公司_转炉铁水预处理除尘排放口",
    //           "华能武汉发电有限责任公司_2#脱硫出口",
    //           "武汉金凤凰纸业有限公司_废气总排口",
    //           "湖北亚东水泥有限公司_2#窑尾"]
    //             },
    //             yAxis: {
    //               type: 'value'
    //             },
    //             series: [
    //               {
    //                 name: 'Placeholder',
    //                 type: 'bar',
    //                 stack: 'Total',
    //                 itemStyle: {
    //                   borderColor: 'transparent',
    //                   color: 'transparent'
    //                 },
    //                 emphasis: {
    //                   itemStyle: {
    //                     borderColor: 'transparent',
    //                     color: 'transparent'
    //                   }
    //                 },
    //                 data: [0.482,
    //           4.965,
    //           2.608,
    //           3.275,
    //           0.793,
    //           0.911,
    //           1.954,
    //           1.155,
    //           2.714,
    //           11.411,
    //           2.988,
    //           1.209,
    //           2.464,
    //           0.142,
    //           0.212,
    //           0.072,
    //           0.076,
    //           0.282,
    //           0.199,
    //           2.214,
    //           1.059,
    //           0.997,
    //           1.162,
    //           1.261,
    //           0.624,
    //           0.867,
    //           0.689,
    //           1.199,
    //           1.072,
    //           0.519,
    //           0.085,
    //           1.009,
    //           0.574,
    //           0.698,
    //           1.399,
    //           1.22,
    //           1.01,
    //           0.63,
    //           0.209,
    //           1.4,
    //           ,
    //           0.134,
    //           0.54,
    //           0.1,
    //           1.28,
    //           0.119,
    //           0.2,
    //           0.799,
    //           0.576,
    //           0.012,
    //           0.26,
    //           0.026,
    //           0.684,
    //           0.342,
    //           0.512,
    //           ,
    //           4.907,
    //           3.299,
    //           2.366,
    //           3.441,
    //           6.33,
    //           4.873,
    //           5.562,
    //           4.924,
    //           5.191,
    //           5.663,
    //           0.863,
    //           0.484,
    //           1.164,
    //           0.203,
    //           ,
    //           ,
    //           1.344,
    //           1.757,
    //           1.028,
    //           2.447,
    //           1.2,
    //           4.08,
    //           0.847,
    //           1.17,
    //           0.389,
    //           0.243,
    //           1.764,
    //           0.661,
    //           1.817,
    //           1.218,
    //           1.037,
    //           3.981,
    //           1.106,
    //           1.859,
    //           0.626,
    //           0.474,
    //           1.099,
    //           ,
    //           0.773,
    //           2.84,
    //           0.579,
    //           0.88,
    //           0.35,
    //           2.09]
    //               },
    //               {
    //                 name: 'Life Cost',
    //                 type: 'bar',
    //                 stack: 'Total',
    //                 label: {
    //                   show: false,
    //                   position: 'inside'
    //                 },
    //                 data: [2.078,
    //           6.698,
    //           5.659,
    //           4.749,
    //           7.613,
    //           11.461,
    //           3.995,
    //           8.545,
    //           8.463,
    //           19.743,
    //           12.868,
    //           5.297,
    //           6.555,
    //           13.915,
    //           2.145,
    //           0.651,
    //           0.403,
    //           0.51,
    //           0.702,
    //           3.506,
    //           3.034,
    //           1.453,
    //           3.788,
    //           1.994,
    //           4.099,
    //           2.806,
    //           3.747,
    //           2.139,
    //           1.996,
    //           3.91,
    //           12.63,
    //           3.179,
    //           5.537,
    //           11.183,
    //           2.962,
    //           6.44,
    //           5.2,
    //           2.96,
    //           5.372,
    //           4.95,
    //           ,
    //           4.039,
    //           2.42,
    //           3.7,
    //           6.36,
    //           1.79,
    //           6.827,
    //           3.938,
    //           28.88,
    //           0.607,
    //           2.171,
    //           0.826,
    //           54.38,
    //           0.994,
    //           1.922,
    //           ,
    //           12.922,
    //           11.825,
    //           11.242,
    //           19.933,
    //           19.507,
    //           14.964,
    //           14.267,
    //           18.928,
    //           19.17,
    //           16.614,
    //           19.772,
    //           15.469,
    //           15.893,
    //           23.399,
    //           ,
    //           ,
    //           4.775,
    //           5.653,
    //           8.616,
    //           6.36,
    //           11.372,
    //           13.69,
    //           2.855,
    //           5.767,
    //           8.135,
    //           7.792,
    //           8.162,
    //           11.934,
    //           4.555,
    //           7.656,
    //           8.017,
    //           13.332,
    //           5.245,
    //           5.641,
    //           4.798,
    //           4.098,
    //           1.862,
    //           ,
    //           2.746,
    //           4.739,
    //           1.612,
    //           5.16,
    //           1.055,
    //           3.35]
    //               }
    //             ]
    //           };
    //     } else {
    //         return {
    //             grid: {
    //                 ...grid,
    //              },
    //             xAxis: {
    //                 type: 'category',
    //                 data: ["谷神生物科技集团有限公司_谷神生物",
    //                     "衡阳永清环保能源有限公司_1#废气放排口",
    //                     "衡阳永清环保能源有限公司_2#废气放排口",
    //                     "衡阳永清环保能源有限公司_3#废气放排口",
    //                     "湖南惠明环保科技有限公司_1#废气放排口",
    //                     "湖南惠明环保科技有限公司_2#废气放排口",
    //                     "湖南惠明环保科技有限公司_3#废气放排口",
    //                     "湖南省锐驰环保科技有限公司_2#废气总排口",
    //                     "桂阳县兴达环保金属回收加工有限公司_废气总排口",
    //                     "祁阳凯迪绿色能源开发有限公司_总排口",
    //                     "贵州黄平尖峰水泥有限公司_窑尾排口",
    //                     "国电长源汉川第一发电有限公司_1#脱硫净烟气",
    //                     "沈阳经济技术开发区热电有限公司_经开热电1#2#3#4#炉总出口",
    //                     "沈阳经济技术开发区热电有限公司_经开热电5#气炉出口",
    //                     "中石化大港分公司热电部_6#脱硫出口（超低总排口）",
    //                     "中石化大港分公司热电部_7#脱硫出口（超低总排口）",
    //                     "中石化大港分公司热电部_8#脱硫出口（超低总排口）",
    //                     "中石化大港分公司热电部_9#脱硫出口（超低总排口）",
    //                     "中石化大港分公司热电部_10#脱硫出口（超低总排口）",
    //                     "天津金隅振兴环保科技有限公司_2#窑尾",
    //                     "邯钢集团邯宝钢铁有限公司_2#360烧结机头脱硫脱硝废气排放口",
    //                     "河北新金钢铁有限公司_3#1080m³高炉出铁除尘",
    //                     "河北新金钢铁有限公司_3#1080m³高炉供料除尘",
    //                     "河北新金钢铁有限公司_2*120T转炉二次除尘",
    //                     "河北新金钢铁有限公司_2#200m³烧结机机尾除尘",
    //                     "河北新金钢铁有限公司_白灰炉脱硝出口",
    //                     "河北新金钢铁有限公司_卷板2#加热炉空烟排口",
    //                     "河北新金钢铁有限公司_东区高炉原料地沟中转除尘",
    //                     "河北新金钢铁有限公司_2×120T炼钢转炉三次除尘排口",
    //                     "河北新金钢铁有限公司_卷板2#加热炉煤烟排口",
    //                     "华新水泥（赤壁）有限公司_窑尾排放口",
    //                     "华润电力湖北有限公司_1#废气排放口",
    //                     "华润电力湖北有限公司_3#废气排放口",
    //                     "崇阳昌华实业有限公司_窑尾排放口",
    //                     "华润电力湖北有限公司_2#废气排放口",
    //                     "国电长源汉川第一发电有限公司_3#脱硫净烟气",
    //                     "湖北华电西塞山发电有限公司_2号机组",
    //                     "湖北华电西塞山发电有限公司_1号机组",
    //                     "国电长源汉川第一发电有限公司_4#脱硫净烟气",
    //                     "国电长源汉川第一发电有限公司_2#脱硫净烟气",
    //                     "湖北大展钢铁有限公司_废气排口",
    //                     "湖州未知企业67_4#排放口",
    //                     "湖州未知企业65_排放口",
    //                     "湖州未知企业75_排放口",
    //                     "湖州未知企业73_排放口",
    //                     "湖州未知企业85_排放口",
    //                     "湖州未知企业34_1#排放口",
    //                     "湖州未知企业58_6#排放口",
    //                     "湖州未知企业77_排放口",
    //                     "湖州未知企业53_2#排放口",
    //                     "湖州未知企业37_排放口",
    //                     "湖州未知企业74_1#排放口",
    //                     "湖州未知企业56_排放口",
    //                     "大唐淮北发电厂_1#脱硫出口",
    //                     "大唐淮北发电厂_2#脱硫出口",
    //                     "安徽金冠玻璃有限责任公司_总排口",
    //                     "临涣焦化股份有限公司_焦炉2#烟囱(DA008)",
    //                     "临涣焦化股份有限公司_焦炉3#烟囱(DA012)",
    //                     "临涣焦化股份有限公司_焦炉4#烟囱(DA016)",
    //                     "临涣焦化股份有限公司_3#加煤除尘(DA014)",
    //                     "临涣焦化股份有限公司_4#加煤除尘(DA018)",
    //                     "临涣焦化股份有限公司_3#推焦除尘(DA013)",
    //                     "临涣焦化股份有限公司_1#推焦排口",
    //                     "临涣焦化股份有限公司_1#加煤排口",
    //                     "临涣焦化股份有限公司_2#加煤排口",
    //                     "临涣焦化股份有限公司_2#推焦排口",
    //                     "临涣焦化股份有限公司_干熄焦3#排口",
    //                     "临涣焦化股份有限公司_干熄焦4#排口",
    //                     "临涣焦化股份有限公司_干熄焦1#排口",
    //                     "临涣焦化股份有限公司_干熄焦2#排口",
    //                     "临涣焦化股份有限公司_1#机侧除尘",
    //                     "临涣焦化股份有限公司_2#机侧除尘",
    //                     "临涣焦化股份有限公司_5#加煤除尘",
    //                     "临涣焦化股份有限公司_5#推焦除尘",
    //                     "淮北申皖发电有限公司_1#脱硫出口",
    //                     "淮北申皖发电有限公司_2#脱硫出口",
    //                     "上海电气（淮北）生物质热电有限公司_1#脱硫排口",
    //                     "上海电气（淮北）生物质热电有限公司_2#脱硫排口",
    //                     "淮北申能发电有限公司_脱硫出口",
    //                     "淮北天澈碳基新材料科技有限公司_总排口",
    //                     "安徽英科医疗用品有限公司_1期（锅炉排气筒29）",
    //                     "安徽英科医疗用品有限公司_2期（锅炉排气筒28）",
    //                     "安徽英科医疗用品有限公司_5号烟囱排口",
    //                     "淮北众城水泥有限责任公司_5000T烟囱窑尾排口",
    //                     "淮北众城水泥有限责任公司_4500T烟囱窑尾排口",
    //                     "临涣中利发电有限公司_1#脱硫出口",
    //                     "临涣中利发电有限公司_2#脱硫出口",
    //                     "临涣焦化股份有限公司_焦炉1#烟囱(DA005)",
    //                     "淮北涣城发电有限公司_3#脱硫出口",
    //                     "淮北涣城发电有限公司_4#脱硫出口",
    //                     "新疆昆仑钢铁有限公司_烧结出口",
    //                     "新疆米东天山水泥有限责任公司山水泥有限责任公司_3#窑尾",
    //                     "新疆米东天山水泥有限责任公司山水泥有限责任公司_2#窑尾",
    //                     "新疆米东天山水泥有限责任公司山水泥有限责任公司_1#窑尾",
    //                     "宝武集团鄂城钢铁有限公司_3#转炉二次除尘烟囱",
    //                     "宝武集团鄂城钢铁有限公司_1#高炉出铁场除尘排放口",
    //                     "宝武集团鄂城钢铁有限公司_转炉铁水预处理除尘排放口",
    //                     "华能武汉发电有限责任公司_2#脱硫出口",
    //                     "武汉金凤凰纸业有限公司_废气总排口",
    //                     "湖北亚东水泥有限公司_2#窑尾"]
    //             },
    //             yAxis: {
    //                 type: 'value'
    //             },
    //             series: [
    //                 {
    //                     data: [0.777,
    //                         0.408,
    //                         0.481,
    //                         0.344,
    //                         0.977,
    //                         6.181,
    //                         1.686,
    //                         4.739,
    //                         3.879,
    //                         1.638,
    //                         2.428,
    //                         2.762,
    //                         0.787,
    //                         1.492,
    //                         0.252,
    //                         0.048,
    //                         0.592,
    //                         0.088,
    //                         0.798,
    //                         0.983,
    //                         1.975,
    //                         0.34,
    //                         1.202,
    //                         0.893,
    //                         1.196,
    //                         1.788,
    //                         1.778,
    //                         0.973,
    //                         1.034,
    //                         2.414,
    //                         16.328,
    //                         0.823,
    //                         1.501,
    //                         4.373,
    //                         0.243,
    //                         2.925,
    //                         1.114,
    //                         0.63,
    //                         2.629,
    //                         1.377,
    //                         0,
    //                         2.041,
    //                         0.64,
    //                         1.7,
    //                         2.04,
    //                         0.435,
    //                         5.4,
    //                         3.724,
    //                         22.678,
    //                         2.256,
    //                         1.23,
    //                         0.779,
    //                         3.917,
    //                         0.421,
    //                         0.828,
    //                         0,
    //                         5.239,
    //                         5.132,
    //                         5.104,
    //                         13.48,
    //                         5.223,
    //                         3.732,
    //                         1.89,
    //                         4.382,
    //                         6.935,
    //                         7.216,
    //                         5.269,
    //                         2.491,
    //                         6.529,
    //                         8.543,
    //                         0,
    //                         0,
    //                         4.749,
    //                         2.347,
    //                         1.785,
    //                         2.075,
    //                         5.447,
    //                         4.249,
    //                         0.804,
    //                         2.967,
    //                         7.368,
    //                         5.25,
    //                         4.592,
    //                         5.28,
    //                         2.063,
    //                         5.459,
    //                         5.296,
    //                         6.846,
    //                         2.132,
    //                         2.56,
    //                         3.065,
    //                         1.017,
    //                         0.383,
    //                         0,
    //                         1.5,
    //                         1.212,
    //                         0.824,
    //                         2.111,
    //                         0.26,
    //                         2.372],
    //                     type: 'bar'
    //                 }
    //             ]
    //         };
    //     }
    // }
    const getOption2 = (title, data) => {
        const grid = {
            left: 100,
            right: 0,
            bottom: 20,
            top: 10,
            // containLabel: true
        }
        if (!data) {
            return {};
        }
        if (title === '波动范围') {
            let otherOptions = {};
            let xAxisData = [];
            if (data && data.Datas)
                for (let index = 0; index < data.Datas.length; index++) {
                    xAxisData.push(index);
                }
            let option = {
                color: '#5470c6',
                grid: {
                    ...grid,
                    left: 40,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter: function (params) {
                        let dataIndex = params[0].dataIndex;
                        let currentData = data.Datas[dataIndex];
                        let tooltipText = `企业：${currentData.EntName} <br/>
                排放口：${currentData.PointName} <br/>
                DGIMN：${currentData.DGIMN} <br/>
                波动下限：${currentData.LowerLimit} <br/>
                波动上限：${currentData.UpperLimit} <br/>
                波动范围：${currentData.InterRange} <br/>
              `;
                        return tooltipText;
                    },
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false,
                    },
                },
                series: [
                    {
                        name: 'Placeholder',
                        type: 'bar',
                        stack: 'Total',
                        silent: true,
                        itemStyle: {
                            borderColor: 'transparent',
                            color: 'transparent',
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: 'transparent',
                                color: 'transparent',
                            },
                        },
                        barMaxWidth: 40,
                        data: data.LowerData,
                    },
                    {
                        name: 'Income',
                        type: 'bar',
                        stack: 'Total',
                        // label: {
                        //   show: true,
                        //   position: 'top',
                        // },
                        barMaxWidth: 40,
                        data: data.diffData,
                    },
                ],
                ...otherOptions,
            };
            return option;
        } else {
            let xAxisData = [], yAxisData = [];
            if (data && data.Datas) {
                for (let index = 0; index < data.Datas.length; index++) {
                    xAxisData.push(data.Datas[index].EntName);
                    yAxisData.push(data.Datas[index].Amplitude)
                }
            }
           let option = {
                grid: {
                    ...grid,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: yAxisData,
                        type: 'bar'
                    }
                ]
            };
            return option
        }

    };
    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            className={'ant-advanced-search-form'}
            layout='inline'
        >
            <Form.Item label='选择项目'>
                <Select
                    defaultValue="1"
                    style={{ width: 200 }}
                    placeholder='内蒙数据同步'
                    options={[
                        {
                            value: '1',
                            label: '内蒙数据',
                        },
                    ]}
                />
            </Form.Item>
        </Form>
    }

    return (
        <div className={`${styles.characteristicLearningSty}`}>
            <BreadcrumbWrapper >
                <Card className='queryCriterTitleSty' bodyStyle={{ padding: '8px 24px' }}>{searchComponents()}</Card>
                <Row style={{ marginTop: 12, height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
                    <Col span={6} style={{ paddingRight: 6 }}>
                        <Card style={{ marginBottom: 12 }}>
                            <TitleComponents title='模型训练结果分析' />
                            <ReactEcharts
                                ref={echart => {
                                    echart && setEcharts1(echart.echarts);
                                }}
                                option={getOption(100)}
                                lazyUpdate={true}
                                style={{ height: '165px', width: '100%' }}
                            />
                            <Descriptions column={2}>
                                <Descriptions.Item label="成功训练排口">101</Descriptions.Item>
                                <Descriptions.Item label="失败训练排口">0</Descriptions.Item>
                                <Descriptions.Item label="最近训练时间">2024-06-21 15:54</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col span={18} style={{ paddingLeft: 6 }}>
                        <Card style={{ marginBottom: 12 }}>
                            <TitleComponents title='模型训练结果详情' />
                            <SdlTable
                                loading={tableLoading}
                                bordered
                                dataSource={dataSource}
                                columns={columns}
                                scroll={{ y: 'hidden' }}
                                rowClassName={null}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                    {
                        ['波动范围', '振幅范围'].map(titleItem => {
                            return <Col span={24}>
                                <Card style={{ marginBottom: 12 }}>
                                    <TitleComponents title={titleItem} />
                                    <Tabs
                                        type='card'
                                        size='small'
                                        items={PollutantListConst.map((item, i) => {
                                            return {
                                                label: item.PollutantName,
                                                key: item.PollutantCode,
                                                children:
                                                    <ReactEcharts
                                                        ref={echart => {
                                                            echart && setEcharts2(echart.echarts);
                                                        }}
                                                        option={getOption2(titleItem, chartData && chartData[0] && chartData.filter(filterItem => filterItem.PollutantCode == item.PollutantCode)?.[0])}
                                                        style={{ height: '180px', width: '100%' }}
                                                    />,
                                            };
                                        })}
                                    />
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);