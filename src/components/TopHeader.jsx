import React from 'react'
import {useNavigate} from 'react-router-dom'
import { Layout, Dropdown, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { changeCollapsedAction } from '../redux/actions/Collapsed';
const { Header } = Layout;

function TopHeader(props) {

  const navigate = useNavigate()

  const {role:{roleName},username} = JSON.parse(localStorage.getItem('token'))

  const items = [
    {
      key: '1',
      label: (
        roleName
      ),
    },
    {
      key: '2',
      danger: true,
      label: '退出',
      onClick:()=>{
        localStorage.removeItem('token')
        navigate('/login')
      }
    },
  ];

  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0 16px',
      }}
    >
      {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: ()=>props.changeCollapsed(),
      })}

      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
        <Dropdown menu={{ items, }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = state => ({isCollapsed:state.CollApsedReducer.isCollapsed})

const mapDispatchToProps = {
   changeCollapsed:changeCollapsedAction
}

export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)