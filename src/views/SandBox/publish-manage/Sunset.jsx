import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button, notification } from 'antd'

export default function Sunset() {

  const [dataSource,setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    axios.get(`/news?author=${username}&publishState=3&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])

  const handleDelete = (id) => {
    setDataSource(dataSource.filter(item=>item.id!==id))

    axios.delete(`/news/${id}`).then(res => {

      notification.info({
        message: `通知`,
        description:
          `您已经删除了已下线的新闻`,
        placement: 'bottomRight',
      });
    })
    
  }
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type="primary" onClick={()=>handleDelete(id)}>删除</Button>}></NewsPublish>
    </div>
  )
}
