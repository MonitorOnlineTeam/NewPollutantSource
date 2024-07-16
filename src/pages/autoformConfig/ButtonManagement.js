import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({});

const ButtonManagement = props => {
  const CONFIGID = 'ButtonManager';

  useEffect(() => {
  }, []);

  return (
    <BreadcrumbWrapper>
      <Card>
        <SearchWrapper configId={CONFIGID}></SearchWrapper>
        <AutoFormTable
          getPageConfig
          noload
          style={{ marginTop: 10 }}
          configId={CONFIGID}
          handleMode="modal"
        />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ButtonManagement);
