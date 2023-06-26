import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
// import "react-image-lightbox/style.css";
import EmergencyDetailInfo from './EmergencyDetailInfo';

class EmergencyDetailInfoLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    // //生成面包屑
    // renderBreadCrumb = () => {
    //     const rtnVal = [];
    //     const params = this.props.match.params;
    //     rtnVal.push({ Name: '首页', Url: '/' });
    //     switch (params.viewtype) {
    //         case 'datalistview': //数据一栏
    //             rtnVal.push({ Name: '数据一览', Url: `/overview/${params.viewtype}` });
    //             break;
    //         case 'mapview': //地图一栏
    //             rtnVal.push({ Name: '地图一览', Url: `/overview/${params.viewtype}` });
    //             break;
    //         case 'pielist': //我的派单
    //             rtnVal.push({ Name: '我的派单', Url: `/account/settings/mypielist` });
    //             break;
    //         case 'workbench': //工作台
    //             rtnVal.push({ Name: '工作台', Url: `/${params.viewtype}` });
    //             break;
    //         case 'pointinfo': //监测点管理
    //             rtnVal.push({ Name: '监测点管理', Url: `/sysmanage/${params.viewtype}` });
    //             break;
    //         case 'equipmentoperatingrate': //设备运转率
    //             rtnVal.push({ Name: '设备运转率', Url: `/qualitycontrol/${params.viewtype}` });
    //             break;
    //         default:
    //             break;
    //     }
    //     if (params.taskfrom === 'ywdsjlist') { //大事记
    //         rtnVal.push({ Name: '运维大事记', Url: `/pointdetail/${params.DGIMN}/${params.viewtype}/${params.taskfrom}` });
    //     } else if (params.taskfrom === 'operationywdsjlist') {
    //         rtnVal.push({ Name: '智能运维', Url: `` });
    //         rtnVal.push({ Name: '运维大事记', Url: `/operation/ywdsjlist` });
    //     } else if (params.taskfrom.indexOf('qcontrollist') > -1) { //质控记录（从表单进来时）
    //         let taskfrom1 = params.taskfrom.split('-')[0];
    //         let histroyrecordtype = taskfrom1.split('-')[1];
    //         rtnVal.push({ Name: '质控记录', Url: `/pointdetail/${params.DGIMN}/${params.viewtype}/${params.taskfrom}/${histroyrecordtype}` });
    //     } else if(params.taskfrom==='OperationCalendar') {
    //         rtnVal.push({ Name: '智能运维', Url: `` });
    //         rtnVal.push({ Name: '运维日历', Url: `/operation/operationcalendar` });
    //     }
    //     rtnVal.push({ Name: '任务详情', Url: '' });
    //     return rtnVal;
    // }

    render() {
        const {match,isHomeModal,hideBreadcrumb}=this.props;
        return (
            //breadCrumbList={this.renderBreadCrumb()}
            <div>
                {/* <BreadcrumbWrapper title="任务单详情"  hideBreadcrumb={hideBreadcrumb}> */}
                    <EmergencyDetailInfo isHomeModal={isHomeModal} {...match.params} history={this.props.history} />
                {/* </BreadcrumbWrapper> */}
            </div>
        );
    }
}
export default EmergencyDetailInfoLayout;