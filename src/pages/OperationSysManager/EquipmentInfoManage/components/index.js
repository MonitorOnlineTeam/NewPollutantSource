import React, { Component, Fragment } from 'react';
import {
    Card, Spin, Modal, Button, Form,
} from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import SdlTable from '../../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../../AutoFormManager/SearchWrapper';
import SdlForm from '../../../AutoFormManager/SdlForm'
import { handleFormData } from '@/utils/utils';

@Form.create()
@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
}))

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
        if (nextProps.DGIMN !== this.props.DGIMN) {
            {
                debugger;
               const pointDataWhere = [{
                     Key: '[dbo]__[T_Bas_EquipmentInfo]__PointCode',
                     Value: nextProps.DGIMN,
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
        debugger;
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
      } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values, this.state.uid);
          formData.PointCode = DGIMN;
          dispatch({
            type: 'operationsysmanage/AddEquipmentInfo',
            payload: {
              configId: 'ExceptionVerify',
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
                            searchParams={pointDataWhere}
                            appendHandleButtons={(selectedRowKeys, selectedRows) => <Fragment>
                                <Button icon="plus" type="primary" onClick={() => {
                                    debugger;
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
                              <SdlForm configId={configId} form={this.props.form} hideBtns >
                              </SdlForm>
                        </Modal>
                    </Card>
                </div>
        );
    }
}
export default Index;
