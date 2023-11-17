/**
 * 功  能：页面主体内容组件
 * 创建人：吴建伟
 * 创建时间：2018.12.18
 */
import React, { Component } from 'react';
import {
    Breadcrumb
} from 'antd';
import router from 'umi/router';
import styles from './style.less';

/**
 * 页面主体内容组件
 */
export default class MonitorContent extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
    }

    renderBreadCrumbList=() => {
        const rtnVal = [];
        const { breadCrumbList } = this.props;
        if (breadCrumbList && breadCrumbList.length !== 0) {
            breadCrumbList.map((item,key) => {
                if (item.Url !== '') {
                    rtnVal.push(<Breadcrumb.Item key={key}><a onClick={() => {
                        router.replace(item.Url);
                    }}
                    >{item.Name}
                    </a>
                    </Breadcrumb.Item>);
                }else
                    rtnVal.push(<Breadcrumb.Item key={key}>{item.Name}</Breadcrumb.Item>);
            });
        }
        return rtnVal;
    }

    render() {
        return (
            <div>
                <div className={styles.pageHeader}>
                    <Breadcrumb className={styles.breadcrumb}>
                        {/* <Breadcrumb.Item><a href="/homepage">首页</a></Breadcrumb.Item>
                        <Breadcrumb.Item>智能质控</Breadcrumb.Item>
                        <Breadcrumb.Item>传输有效率</Breadcrumb.Item> */}
                        {
                            this.renderBreadCrumbList()
                        }
                    </Breadcrumb>
                </div>
                <div
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 125px)',
                        overflow: 'auto'
                    }}
                    className={styles.contentDiv}
                >
                    <div className={styles.contentCSS}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
