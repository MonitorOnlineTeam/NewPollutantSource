import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '../../../components/NavigationTree'
import ContentList from './components/ContentList'
import moment from "moment";

@connect(({ manualupload, loading }) => ({

}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DGIMN: "",
        };
    }

    componentDidMount() {
    }
    changeDgimn = (DGIMN) => {
        const { dispatch } = this.props;
        this.setState({
            DGIMN,
        })
        if (DGIMN) {
            this.GetAllPollutantTypes(DGIMN);
        }
    }
    //根据MN号获取污染物类型
    GetAllPollutantTypes = (DGIMN) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualupload/GetAllPollutantTypes',
            payload: {
                DGIMN
            },
        });
    }
    render() {
        const { DGIMN } = this.state;
        return (
            <div id="manualupload">
                <PageHeaderWrapper>
                    <ContentList DGIMN={DGIMN} />
                </PageHeaderWrapper>
                <NavigationTree domId="#manualupload" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.changeDgimn(value[0].key)
                    }
                }} />
            </div>
        )


    }
}
export default Index;
