import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { currentUser, deleteUser, searchUsers } from '@/services/ant-design-pro/api';
import { message, Modal } from 'antd';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true,
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    render: (_, record) => (
      <div>
        <img src={record.avatarUrl} width={50} height={50}></img>
      </div>
    ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '男',
      },
      1: {
        text: '女',
      },
    },
  },
  {
    title: '用户账户',
    dataIndex: 'userAccount',
    copyable: true,
  },
  {
    title: '玩家编号',
    dataIndex: 'playerCode',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: '用户状态',
    dataIndex: 'userStatus',
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '普通用户',
        status: 'Default',
      },
      1: {
        text: '管理员',
        status: 'Success',
      },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    copyable: true,
  },

  {
    title: '操作',
    valueType: 'option',
    key: 'option',

    render: (text, record, _, action) => [
      //编辑按钮
      <a
        key="configUser"
        onClick={() => {
          window.location.href = `/admin/edit-user?editId=${record.id}&userName=${record.username}&userRole=${record.userRole}`;
        }}
      >
        修改
      </a>,

      //删除按钮
      <a
        key="deleteUser"
        onClick={async () => {
          const loginUser = await currentUser();
          Modal.confirm({
            title: '确认删除',
            content: `您确定要删除${record.username}吗？`,
            okText: '确认',
            cancelText: '取消',
            async onOk() {
              if (loginUser?.data?.id !== record?.id) {
                // 调用删除接口
                if (record?.id != null) {
                  deleteUser(record?.id).then(() => {
                    message.success('删除成功');
                    // 删除操作成功后重定向到当前页面
                    window.location.href = window.location.href;
                  });
                }
              } else {
                message.error('你不能删除自己！');
              }
            },
          });
        }}
      >
        删除
      </a>,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      // @ts-ignore
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        await waitTime(2000);
        const userList = await searchUsers();
        return {
          data: userList,
        };
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          // @ts-ignore
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="用户列表"
      toolBarRender={() => []}
    />
  );
};
