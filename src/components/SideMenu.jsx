import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Layout, Menu } from 'antd';
import { useNavigate , useLocation } from 'react-router-dom'
import {
  UserOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import './sideMenu.css'
const { Sider } = Layout;

function SideMenu(props) {

  const navigate = useNavigate()
  const [menu, setMenu] = useState([])

  const {role:{rights}} = JSON.parse(localStorage.getItem('token'))

  function handleClick(e) {
    // console.log(e)
    navigate(e.key)
  }
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then(res => {
      setMenu(res.data)
    })
  }, [])

  //判断是否属于菜单元素 => 有pagepermisson属性即为菜单栏元素
  function checkPagePermission(item) {
    return item.pagepermisson && rights.includes(item.key)
  }

  //遍历children
  function renderMenu(MenuList) {
    return MenuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return {
          key: item.key,
          label: item.title,
          icon: <UserOutlined />,      //可定义一个对象，以key为键，icon为值
          children: renderMenu(item.children)
        }
      }
      return checkPagePermission(item) && {
        key: item.key,
        label: item.title,
        icon: <UserOutlined />,
      }
    })
  }

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: 'flex', 'flexDirection': 'column', height: '100%' }}>
        <div className="logo">全球新闻发布系统</div>
        <div style={{flex:1,'overflow':'auto'}}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[useLocation().pathname]}
            defaultOpenKeys={['/'+useLocation().pathname.split('/')[1]]}
            items={renderMenu(menu)}
            onClick={handleClick}
          />
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = (state) => ({isCollapsed:state.CollApsedReducer.isCollapsed})

export default connect(mapStateToProps)(SideMenu)
