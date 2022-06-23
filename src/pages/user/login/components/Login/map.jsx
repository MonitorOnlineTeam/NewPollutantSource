import { LockOutlined, MailOutlined, MobileOutlined, UserOutlined,AuditOutlined,} from '@ant-design/icons';
import React from 'react';
import styles from './index.less';
export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      prefix: <UserOutlined className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: 'Please enter username!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LockOutlined className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <MobileOutlined className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <MailOutlined className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
  VerificaCode: {
    props: {
      size: 'large',
      id: 'verificaCode',
      prefix: <AuditOutlined className={styles.prefixIcon} />,
      placeholder: '请输入验证码',
    },
    rules:[
      {
        required: true,
        message: '请输入验证码',
      },
      {
        pattern:  /^[A-Za-z0-9]{4}$/,
        message: '请输入4位数的验证码!',
      },
    ]
  },
};
