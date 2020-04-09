
/*
 * @desc:二维码页面
 * @Author: dxy
 * @Date: 2020年3月23日
 */
import React, { Component } from 'react';
import {
    Button, Modal, Icon,
} from 'antd';
import styles from './AppQRCodeComponent.less';
import ImgSrc from '../../../public/waTip.png';
import { connect } from 'dva';
@connect(({ loading, user }) => ({
    settingList: user.settingList,
}))
export default class AppQRCodeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isshow: false,
            mouseIn: false,	// 遮罩层是否显示
            text: '下载'
        };
    }
    QRClick = () => {
        var u = navigator.appVersion;
        //判定是移动端访问
        if (!!u.match(/AppleWebKit.*Mobile.*/)) {
            //如果是微信登录
            if (u.indexOf('MicroMessenger') > -1 || u.indexOf('QQ/') > -1) {
                this.setState({
                    isshow: true,
                    mouseIn: true,
                })
            }
            else {
                if (this.state.text === "Android下载") {
                    //这个是安卓操作系统
                    window.location.href = this.props.settingList.DownLoadPath;
                }
                else if (this.state.text === "Ios下载") {
                    //这个是ios操作系统
                    window.location.href = "itms-services:///?action=download-manifest&url=" + this.props.settingList.IOSDownLoadPath
                }
            }
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            this.setState({
                text: "Android下载",
            })

        }
        else if (isIOS) {
            this.setState({
                text: "Ios下载"
            })
        }
        dispatch({
            type: 'user/GetAndroidOrIosSettings',
            payload: {
            }
        });

    }

    closeModel = () => {
        this.setState({
            isshow: false,
            mouseIn: false,
        })
    }

    render() {
        const { mouseIn } = this.state;
        return (
            <div>
                {this.state.isshow ? <div
                    hidden={!mouseIn}
                    style={{
                        position: 'fixed',
                        top: '0px',
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        color: 'white',
                        zIndex: 10,
                        background: 'rgba(0,0,0,0.4)',
                    }}
                >
                    <div class={styles.tipClassOne} >
                        <img class={styles.imgClass} src={ImgSrc} />
                    </div>
                    <div class={styles.tipClassTwo}>
                        <p>此软件中不能下载，请在右上角选择“在浏览器中打开”后重试！</p>
                    </div>
                    <div class={styles.tipClassTwo}>
                        <Button onClick={() => this.closeModel()}>知道了</Button>
                    </div>
                </div> : ""}
                <div class={styles.wrappers}>
                    <div class={styles.wrapperscontent}>
                        <h1 class={styles.titleStyleh1}>污染源智能分析平台</h1>
                        <h2 class={styles.titleStyleh2}>App 下载</h2>
                        <p class={styles.lead}>推荐使用浏览器或QQ直接下载</p>
                        <p class={styles.classThree}>
                            <Button type="primary" size="large" class={styles.lgs} className="button-color-sunset" onClick={() => this.QRClick()}> {this.state.text}<Icon type="download" /></Button>
                        </p>
                    </div>
                </div>
            </div>

        );
    }
}
