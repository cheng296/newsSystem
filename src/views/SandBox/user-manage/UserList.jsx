import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Switch, Modal } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;

export default function UserList() {

  const [dataSource, setDatasource] = useState([])
  const [regionSource, setRegionsource] = useState([])
  const [roleList, setRoleList] = useState([])
  const [isModalopen, setisModalopen] = useState(false)
  const [isUpdateModalopen, setisUpdateModalopen] = useState(false)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      filters: [
        ...regionSource.map(item => {
          return {
            text: item.title,
            value: item.value
          }
        }),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',

    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => { handleChange(item) }}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} disabled={item.default}
            onClick={confirmMethod(item)} />

          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default}
            onClick={() => handleUpdate(item)} />
        </div>
      }
    }
  ];

  const handleUpdate = async (item) => {
    await setisUpdateModalopen(true)
    if (item.roleId === 1) {
      setisUpdateDisabled(true)
    } else {
      setisUpdateDisabled(false)
    }
    updateForm.current.setFieldsValue(item)

    setCurrent(item)
  }

  const handleChange = (item) => {
    item.roleState = !item.roleState
    setDatasource([...dataSource])
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const confirmMethod = (item) => {
    return () => {
      confirm({
        title: '您确定要删除此项权限吗?',
        icon: <ExclamationCircleOutlined />,
        content: '',
        onOk() {
          deleteMethod(item)
        },
        onCancel() {
        },
      });
    }
  }

  const deleteMethod = (item) => {
    setDatasource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }

  const {roleId,region,username} = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {

    const roleObj = {
      '1':'superadmin',
      '2':'admin',
      '3':'editor'
    }

    axios.get('http://localhost:5000/users?_expand=role').then((res) => {
      const list = res.data
      setDatasource(roleObj[roleId]==='superadmin'?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region && roleObj[item.roleId]==='editor')
      ])
    })
  }, [roleId,region,username])
  useEffect(() => {
    axios.get('http://localhost:5000/regions').then((res) => {
      setRegionsource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:5000/roles').then((res) => {
      setRoleList(res.data)
    })
  }, [])

  return (
    <div>
      <Button type='primary' onClick={() => { setisModalopen(true) }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
      <Modal
        open={isModalopen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisModalopen(false)
        }}
        onOk={() => {
          addForm.current.validateFields().then(values => {
            // console.log(values)
            setisModalopen(false)

            addForm.current.resetFields()

            //post到后端，生成id
            axios.post(`http://localhost:5000/users`, {
              ...values,
              "roleState": true,
              "default": false,
            }).then((res) => {
              setDatasource([...dataSource, {
                ...res.data,
                role: roleList.filter(item => item.id === res.data.roleId)[0]
              }])
              /* axios.get('http://localhost:5000/users?_expand=role').then(res=>{
                setDatasource(res.data)
              }) */
            })
          }).catch(err => {
            console.log(err)
          })

        }}
      >
        <UserForm regionSource={regionSource} roleList={roleList} ref={addForm} />
      </Modal>


      <Modal
        open={isUpdateModalopen}
        title="更新用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisUpdateModalopen(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => {
          updateForm.current.validateFields().then(values => {
            // console.log(values)
            setisUpdateModalopen(false)

            setDatasource(dataSource.map(item => {
              if (item.id === current.id) {
                return {
                  ...item,
                  ...values,
                  role: roleList.filter(item => item.id === values.roleId)[0]
                }
              }
              return item
            }))

            axios.patch(`http://localhost:5000/users/${current.id}`, values)
            setisUpdateDisabled(!isUpdateDisabled)
          }).catch(err => {
            console.log(err)
          })

        }}
      >
        <UserForm regionSource={regionSource} roleList={roleList} ref={updateForm} 
        isUpdateDisabled={isUpdateDisabled} 
        isUpdate={true}/>
      </Modal>
    </div>
  )
}
