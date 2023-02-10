import React from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './News.css'
import { useEffect } from 'react';
import { useRef } from 'react'
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Option } = Select;

export default function NewsAdd(props) {
  const navigate = useNavigate()

  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])

  const [formInfo, setFormInfo] = useState({})
  const [formContent, setFormContent] = useState('')

  const user = JSON.parse(localStorage.getItem('token'))

  const newsForm = useRef(null)

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  const handleNext = () => {
    if (current === 0) {
      newsForm.current.validateFields().then(res => {
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
      if (formContent === '' || formContent.trim() === '<p></p>') {
        message.error('新闻内容不能为空！')
      } else {
        setCurrent(current + 1)
      }

    }
  }
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const handleSave = (auditState) => {
    axios.post('http://localhost:5000/news', {
      ...formInfo,
      "content": formContent,
      "region": user.region ? user.region : '全球',
      "author": user.username,
      "roleId": user.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      "publishTime": 0
    }).then(res => {

      navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }

  useEffect(() => {
    axios.get('/categories').then(res => {
      setCategoryList(res.data)
    })
  }, [])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps
        current={current}
        items={[
          {
            title: '基本信息',
            description: '新闻标题，新闻分类',
          },
          {
            title: '新闻内容',
            description: '新闻主题内容',
          },
          {
            title: '新闻提交',
            description: '保存草稿或者提交审核',
          },
        ]}
      />

      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : 'hidden'}>
          <Form {...layout} name="control-hooks" ref={newsForm}>
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[
                {
                  required: true,
                  message: 'Please input your title!'
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="categoryId"
              label="新闻分类"
              rules={[
                {
                  required: true,
                  message: 'Please select your category!'
                },
              ]}
            >
              <Select>
                {
                  categoryList.map((item) => {
                    return <Option value={item.id} key={item.id}>{item.title}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : 'hidden'}>
          <NewsEditor getContent={(value) => {
            setFormContent(value)
          }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : 'hidden'}></div>
      </div>

      <div style={{ marginTop: '50px' }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrevious}>上一步</Button>
        }
      </div>
    </div>
  )
}


