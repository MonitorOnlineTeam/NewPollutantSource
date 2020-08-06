import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import PageLoading from '@/components/PageLoading'
import  HistoryDatas from './components/HistoryDatas'
/**
 * 数据查询 历史数据
 * jab 2020.07.30
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
            <div id="historyData">

              <NavigationTree runState='1' domId="#dataquery" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.changeDgimn(value)
                    }
                }} />


                <BreadcrumbWrapper>
                    {/* {
                        this.state.dgimn ?
                            (
                                this.props.location.query.type == 1 ? <DataQuery2 DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData /> :
                                    <DataQuery DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData />
                            )
                            : <PageLoading />
                    } */}
                    <HistoryDatas />
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
