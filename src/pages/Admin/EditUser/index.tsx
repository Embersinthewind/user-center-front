import { updateUser } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { message, Select } from 'antd';
import React, { useState } from 'react';
import { history, useLocation } from 'umi';
import styles from './index.less';

const Register: React.FC = () => {
  const [type] = useState<string>('userAccount');
  // 获取url对象
  const location = useLocation();
  // 获取url参数对象
  const searchParams = new URLSearchParams(location.search);
  // 获取url中参数
  const editId = searchParams.get('editId');
  const userName = searchParams.get('userName');
  const userRole = searchParams.get('userRole');

  const userRoleOptions = [
    { label: '管理员', value: '1' },
    { label: '普通用户', value: '0' },
  ];

  // 用户编辑页面表头文字样式
  const divStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '7vh', // 设置高度为视窗的100%，使内容垂直居中
    fontSize: '24px', // 放大字号为24px
    fontWeight: 'bold', // 设置字体加粗
    color: '#1890ff',
  };
  // 表单提交
  const handleSubmit = async (values: API.UpdateUser) => {
    try {
      // 编辑用户
      const id = await updateUser(values);
      if (id > 0) {
        /** 此方法会跳转到 redirect 参数所在的位置 */
        message.success('保存成功');
        if (!history) return;
        const { query } = history.location;
        // 保存成功后跳转到管理页面
        history.push({
          pathname: '/admin/user-manage',
          query,
        });
        return;
      } else {
        throw new Error(`register error id ${id}`);
      }
      // console.log(id);
      // 如果失败去设置用户错误信息
      // setUserLoginState(id);
    } catch (error) {
      const defaultLoginFailureMessage = '修改失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div style={divStyle}>用户编辑页面</div>
        {/*在登录组件中修改按钮中的值，查看源码找到这个*/}
        <ProForm
          title="编辑用户"
          subTitle={<a>只允许您修改以下用户信息</a>}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UpdateUser);
          }}
        >
          {type === 'userAccount' && (
            <>
              <ProFormText
                name="id"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                initialValue={parseFloat(editId) | ''}
                placeholder={'请输入要修改的用户id'}
                rules={[
                  {
                    required: true,
                    message: '用户id是必填项！',
                  },
                ]}
              />
              <ProFormText
                name="userName"
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入新用户名'}
                initialValue={userName}
              />
              {/*<ProForm onFinish={handleSubmit} submitter={false} resetter={false}>*/}

              <ProForm.Item
                name="userRole"
                rules={[
                  {
                    required: true,
                    message: '用户角色是必填项！',
                  },
                ]}
              >
                <Select
                  options={userRoleOptions}
                  placeholder="请选择用户角色"
                  defaultValue={userRole}
                  style={{ width: '100%' }}
                  prefix={<LockOutlined className={styles.prefixIcon} />}
                />
              </ProForm.Item>
              {/*</ProForm>*/}
            </>
          )}
        </ProForm>
      </div>
    </div>
  );
};
export default Register;
