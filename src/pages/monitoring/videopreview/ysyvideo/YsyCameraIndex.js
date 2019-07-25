import React, { Component, Fragment } from 'react';
import {
  Tooltip,
  Card,
  Spin,
  Divider,
  Modal,
  Form,
  message,
  Popconfirm,
  Icon,
  Button,
} from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import SdlTable from '@/components/AutoForm/Table';
import SearchWrapper from '@/components/AutoForm/SearchWrapper';
import NavigationTree from '../../../../components/NavigationTree'

@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
}))
@Form.create()
class YsyCameraIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      FormDatas: {},
    };
  }

  /** 初始化加载table配置 */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: 'CameraMonitor',
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: 'VideoCamera',
      },
    });
  }

  changeDgimn=dgimn => {

  }

  render() {
    const { dispatch, loading, match } = this.props;
    const pointDataWhere = [
      {
        Key: '[dbo]__[T_Bas_CameraMonitor]__BusinessCode',
        Value: match.params.Pointcode,
        Where: '$=',
      },
      {
        Key: '[dbo]__[T_Bas_CameraMonitor]__MonitorType',
        Value: 1,
        Where: '$=',
      },
    ];
    if (loading) {
      return (
        <Spin
          style={{
            width: '100%',
            height: 'calc(100vh/2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="large"
        />
      );
    }
    return (
      <PageHeaderWrapper>
        <div className={styles.cardTitle}>
        <NavigationTree choice={false} onItemClick={value => {
                        console.log('-------------------------------------', value);
                        if (!value[0].IsEnt) {
                        this.changeDgimn(value[0].key)
                        }
                    }} />
          <Card>
            <SearchWrapper configId="VideoCamera" />
            <SdlTable
              style={{ marginTop: 10 }}
              configId="CameraMonitor"
              searchParams={pointDataWhere}
              rowChange={(key, row) => {
                this.setState({
                  key,
                  row,
                });
              }}
              onAdd={() => {
                this.showModal();
              }}
              appendHandleRows={row => (
                <Fragment>
                  <Tooltip title="播放">
                  <a
                    onClick={() => {
                      dispatch(
                        routerRedux.push(
                          `/platformconfig/ysyshowvideo/${
                            row['dbo.T_Bas_VideoCamera.VedioCamera_ID']
                          }/${this.props.match.params.DGIMN}`,
                        ),
                      );
                    }}
                  >
                    <Icon type="play-circle" theme="twoTone" />
                  </a>
                  </Tooltip>
                </Fragment>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default YsyCameraIndex;
