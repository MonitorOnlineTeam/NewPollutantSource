/*
 * @Author: lzp
 * @Date: 2019-08-22 11:04:46
 * @LastEditors: outman0611
 * @LastEditTime: 2025-04-03 11:04:13
 * @Description: 运维记录单详情
 */
import React, { Component } from 'react';
import { Table, Divider, Button, Card } from 'antd';
import { PointIcon, Right } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import BdTestRecordContent from '@/pages/EmergencyTodoList/BdTestRecordContent'
import CompleteExtractionRecordContent from '@/pages/EmergencyTodoList/CompleteExtractionRecordContent'
import ConsumablesReplaceRecordContent from '@/pages/EmergencyTodoList/ConsumablesReplaceRecordContent'
import DeviceExceptionRecordContent from '@/pages/EmergencyTodoList/DeviceExceptionRecordContent'
import DilutionSamplingRecordContent from '@/pages/EmergencyTodoList/DilutionSamplingRecordContent'
import DirectMeasurementRecordContent from '@/pages/EmergencyTodoList/DirectMeasurementRecordContent'
import RepairRecordContent from '@/pages/EmergencyTodoList/RepairRecordContent'
import StandardGasRepalceRecordContent from '@/pages/EmergencyTodoList/StandardGasRepalceRecordContent'
import StopCemsRecordContent from '@/pages/EmergencyTodoList/StopCemsRecordContent'
import JzRecordContent from '@/pages/EmergencyTodoList/JzRecordContent'
import MaintainRepalceRecord from '@/pages/EmergencyTodoList/MaintainRepalceRecord'
import SparePartReplaceRecord from '@/pages/EmergencyTodoList/SparePartReplaceRecordContent'
import FailureHoursRecord from '@/pages/EmergencyTodoList/FailureHoursRecord'
import ReagentReplaceRecord from '@/pages/EmergencyTodoList/ReagentReplaceRecord'
import CooperaInspection from '@/pages/EmergencyTodoList/CooperaInspection'
import DataConsistencyRealTime from '@/pages/EmergencyTodoList/DataConsistencyRealTime'
import DataConsistencyRealDate from '@/pages/EmergencyTodoList/DataConsistencyRealDate'
import ThirdPartyTestingContent from '@/pages/EmergencyTodoList/ThirdPartyTestingContent'
import WaterQualityCalibrationRecord from '@/pages/EmergencyTodoList/WaterQualityCalibrationRecord'
import StandardSolutionVerificationRecord from '@/pages/EmergencyTodoList/StandardSolutionVerificationRecord'
import DeviceParameterChange from '@/pages/EmergencyTodoList/DeviceParameterChange'
import GasDeviceParameterChange from '@/pages/EmergencyTodoList/GasDeviceParameterChange'
import ComparisonTestResults from '@/pages/EmergencyTodoList/ComparisonTestResults'
import PatrolCEM from '@/pages/EmergencyTodoList/Patrol/CEM'
import JzRecordContentZb from '@/pages/EmergencyTodoList/ZbJz/JzRecordContent'
import JzRecordContentZbFs from '@/pages/EmergencyTodoList/ZbJz/JzRecordContentFs'
import ConsumableReplace from '@/pages/EmergencyTodoList/ConsumableReplace'
import RMR from '@/pages/EmergencyTodoList/RMR'
import BdTestRecordContentZb from '@/pages/EmergencyTodoList/BdTestRecordContent_ZB'
import ZbDeviceRepair from '@/pages/EmergencyTodoList/ZbDeviceRepair'
import ZbValueError from '@/pages/EmergencyTodoList/ZbValueError'

import { FormIcon } from '@/utils/icon';
import { PrinterOutlined } from '@ant-design/icons';
import { router } from 'umi'
import styles from './style.less';




// @connect(({ loading, exceptionrecord }) => ({

// }))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.contentRef = React.createRef();
    }
    // // 打印内容区域（使用iframe方式，避免刷新页面）收集所有样式 （已废弃，不能正常分页，需要用户调整缩放才能打印完整）
    // handlePrint = () => {
    //     const printContent = this.contentRef.current;
    //     if (!printContent) return;

    //     // 获取所有已加载的样式表
    //     const styleSheets = Array.from(document.styleSheets);
    //     let styles = '';

    //     // 收集所有样式
    //     styleSheets.forEach(sheet => {
    //         try {
    //             const rules = sheet.cssRules || sheet.rules;
    //             Array.from(rules).forEach(rule => {
    //                 styles += rule.cssText + '\n';
    //             });
    //         } catch (e) {
    //             // 跨域样式表可能会报错，忽略
    //             console.log('无法读取样式表:', e);
    //         }
    //     });

    //     // 创建打印专用样式
    //     const printSpecificStyles = `
    //         @media print {
    //             @page {
    //                 size: A4;
    //                 margin: 0.5cm;
    //             }

    //             html, body {
    //                 margin: 0 !important;
    //                 padding: 0 !important;
    //                 height: auto !important;
    //                 overflow: visible !important;
    //                 background-color: white !important;
    //                 -webkit-print-color-adjust: exact !important;
    //                 print-color-adjust: exact !important;
    //                 color: #000000 !important;
    //             }

    //             .print-content {
    //                 width: 100% !important;
    //                 padding: 0 !important;
    //                 margin: 0 !important;
    //                 background-color: white !important;
    //                 overflow: visible !important;
    //                 height: auto !important;
    //                 color: #000000 !important;
    //             }

    //             /* 隐藏不需要打印的元素 */
    //             .no-print,
    //             .ant-page-header-heading,
    //             .ant-breadcrumb,
    //             .headerActions {
    //                 display: none !important;
    //             }

    //             /* 表格容器样式 */
    //             .ant-table-wrapper {
    //                 width: 100% !important;
    //                 margin: 0 !important;
    //                 padding: 0 !important;
    //                 overflow: visible !important;
    //             }

    //             .ant-table {
    //                 font-size: 12px !important;
    //                 width: 100% !important;
    //                 table-layout: auto !important;
    //                 border-collapse: collapse !important;
    //                 color: #000000 !important;
    //             }

    //             .ant-table-container {
    //                 overflow: visible !important;
    //             }

    //             .ant-table-content {
    //                 overflow: visible !important;
    //             }

    //             .ant-table-body {
    //                 overflow: visible !important;
    //             }

    //             /* 表头样式 */
    //             .ant-table-thead {
    //                 display: table-header-group !important;
    //             }

    //             .ant-table-thead > tr > th {
    //                 background-color: #f0f0f0 !important;
    //                 font-weight: bold !important;
    //                 text-align: center !important;
    //                 border: 1px solid #666666 !important;
    //                 padding: 4px !important;
    //                 color: #000000 !important;
    //             }

    //             /* 表格主体样式 */
    //             .ant-table-tbody {
    //                 display: table-row-group !important;
    //             }

    //             /* 表格行样式 - 允许在页面之间断开 */
    //             .ant-table-tbody > tr {
    //                 page-break-inside: auto !important;
    //             }

    //             /* 表格单元格样式 */
    //             .ant-table-cell {
    //                 padding: 4px !important;
    //                 border: 1px solid #666666 !important;
    //                 white-space: normal !important;
    //                 word-wrap: break-word !important;
    //                 word-break: break-word !important;
    //                 overflow: visible !important;
    //                 color: #000000 !important;
    //             }

    //             /* 确保表格边框显示 */
    //             table, th, td {
    //                 border: 1px solid #666666 !important;
    //             }

    //             /* 强制背景色和边框打印 */
    //             * {
    //                 -webkit-print-color-adjust: exact !important;
    //                 print-color-adjust: exact !important;
    //                 color-adjust: exact !important;
    //             }

    //             /* 移除滚动条 */
    //             ::-webkit-scrollbar {
    //                 display: none !important;
    //             }

    //             /* 确保内容可以分页 */
    //             .ant-card, .ant-table, .ant-table-wrapper {
    //                 page-break-inside: auto !important;
    //             }

    //             /* 确保标题不会被分页 */
    //             h1, h2, h3, h4, h5, h6 {
    //                 page-break-after: avoid !important;
    //                 page-break-inside: avoid !important;
    //                 margin-top: 0.3cm !important;
    //                 margin-bottom: 0.2cm !important;
    //                 color: #000000 !important;
    //             }

    //             /* 确保图片不会被分页 */
    //             img {
    //                 page-break-inside: avoid !important;
    //             }
    //         }
    //     `;

    //     // 创建一个隐藏的iframe
    //     const iframe = document.createElement('iframe');
    //     iframe.style.position = 'absolute';
    //     iframe.style.width = '0';
    //     iframe.style.height = '0';
    //     iframe.style.border = '0';
    //     document.body.appendChild(iframe);

    //     // 获取所有外部样式表链接
    //     const styleLinks = Array.from(document.getElementsByTagName('link'))
    //         .filter(link => link.rel === 'stylesheet')
    //         .map(link => link.outerHTML)
    //         .join('');

    //     // 写入内容到iframe
    //     const iframeDoc = iframe.contentWindow.document;
    //     iframeDoc.open();
    //     iframeDoc.write(`
    //         <!DOCTYPE html>
    //         <html>
    //         <head>
    //             <meta charset="utf-8">
    //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //             ${styleLinks}
    //             <style>
    //                 html, body {
    //                     margin: 0;
    //                     padding: 0;
    //                     height: auto;
    //                     overflow: visible;
    //                 }
    //                 ${styles}
    //                 ${printSpecificStyles}
    //             </style>
    //         </head>
    //         <body>
    //             <div class="print-content">
    //                 ${printContent.innerHTML}
    //             </div>
    //         </body>
    //         </html>
    //     `);
    //     iframeDoc.close();

    //     // 等待样式和图片加载完成
    //     iframe.onload = () => {
    //         setTimeout(() => {
    //             iframe.contentWindow.focus();
    //             iframe.contentWindow.print();

    //             // 打印完成后移除iframe
    //             setTimeout(() => {
    //                 document.body.removeChild(iframe);
    //             }, 1000);
    //         }, 2000); // 增加等待时间，确保内容完全加载
    //     };
    // };



    // 打印内容区域（使用iframe方式，避免刷新页面）
    handlePrint = () => {
        const printContent = this.contentRef.current;
        if (!printContent) return;

        // 创建打印专用样式
        const printSpecificStyles = `
            @media print {
                @page {
                    size: A4;
                    margin: 0.5cm;
                }

                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: white;
                    color: #000000;
                }

                .print-content {
                    width: 100%;
                    padding: 0;
                    margin: 0;
                }

                /* 隐藏不需要打印的元素 */
                .no-print,
                .ant-page-header-heading,
                .ant-breadcrumb,
                .headerActions {
                    display: none !important;
                }

                /* 表格样式 */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    page-break-inside: auto;
                }

                /* 表头样式 */
                thead {
                    display: table-header-group;
                }

                /* 表格主体样式 */
                tbody {
                    display: table-row-group;
                }

                /* 表格行样式 */
                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }

                /* 表格单元格样式 */
                th, td {
                    border: 1px solid #666666;
                    padding: 4px;
                    text-align: center;
                    color: #000000;
                }

                th {
                    background-color: #f0f0f0 !important;
                    font-weight: bold;
                }

                /* 强制背景色和边框打印 */
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }

                /* 确保标题不会被分页 */
                h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid;
                    page-break-inside: avoid;
                    text-align: center;
                }

                /* 确保图片不会被分页 */
                img {
                    page-break-inside: avoid;
                }

                /* 标题居中显示 */
                .ant-card-head-title,
                .ant-card-head,
                .ant-card-head-wrapper,
                .print-content h1,
                .print-content h2,
                .print-content h3,
                .print-content h4,
                .print-content h5,
                .print-content h6,
                .print-content .ant-card-head-title,
                .print-content .title,
                .print-content [class*="title"] {
                    text-align: center !important;
                    justify-content: center !important;
                    display: flex !important;
                    align-items: center !important;
                    font-weight: bold !important;
                }

                /* FormName 样式 - 用于表单标题 */
                .FormName,
                [class*="FormName"],
                [class*="-jz-record-content-FormName"],
                [class*="-FormName"],
                [class*="emergency-todo-list-"] [class*="FormName"] {
                    width: 80% !important;
                    height: 50px !important;
                    line-height: 50px !important;
                    margin: 0 auto !important;
                    margin-top: 20px !important;
                    margin-bottom: 20px !important;
                    font-size: 20px !important;
                    text-align: center !important;
                    font-weight: bold !important;
                    display: block !important;
                }

                /* Ant Design 表格样式覆盖 */
                .ant-table {
                    font-size: 12px;
                }

                .ant-table-thead > tr > th {
                    background-color: #f0f0f0 !important;
                    font-weight: bold;
                    text-align: center;
                    border: 1px solid #666666;
                    padding: 4px;
                }

                .ant-table-tbody > tr > td {
                    border: 1px solid #666666;
                    padding: 4px;
                }

                /* 确保表格容器可见 */
                .ant-table-wrapper,
                .ant-table,
                .ant-table-container,
                .ant-table-content,
                .ant-table-body {
                    overflow: visible !important;
                }

                /* 确保表格可以分页 */
                .ant-table-wrapper {
                    page-break-inside: auto !important;
                }

                .ant-table-thead {
                    display: table-header-group !important;
                }

                .ant-table-tbody {
                    display: table-row-group !important;
                }

                .ant-table-tbody > tr {
                    page-break-inside: auto !important;
                }
            }
        `;

        // 创建一个隐藏的iframe
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        // 获取内容的HTML
        const contentHTML = printContent.innerHTML;

        // 写入内容到iframe
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>运维台账打印</title>
                <style>
                    ${printSpecificStyles}
                </style>
            </head>
            <body>
                <div class="print-content">
                    ${contentHTML}
                </div>
                <script>
                    // 在iframe中移除所有不需要打印的元素
                    document.querySelectorAll('.no-print, .ant-page-header, .ant-breadcrumb, .headerActions').forEach(element => {
                        if (element) {
                            element.style.display = 'none';
                        }
                    });

                    // 确保表格可以分页
                    document.querySelectorAll('.ant-table-thead').forEach(element => {
                        element.style.display = 'table-header-group';
                    });

                    document.querySelectorAll('.ant-table-tbody').forEach(element => {
                        element.style.display = 'table-row-group';
                    });

                    document.querySelectorAll('.ant-table-tbody > tr').forEach(element => {
                        element.style.pageBreakInside = 'auto';
                    });

                    // 确保表格容器可见
                    document.querySelectorAll('.ant-table-wrapper, .ant-table, .ant-table-container, .ant-table-content, .ant-table-body').forEach(element => {
                        element.style.overflow = 'visible';
                    });

                    // 处理 FormName 类名，确保标题居中
                    document.querySelectorAll('[class*="FormName"]').forEach(element => {
                        element.style.width = '80%';
                        element.style.height = '50px';
                        element.style.lineHeight = '50px';
                        element.style.margin = '0 auto';
                        element.style.marginTop = '20px';
                        element.style.marginBottom = '20px';
                        element.style.fontSize = '20px';
                        element.style.textAlign = 'center';
                        element.style.fontWeight = 'bold';
                        element.style.display = 'block';
                    });
                </script>
            </body>
            </html>
        `);
        iframeDoc.close();

        // 等待样式和图片加载完成
        iframe.onload = () => {
            // 执行打印
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // 打印完成后移除iframe
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 1000);
        };
    };

    getrecordForm = () => {
        var form = []
        console.log('this.props', this.props)
        const { taskID, typeID } = this.props.match.params;
        switch (typeID + '') {
            case "1"://维修记录表
                form = <RepairRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "12"://维修记录表 废水
                form = <RepairRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "2"://停机记录表
                form = <StopCemsRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "3"://易耗品更换记录表
                form = <ConsumablesReplaceRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "14"://易耗品更换记录表 废水
                form = <ConsumablesReplaceRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "4"://标准气体更换记录表
                form = <StandardGasRepalceRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "5"://完全抽取法CEMS日常巡检记录表
                form = <CompleteExtractionRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "6"://稀释采样法CEMS日常巡检记录表
                form = <DilutionSamplingRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "7"://直接测量法CEMS日常巡检记录表
                form = <DirectMeasurementRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "8"://CEMS零点量程漂移与校准记录表
                form = <JzRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "9"://CEMS校验测试记录
                form = <BdTestRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "10"://CEMS设备数据异常记录表
                form = <DeviceExceptionRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "27"://保养项更换记录表
                form = <MaintainRepalceRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "28"://备品更换记录表
                form = <SparePartReplaceRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "20"://备品更换记录表 废水
                form = <SparePartReplaceRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "58":
                form = <FailureHoursRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "59":
                form = <FailureHoursRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "60":
                form = <FailureHoursRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "15":  //试剂更换表单
                form = <ReagentReplaceRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "61":  //配合检查表单 废水
                form = <CooperaInspection TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "62":  //配合检查表单
                form = <CooperaInspection TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "63":  //数据一致性实时表单
                form = <DataConsistencyRealTime TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "18":  //数据一致性实时表单 废水
                form = <DataConsistencyRealTime TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "66":  //数据一致性小时与日数据表单
                form = <DataConsistencyRealDate TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "74":  //数据一致性小时与日数据表单 废水
                form = <DataConsistencyRealDate TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "73":  //上月委托第三方检测次数表单
                form = <ThirdPartyTestingContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "65":  //上月委托第三方检测次数表单 废水
                form = <ThirdPartyTestingContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "16":  //水质校准记录表
                form = <WaterQualityCalibrationRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "70":  //标准溶液核查记录表
                form = <StandardSolutionVerificationRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "72":  //设备参数记录表
                form = <DeviceParameterChange TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "64":  //设备参数记录表 废气
                form = <GasDeviceParameterChange TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case "19":  //实际水样比对试验结果记录表
                form = <ComparisonTestResults TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case '76': // 完全抽取法
            case '77': // 稀释采样法
            case '78': // 直接测量法
            case '79': // VOCs
            case '80': // 废水
                form = <PatrolCEM taskID={taskID} typeID={typeID} />
                break;
            /**淄博项目 */
            case '81': //废水 CEMS零点量程漂移与校准记录表
                form = <JzRecordContentZbFs TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case '82': //废气 CEMS零点量程漂移与校准记录表
                form = <JzRecordContentZb TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case '83': // 标准物质更换记录表
                form = <RMR taskID={taskID} typeID={typeID} />
                break;
            case '84':
            case '85':
                form = <ConsumableReplace taskID={taskID} typeID={typeID} />
                break;
            case '86': // CEMS校验测试记录 - 淄博
                form = <BdTestRecordContentZb TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case '88': // zb设备维修
                form = <ZbDeviceRepair TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
            case '92': // zb示值误差
                form = <ZbValueError TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break;
        }
        return form
    }
    render() {
        return (
            <BreadcrumbWrapper breadcrumb={[]} title="记录单详情" hideBreadcrumb={this.props.hideBreadcrumb}>
                <div className={styles.headerActions}>
                    <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={this.handlePrint}
                        className="no-print"
                    >
                        打印
                    </Button>
                </div>
                <div className={`print-content ${styles.recordFormContent}`} ref={this.contentRef}>
                    {this.getrecordForm()}
                </div>
            </BreadcrumbWrapper>
        );
    }
}
export default Index;
