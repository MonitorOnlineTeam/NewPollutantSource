import React, { Component } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import moment from 'moment';
import NavigationTree from '../../../components/NavigationTree'
import ContentList from './components/ContentList'

@connect(({ manualuploadauto, loading }) => ({

}))

/**
 * 功  能：手工数据上传自动父页面
 * 创建人：dongxiaoyun
 * 创建时间：2020.4.2
 *  */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DGIMN: '',
        };
    }

    changeDgimn = DGIMN => {
        const { dispatch } = this.props;
        this.setState({
            DGIMN,
        })
        if (DGIMN) {
            dispatch({
                type: 'manualuploadauto/updateState',
                payload: {
                    manualUploadParameters: {
                        ...this.props.manualUploadParameters,
                        ...{
                            PageIndex: 1,
                            PageSize: 10,
                            // BeginTime: moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'),
                            // EndTime: moment().format('YYYY-MM-DD 23:59:59'),
                            PollutantCode: '',
                            DGIMN,
                        },
                    },
                },
            });
            this.GetAllPollutantTypes(DGIMN);
        }
    }

    // 根据MN号获取污染物与类型
    GetAllPollutantTypes = DGIMN => {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualuploadauto/addGetPollutantByPoint',
            payload: {
                DGIMN,
            },
        });
    }

    render() {
        const { DGIMN } = this.state;
        return (
            <div id="manualuploadauto">
                <BreadcrumbWrapper >
                    <ContentList DGIMN={DGIMN} />
                </BreadcrumbWrapper>
                <NavigationTree runState="1"
                    // checkpPol={6}
                    domId="#manualuploadauto" choice={false} onItemClick={value => {
                        if (value.length > 0 && !value[0].IsEnt) {
                            this.changeDgimn(value[0].key)
                        }
                    }} />
            </div>
        )
    }
}
export default Index;
