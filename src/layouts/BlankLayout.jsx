import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect } from 'dva';

const Layout = ({ children, loading }) => {
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
