import React, { Component, Fragment } from 'react';
import {
    Card, Spin, Modal, Button, Form,
} from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import SdlTable from '../../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../../AutoFormManager/SearchWrapper';
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { handleFormData } from '@/utils/utils';


@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
}))
@Form.create()
 class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pointDataWhere: [],
            visible: false,
            uid: cuid(),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UserID !== this.props.UserID) {
            {
               const pointDataWhere = [{
                     Key: '[dbo]__[T_Bas_CertificateInfo]__User_ID',
                     Value: nextProps.UserID,
                     Where: '$=',
                   },
                 ];
                 this.setState({
                     pointDataWhere,
                 }, () => {
                     this.reloadPage()
                 })
            }
        }
    }

    reloadPage = () => {
        const { dispatch, configId } = this.props;
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

    /** 保存核实单 */
    handleOk = e => {
      const {
        dispatch,
        form,
        DGIMN,
        configId,
      } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values, this.state.uid);
          formData.PointCode = DGIMN;
          dispatch({
            type: 'operationsysmanage/AddEquipmentInfo',
            payload: {
              configId,
              FormData: formData,
              callback: result => {
                  if (result.IsSuccess) {
                      this.setState({
                          visible: false,
                      }, () => {
                          this.reloadPage();
                      })
                  }
              },
            },
          });
        }
      });
    };

    render() {
        console.log('this.props', this.props);
        const { configId } = this.props;
        const { pointDataWhere } = this.state;
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
                <div>
                    <Card>
                        <SearchWrapper
                            onSubmitForm={form => this.loadReportList(form)}
                            configId={configId}
                        ></SearchWrapper>
                        <SdlTable
                            style={{ marginTop: 10 }}
                            configId={configId}
                            parentcode="ddd"
                            searchParams={pointDataWhere}
                            appendHandleButtons={(selectedRowKeys, selectedRows) => <Fragment>
                                <Button icon="plus" type="primary" onClick={() => {
                                    this.setState({
                                        visible: true,
                                    })
                                }}>添加</Button>
                              </Fragment>}
                            {...this.props}
                        >
                        </SdlTable>
                        <Modal
                              title="添加"
                              visible={this.state.visible}
                              destroyOnClose // 清除上次数据
                              onOk={this.handleOk}
                              okText="保存"
                              cancelText="关闭"
                              onCancel={() => {
                                this.setState({
                                  visible: false,
                                });
                              }}
                              width="50%"
                            >
                              <SdlForm configId={configId} form={this.props.form} hideBtns noLoad />
                        </Modal>
                    </Card>
                </div>
        );
    }
}
export default Index;
