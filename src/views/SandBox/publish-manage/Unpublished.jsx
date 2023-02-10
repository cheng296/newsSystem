import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button, notification } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Unpublished() {

  const navigate = useNavigate()

  const [dataSource,setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    axios.get(`/news?author=${username}&publishState=1&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])

  const handlePublish = (id) => {
    setDataSource(dataSource.filter(item=>item.id!==id))

    axios.patch(`/news/${id}`,{
      publishState:2,
      publishTime:Date.now()
    }).then(res => {

      navigate('/publish-manage/published')
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已发布】中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type="primary" onClick={()=>handlePublish(id)}>发布</Button>}></NewsPublish>
    </div>
  )
}
