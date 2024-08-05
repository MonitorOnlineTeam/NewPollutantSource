import React, { useState, useEffect } from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect } from 'dva';

const Layout = ({ children, loading, dispatch }) => {
  useEffect(() => {
    dispatch({
      type: 'global/updateState',
      payload: {
        clientHeight: document.body.clientHeight,
      },
    });
     //获取行政区列表
     dispatch({
      type: 'autoForm/getRegions',
      payload: { PointMark: '2', RegionCode: '' },
    });
  }, []);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      <div>{children}</div>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['global/getSystemConfigInfo'],
}))(Layout);
