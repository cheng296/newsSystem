import React, { useCallback } from 'react'
import {useNavigate} from 'react-router-dom'
import { Form, Input, Button,message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import axios from 'axios'
import './index.css'

export default function Login() {

  const navigate = useNavigate()
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);


  const onFinish = (values) => {
    axios.get(`http://localhost:5000/users?username=${values
      .username}&password=${values.password}&roleType=true&_expand=role`).then(res => {
        if (res.data.length !== 0){
          localStorage.setItem('token',JSON.stringify(res.data[0]))
          navigate('/')
        }else{
          message.error('用户名或密码不匹配')
        }
    })
  }
  return (
    <div style={{ backgroundColor: 'rgb(35,39,65)', height: '100%' }}>
      <Particles id="tsparticles" init={particlesInit} />
      <div className='formContainer'>
        <div className='title'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
