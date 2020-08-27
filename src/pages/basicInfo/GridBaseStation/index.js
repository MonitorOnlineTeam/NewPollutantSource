import React, { Component, Fragment } from 'react';
import {
  Card, Spin, Modal, Button, Form, Divider, Tooltip, Popconfirm, Icon, message,
} from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import SdlTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import SdlForm from '../SdlForm'
import { handleFormData } from '@/utils/utils';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import {
  DelIcon, EditIcon,
} from '@/utils/icon';
import { router } from 'umi';
/**
 * VOC点位管理
 */
@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  btnisloading: loading.effects['autoForm/add'],
  btnisloading1: loading.effects['autoForm/saveEdit'],
}))
@Form.create()
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      Evisible: false,
      keysParams: null,
      AttachmentID: '',
      ID: '',
      title: '',
    };
  }

  /** 初始化加载 */
  componentDidMount() {
    const {
      configId,
    } = this.props.match.params;
    this.reloadPage(configId);
  }

  /** 加载autoform */
  reloadPage = configId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'autoForm/updateState',
      payload: {
        routerConfig: configId,
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId,
      },
    })
  }

  updateModel = (rowmodel) => {
    debugger
    const { dispatch } = this.props;
    dispatch({
      type: 'surfaceWater/updateState',
      payload: {
        rowmodel,
      },
    })
  }
  //删除数据
  delRowData(PointCode) {
    const { dispatch } = this.props;
    const { configId } = this.props.match.params;
    dispatch({
      type: 'surfaceWater/DeletePoint',
      payload: {
        PointCode,
        callback: result => {
          if (result.Datas === 1) {
            dispatch({
              type: 'autoForm/getAutoFormData',
              payload: {
                configId,
              },
            })
            message.success("删除成功!")
          }
          else {
            message.error("删除失败");
          }
        },
      },
    });
  }

  render() {
    const { btnisloading, btnisloading1 } = this.props;
    const { configId, EntName } = this.props.match.params;
    if (this.props.loading) {
      return (<Spin
        style={{
          width: '100%',
          height: 'calc(100vh/2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        size="large"
      />);
    }
    return (
      <BreadcrumbWrapper title="网格化监测点管理">
        <Card>
          <SearchWrapper
            onSubmitForm={form => this.loadReportList(form)}
            configId={configId}
          ></SearchWrapper>
          <SdlTable
            style={{ marginTop: 10 }}
            configId={configId}
            parentcode="ddd"
            appendHandleButtons={(selectedRowKeys, selectedRows) => <Fragment>
              <Button icon="plus" type="primary" onClick={() => {
                this.updateModel(null);
                router.push(`/basicInfo/${configId}/${configId}/GridBaseStationAdd/${configId}`)
              }}>添加</Button>
            </Fragment>
            }
            appendHandleRows={row => <Fragment>
              <Divider type="vertical" />
              <Tooltip title="编辑">
                <a onClick={() => {
                  this.updateModel(row);
                  router.push(`/basicInfo/${configId}/${configId}/GridBaseStationAdd/${configId}`)
                }}><EditIcon /></a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  placement="left"
                  title="确认是否删除?"
                  onConfirm={() => {
                    this.delRowData(row['dbo.T_Bas_CommonPoint.PointCode']);
                  }}
                  okText="是"
                  cancelText="否">
                  <a href="#"><DelIcon /></a>
                </Popconfirm>
              </Tooltip>
            </Fragment>}
            parentcode="platformconfig"
            {...this.props}
          >
          </SdlTable>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
export default index;
