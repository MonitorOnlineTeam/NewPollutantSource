import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavigationTree from '@/components/NavigationTree/index.js'
import YsyShowVideo from '@/components/QCAVideo/QCAYsyShowVideo.js'

/**
 * 质控视频预览
 * lzp 2019.11.11
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            VideoNo: '',
        };
    }

    changeDgimn=VideoNo => {
        this.setState({
            VideoNo,
        })
    }

    render() {
        return (
            <div id="ysyvideo">
                 <NavigationTree QCAUse="1"  domId="#ysyvideo" choice={false} onItemClick={value => {
                            if (value.length > 0 && !value[0].IsEnt&&value[0].QCAType=="2") {
                                debugger
                            this.changeDgimn(value[0].VideoNo)
                            }
                        }} />
                <PageHeaderWrapper>
                {this.state.VideoNo&&<YsyShowVideo VideoNo={this.state.VideoNo} />} 
                </PageHeaderWrapper>
               
            </div>
        );
    }
}
export default Index;
