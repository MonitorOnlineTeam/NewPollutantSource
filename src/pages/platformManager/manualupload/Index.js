import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '../../../components/NavigationTree'
import ContentList from './components/ContentList'

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DGIMN: "62262431qlsp02",
        };
    }

    componentDidMount() {
        debugger

    }
    // changeDgimn = dgimn => {
    //     this.setState({
    //         DGIMN,
    //     })
    // }

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
