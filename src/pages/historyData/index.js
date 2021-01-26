import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from './components/NavigationTree'
import DataQuery2 from './components/DataQuery2'
import DataQuery from './components/DataQuery'
import PageLoading from '@/components/PageLoading'

/**
 * 数据查询页面
 * xpy 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            pointName: '',
            entName: '',
        };
    }

    changeDgimn = value => {
        debugger
        this.setState({
            dgimn: value[0].key,
            pointName: value[0].pointName,
            entName: value[0].entName,
        })
    }

    render() {
        const { pointName, entName } = this.state;
        return (
            <div id="dataquery">
                <div style={{ paddingLeft: "320px" }}>
                    <BreadcrumbWrapper>
                        {/* {
                        this.state.dgimn ?
                            (
                                this.props.location.query.type == 1 ? <DataQuery2 DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData /> :
                                    <DataQuery DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData />
                            )
                            : <PageLoading />
                    } */}
                      <DataQuery DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData />
                   
                </BreadcrumbWrapper>
                </div>
                <NavigationTree />
            </div>
        );
    }
}
export default Index;