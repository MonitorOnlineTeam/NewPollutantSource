import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HkShowVideo from '@/components/hkvideo/HkShowVideo'
import {
  Icon,
  Button,
} from 'antd';
/**
 * 视频预览
 * xpy 2019.07.26
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const title = '视频预览';
        return (
            <div id="hkvideo">
                <PageHeaderWrapper title={<span>{title}<Button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    history.go(-1);
                  }}
                  type="link"
                  size="small"
                >
                  <Icon type="rollback" />
                  返回上级
                </Button></span>}>
                 <HkShowVideo DGIMN={this.props.match.params.pointcode} initLoadData />
                </PageHeaderWrapper>
            </div>
        );
    }
}
export default Index;
