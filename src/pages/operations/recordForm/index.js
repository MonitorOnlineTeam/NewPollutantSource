/*
 * @Author: lzp
 * @Date: 2019-08-22 11:04:46
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:32:19
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

    // 打印内容区域（使用iframe方式，避免刷新页面）
    handlePrint = () => {
        const printContent = this.contentRef.current;
        if (!printContent) return;
        
        // 创建打印样式
        const printStyles = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                table, th, td {
                    border: 1px solid #000;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f0f0f0;
                }
                .no-print {
                    display: none !important;
                }
                /* 隐藏标题 */
                h1, h2, h3, h4, h5, h6 {
                    display: none;
                }
                /* 隐藏面包屑导航 */
                .ant-breadcrumb {
                    display: none;
                }
                /* 隐藏页面标题 */
                .ant-page-header-heading-title {
                    display: none;
                }
                @media print {
                    @page {
                        margin: 1cm;
                    }
                }
            </style>
        `;
        
        // 创建一个隐藏的iframe
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
        
        // 获取内容并移除标题
        let contentHTML = printContent.innerHTML;
        
        // 写入内容到iframe - 不包含title标签
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html><head>' + printStyles + '</head><body>' + contentHTML + '</body></html>');
        iframeDoc.close();
        
        // 等待图片和样式加载完成
        iframe.onload = () => {
            // 在iframe中移除所有标题元素
            const titles = iframe.contentWindow.document.querySelectorAll('h1, h2, h3, h4, h5, h6, .ant-page-header, .ant-breadcrumb, .ant-page-header-heading-title');
            titles.forEach(title => {
                if (title) {
                    title.style.display = 'none';
                }
            });
            
            // 设置空标题（同时设置iframe和主页面的标题）
            iframe.contentWindow.document.title = '运维台账打印';
            
            // 执行打印
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                
                // 打印完成后恢复原始标题并移除iframe
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 500);
        };
    };

    getrecordForm = () => {
        var form = []
        console.log('msg=',this.props.match.params)
        var key = this.props.match.params.typeID
        switch (key) {
            case "1"://维修记录表
            case  1:
                form = <RepairRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "12"://维修记录表 废水
            case  12:
                form = <RepairRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;                
            case "2"://停机记录表
            case  2:
                form = <StopCemsRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "3"://易耗品更换记录表
            case  3:
                form = <ConsumablesReplaceRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "14"://易耗品更换记录表 废水
            case  14:
                form = <ConsumablesReplaceRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;                
            case "4"://标准气体更换记录表
            case  4:
                form = <StandardGasRepalceRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "5"://完全抽取法CEMS日常巡检记录表
            case  5:
                form = <CompleteExtractionRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "6"://稀释采样法CEMS日常巡检记录表
            case  6:
                form = <DilutionSamplingRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "7"://直接测量法CEMS日常巡检记录表
            case  7:
                form = <DirectMeasurementRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "8"://CEMS零点量程漂移与校准记录表
            case  8:
                form = <JzRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "9"://CEMS校验测试记录
            case  9:
                form = <BdTestRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "10"://CEMS设备数据异常记录表
            case  10:
                form = <DeviceExceptionRecordContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "27"://保养项更换记录表
            case  27:
                form = <MaintainRepalceRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "28"://备品更换记录表
            case 28:
                form = <SparePartReplaceRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "20"://备品更换记录表 废水
            case  20:
                form = <SparePartReplaceRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;                
            case "58":
            case  58:
                form = <FailureHoursRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID} />
                break; 
            case "59":
            case  59:
                form = <FailureHoursRecord TaskID={this.props.match.params.taskID}  TypeID={this.props.match.params.typeID}/>
                break;
            case "60":
            case  60:
                form = <FailureHoursRecord TaskID={this.props.match.params.taskID}  TypeID={this.props.match.params.typeID}/>
                break;
            case "15":  //试剂更换表单
            case  15:
                form = <ReagentReplaceRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "61":  //配合检查表单 废水
            case  61:
                form = <CooperaInspection TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;
            case "62":  //配合检查表单
            case  62:
                form = <CooperaInspection TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;    
            case "63":  //数据一致性实时表单
            case  63:
                form = <DataConsistencyRealTime TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;   
            case "18":  //数据一致性实时表单 废水
            case  18:
                form = <DataConsistencyRealTime TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break; 
            case "66":  //数据一致性小时与日数据表单
            case  66:
                form = <DataConsistencyRealDate TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;    
            case "74":  //数据一致性小时与日数据表单 废水
            case  74:
                form = <DataConsistencyRealDate TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;                
            case "73":  //上月委托第三方检测次数表单
            case  73:
                form = <ThirdPartyTestingContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;    
            case "65":  //上月委托第三方检测次数表单 废水
            case  65:
                form = <ThirdPartyTestingContent TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;   
            case "16":  //水质校准记录表
            case  16:
                form = <WaterQualityCalibrationRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;                   
            case "70":  //标准溶液核查记录表
            case  70:
                form = <StandardSolutionVerificationRecord TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break; 
            case "72":  //设备参数记录表
            case  72:
                form = <DeviceParameterChange TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;   
            case "64":  //设备参数记录表 废气
            case  64:
                form = <GasDeviceParameterChange TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
                break;       
            case "19":  //实际水样比对试验结果记录表
            case  19:
                form = <ComparisonTestResults TaskID={this.props.match.params.taskID} TypeID={this.props.match.params.typeID}/>
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
