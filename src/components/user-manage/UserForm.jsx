import React from 'react'
import { Form, Input, Select } from 'antd'
import { forwardRef, useState, } from 'react'
import { useEffect } from 'react'

const UserForm = forwardRef((props, ref) => {

  const [isDisabled, setDisabled] = useState(false)

  useEffect(() => {
    setDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  const { roleId, region} = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    '1': 'superadmin',
    '2': 'admin',
    '3': 'editor'
  }
  const checkRegionDisabled = (item) => {
    if (props.isUpdate) {
      //更新
      if (roleObj[roleId]==='superadmin'){
        return false
      }else{
        return true
      }
    } else {
      if (roleObj[roleId]==='superadmin'){
        return false
      }else{
        return item.value !== region
      }
    }
  }
  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {
      //更新
      if (roleObj[roleId]==='superadmin'){
        return false
      }else{
        return true
      }
    } else {
      if (roleObj[roleId]==='superadmin'){
        return false
      }else{
        return item.id !== 3
      }
    }
  }

  return (
    <Form
      ref={ref}
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名："
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码："
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域："
        rules={isDisabled ? [] : [{
          required: true,
          message: 'Please input the title of collection!',
        }]}
      >
        <Select
          options=
          {
            props.regionSource.map((item) => {
              return {
                value: item.value,
                label: item.value,
                disabled: checkRegionDisabled(item)
              }
            })
          }
          disabled={isDisabled} />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色："
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select
          options={props.roleList.map((item) => {
            return {
              value: item.id,
              label: item.roleName,
              disabled:checkRoleDisabled(item)
            }
          })}
          onChange={(value) => {
            if (value === 1) {
              setDisabled(true)
              ref.current.setFieldsValue({
                region: ''
              })
            } else {
              setDisabled(false)
            }
          }} />
      </Form.Item>
    </Form>
  )
})
export default UserForm

