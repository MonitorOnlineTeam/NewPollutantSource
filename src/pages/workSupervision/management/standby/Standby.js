import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { Card, Col, Row, Button, Space, Select, DatePicker, message, Tag, Radio } from 'antd';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import AutoFormAddModal from '@/pages/AutoFormManager/AutoFormAddModal';
import AutoFormEditModal from '@/pages/AutoFormManager/AutoFormEditModal';
import Cookie from 'js-cookie';

const CONFIGID = 'T_Bas_StandbyMachine';
const dvaPropsData = ({ loading, autoform }) => ({
  autoform: autoform,
});

const Standby = props => {
  const { dataTrustDataSource, dataTrustTotal, loading, exportLoading } = props;
  const [pageSize, setPageSize] = useState(20);
  const [handleAddVisible, setHandleAddVisible] = useState(false);
  const [handleEditVisible, setHandleEditVisible] = useState(false);
  const [keyParams, setKeyParams] = useState({});

  useEffect(() => {
    const currentUserStr = Cookie.get('currentUser');
    console.log('autoform', props.autoform);
  }, []);

  // 关闭操作弹窗
  const onHandleCancel = () => {
    setHandleAddVisible(false);
    setHandleEditVisible(false);
  };

  const currentUserStr = Cookie.get('currentUser');
  let currentUser = {};
  if (currentUserStr) {
    currentUser = JSON.parse(currentUserStr);
  }

  return (
    <BreadcrumbWrapper>
      <Card>
        <SearchWrapper configId={CONFIGID} />
        <AutoFormTable
          noload
          getPageConfig
          handleMode="modal"
          style={{ marginTop: 10 }}
          configId={CONFIGID}
          isFixedOpera
          isCenter
          // searchParams={searchParams}
          onAdd={(record, key) => {
            setHandleAddVisible(true);
          }}
          onEdit={(record, key) => {
            let keyParam = {
              'dbo.T_Bas_StandbyMachine.ID': record['dbo.T_Bas_StandbyMachine.ID'],
            };
            setHandleEditVisible(true);
            setKeyParams(keyParam);
          }}
        />
        <AutoFormAddModal
          configId={CONFIGID}
          visible={handleAddVisible}
          width={800}
          onCancel={onHandleCancel}
          successCallback={onHandleCancel}
          appendFormData={{
            CreateUser: currentUser.UserId,
            CreateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            UpdateUser: currentUser.UserId,
            UpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          }}
        />
        <AutoFormEditModal
          configId={CONFIGID}
          visible={handleEditVisible}
          width={800}
          keysParams={keyParams}
          onCancel={onHandleCancel}
          successCallback={onHandleCancel}
          appendFormData={{
            UpdateUser: currentUser.UserId,
            UpdateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          }}
        />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Standby);
