import React, { useState, useRef } from 'react';
import {
  Steps,
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  message,
  Alert,
  Typography,
  Modal,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  MailOutlined,
  ReloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import RCaptcha from 'react-captcha-code';
import styles from './style.less';

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

const ResetPassword = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('user****@163.com');
  const [countdown, setCountdown] = useState(0);
  const [verificationError, setVerificationError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const captchaRef = useRef(null);
  const contentRef = useRef(null);

  // 刷新图片验证码
  const refreshCaptcha = () => {
    if (captchaRef.current) {
      captchaRef.current.refresh();
    }
  };

  // 验证码变化时的回调
  const handleCaptchaChange = captcha => {
    setCaptchaCode(captcha);
  };

  // 模拟发送验证码
  const sendVerificationCode = () => {
    message.success(`验证码已发送至邮箱: ${email}`);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  // 第一步：找回密码
  const handleFindAccount = values => {
    // 验证用户名和图片验证码
    if (values.username && values.captcha.toLowerCase() === captchaCode.toLowerCase()) {
      setUsername(values.username);
      setUsernameError(false);
      setCurrent(1);
    } else {
      setUsernameError(true);
      refreshCaptcha(); // 验证失败时刷新验证码
    }
  };

  // 第二步：验证
  const handleVerify = values => {
    // 模拟验证码验证
    if (values.verificationCode === '123456') {
      setVerificationError(false);
      setCurrent(2);
    } else {
      setVerificationError(true);
    }
  };

  // 第三步：重置密码
  const handleResetPassword = values => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    // 模拟重置密码请求
    message.success('密码重置成功');
    setCurrent(3);
  };

  // 返回登录页
  const handleReturnToLogin = () => {
    // 跳转到登录页
    window.location.href = '/user/login';
  };

  // 打印内容区域
  const handlePrint = () => {
    const printContent = contentRef.current;
    const originalContents = document.body.innerHTML;
    
    // 创建打印样式
    const printStyles = `
      <style>
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    `;
    
    // 添加打印样式和内容
    document.body.innerHTML = printStyles + printContent.outerHTML;
    
    // 执行打印
    window.print();
    
    // 恢复原始内容
    document.body.innerHTML = originalContents;
    
    // 重新绑定事件（因为innerHTML替换会丢失事件绑定）
    window.location.reload();
  };

  const renderStepOne = () => {
    return (
      <Form form={form} onFinish={handleFindAccount} layout="vertical">
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input
            // prefix={<UserOutlined />}
            placeholder="请输入用户名"
            size="large"
          />
        </Form.Item>

        <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
          <Row gutter={8}>
            <Col span={16}>
              <Input placeholder="请输入验证码" size="large" />
            </Col>
            <Col span={8}>
              <div className={styles.captchaContainer}>
                <RCaptcha
                  ref={captchaRef}
                  width={120}
                  height={40}
                  fontSize={18}
                  length={4}
                  onChange={handleCaptchaChange}
                  className={styles.captchaImage}
                />
                <Button
                  type="link"
                  icon={<ReloadOutlined />}
                  onClick={refreshCaptcha}
                  className={styles.refreshButton + ' no-print'}
                >
                  刷新
                </Button>
              </div>
            </Col>
          </Row>
        </Form.Item>

        {usernameError && (
          <Alert message="验证码不正确！" type="error" showIcon style={{ marginBottom: 24 }} />
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" className="no-print">
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const renderStepTwo = () => {
    return (
      <Form form={form} onFinish={handleVerify} layout="vertical">
        <Alert
          message={
            <div>
              您在平台未绑定邮箱，无法通过邮箱找回密码，请登录系统网页
              <br />
              点击右上角账户名称进入个人中心绑定邮箱！
            </div>
          }
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Paragraph>
          验证码已发送至邮箱：{email}
          <br />
          （请输入邮箱中的验证码进行重置密码，验证码有效期为24小时）
        </Paragraph>

        <Form.Item name="verificationCode" rules={[{ required: true, message: '请输入验证码' }]}>
          <Input
            placeholder="请输入验证码"
            size="large"
            suffix={
              <Button type="link" disabled={countdown > 0} onClick={sendVerificationCode} className="no-print">
                {countdown > 0 ? `重新获取(${countdown}s)` : '获取验证码'}
              </Button>
            }
          />
        </Form.Item>

        {verificationError && (
          <Alert message="验证码不正确！" type="error" showIcon style={{ marginBottom: 24 }} />
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" className="no-print">
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const renderStepThree = () => {
    return (
      <Form form={form} onFinish={handleResetPassword} layout="vertical">
        <Paragraph style={{ marginBottom: 24 }}>
          验证码已发送至邮箱：{email}
          <br />
          （请输入邮箱中的验证码进行重置密码，验证码有效期为24小时）
        </Paragraph>

        <Form.Item name="verificationCode" rules={[{ required: true, message: '请输入验证码' }]}>
          <Input placeholder="请输入验证码" size="large" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: '请输入新密码' },
            {
              pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
              message: '密码必须包含小写字母、数字和特殊字符',
            },
          ]}
        >
          <Input.Password placeholder="请输入新密码" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请确认新密码" size="large" />
        </Form.Item>

        <Alert
          message="密码必须包含小写字母和数字，特殊字符"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" className="no-print">
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const renderStepFour = () => {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Title level={4}>密码重置成功！</Title>
        <Button type="primary" size="large" onClick={handleReturnToLogin} className="no-print">
          返回登录
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (current) {
      case 0:
        return renderStepOne();
      case 1:
        return renderStepTwo();
      case 2:
        return renderStepThree();
      case 3:
        return renderStepFour();
      default:
        return null;
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        onClick={() => {
          setOpen(true);
        }}
      >
        忘记密码?
      </a>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={false}
        wrapClassName="fullScreenModal"
        bodyStyle={{ height: '100%', overflow: 'hidden' }}
      >
        <div className={styles.resetPasswordContainer}>
          <Card 
            bordered={false} 
            className={styles.resetPasswordCard}
            extra={
              <Button 
                type="primary" 
                icon={<PrinterOutlined />} 
                onClick={handlePrint}
                className="no-print"
              >
                打印
              </Button>
            }
          >
            <Title level={2} className={styles.title}>
              重置密码
            </Title>
            <Steps current={current} className={styles.steps}>
              <Step title="找回密码" />
              <Step title="验证" />
              <Step title="重置密码" />
              <Step title="完成" />
            </Steps>

            <div className={`${styles.stepsContent} print-content`} ref={contentRef}>
              {renderContent()}
            </div>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default ResetPassword;
