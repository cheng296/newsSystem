import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, Spin } from 'antd';
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './SandBox.css'
import { useEffect } from 'react';
import { connect } from 'react-redux';
const { Content } = Layout;

function SandBox(props) {
  NProgress.start()
  useEffect(()=>{
    NProgress.done()
  })
  return (
    <Layout>
      <SideMenu />

      <Layout className="site-layout">
        <TopHeader />

        <Spin size="large" spinning={props.spining}>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          <Outlet/>
        </Content>
        </Spin>
        
      </Layout>

    </Layout>
  )
}

const mapStateToProps = (state) => ({spining:state.SpiningReducer.spining})

export default connect(mapStateToProps)(SandBox)
