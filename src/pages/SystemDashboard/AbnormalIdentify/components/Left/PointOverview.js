import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Space, Button, Form, Modal } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  loading: loading.effects['AbnormalIdentifyModel/GetPwPointList'],
});

const PointOverview = props => {
  const [form] = Form.useForm();

  const { dispatch, loading, title, open, onCancel, time, regionCode, entCode } = props;

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);

  //
  const getPageData = (_pageIndex, _pageSize) => {
    let bTime = moment(time[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(time[1]).format('YYYY-MM-DD HH:mm:ss');

    // pollutantType  regionCode  entCode  pointType  pageIndex  pageSize
    let values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModel/GetPwPointList',
      payload: {
        ...values,
        pointType: 2,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: result => {
        setDataSource(result.Datas);
        setTableTotal(result.Total);
      },
    });
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getPageData(PageIndex, PageSize);
  };

  const getColumns = () => {
    const columns = [
      {
        title: '序号',
        width: 40,
      },
      {
        title: '省/市',
        dataIndex: 'regionName',
        key: 'regionName',
        ellipsis: true,
      },
      {
        title: '企业',
        dataIndex: 'entName',
        key: 'entName',
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'pointName',
        key: 'pointName',
        ellipsis: true,
      },
    ];
    return columns;
  };
  return (
    <Modal
      // title={title}
      title={'排污单位总览'}
      wrapClassName={'fullScreenModal'}
      destroyOnClose
      open={open}
      footer={false}
      bodyStyle={{ padding: 8 }}
      onCancel={onCancel}
    >
      {/* <div className={styles.PageWrapper}> */}

      <Card bordered={false}>
        <Form
          name="searchForm"
          form={form}
          layout="inline"
          initialValues={{
            RegionCode: regionCode,
            EntCode: entCode,
          }}
          autoComplete="off"
          style={{ marginBottom: 10 }}
        >
          <Form.Item label="行政区" name="RegionCode">
            <RegionList noFilter style={{ width: 140 }} />
          </Form.Item>
          {/* <Form.Item label="行业" name="IndustryType">
                <SearchSelect
                  placeholder="排口所属行业"
                  style={{ width: 130 }}
                  configId={'IndustryType'}
                  itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
                  itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
                />
              </Form.Item> */}
          <Form.Item label="企业" name="EntCode">
            <EntAtmoList regionCode={form.getFieldValue('regionCode')} style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  handleTableChange(1, 50);
                }}
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <SdlTable
          loading={loading}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          pagination={{
            total: tableTotal,
            pageSize: pageSize,
            current: pageIndex,
            showSizeChanger: false,
            showQuickJumper: true,
            onChange: handleTableChange,
          }}
          // scroll={{ y: 'calc(100vh - )' }}
        />
      </Card>
    </Modal>
  );
};

export default connect(dvaPropsData)(PointOverview);
