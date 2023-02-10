import React, { Fragment, useState, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import axios from 'axios';

import { Navigate } from "react-router-dom";
import Login from "../views/Login";
import SandBox from "../views/SandBox";
import Home from "../views/SandBox/home/Home";
import UserList from '../views/SandBox/user-manage/UserList'
import RoleList from '../views/SandBox/right-manage/RoleList'
import RightList from '../views/SandBox/right-manage/RightList'
import Nopermission from '../views/SandBox/Nopermission/Nopermission'
import NewsAdd from '../views/SandBox/news-manage/NewsAdd'
import NewsDraft from '../views/SandBox/news-manage/NewsDraft'
import NewsCategory from '../views/SandBox/news-manage/NewsCategory'
import Audit from '../views/SandBox/audit-manage/Audit'
import AuditList from '../views/SandBox/audit-manage/AuditList'
import Unpublished from '../views/SandBox/publish-manage/Unpublished'
import Published from '../views/SandBox/publish-manage/Published'
import Sunset from '../views/SandBox/publish-manage/Sunset'
import NewsPreview from '../views/SandBox/news-manage/NewsPreview';
import NewsUpdate from '../views/SandBox/news-manage/NewsUpdate';
import News from '../views/News/News';
import Detail from '../views/News/Detail';

export default function Routes() {

  const [RouterList, setRouterList] = useState([])

  useEffect(() => {
    Promise.all([
    axios.get(`http://localhost:5000/rights`),
    axios.get(`http://localhost:5000/children`)]).then(res => {
      setRouterList([...res[0].data,...res[1].data])
    })
  }, [])

  const LocalRouterMap = {
    '/home': <Home />,
    '/user-manage/list': <UserList />,
    '/right-manage/role/list': <RoleList />,
    '/right-manage/right/list': <RightList />,
    '/news-manage/add': <NewsAdd />,
    '/news-manage/draft': <NewsDraft />,
    '/news-manage/category': <NewsCategory />,
    '/news-manage/preview/:id': <NewsPreview />,
    '/news-manage/update/:id': <NewsUpdate />,
    '/audit-manage/audit': <Audit />,
    '/audit-manage/list': <AuditList />,
    '/publish-manage/unpublished': <Unpublished />,
    '/publish-manage/published': <Published />,
    '/publish-manage/sunset': <Sunset />,

  }

  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }

  const checkUserPermission = (item) => {
    if(localStorage.getItem('token')){
      const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
      return rights.includes(item.key)
    }
    // return true
  }

  function renderRouter(RouterList) {
    return RouterList.map((item) => {
      if (checkRoute(item) && checkUserPermission(item)) {
          return {
            path: item.key,
            element:LocalRouterMap[item.key]
          }
      }
      return {
        element: <Nopermission />
      }
    })
  }

  const element = useRoutes([
    {
      path: 'login',
      element: <Login />
    },
    {
      path: '/',
      element: localStorage.getItem('token') ? <SandBox /> : <Navigate to='/login' />,
      children: [
        ...renderRouter(RouterList),
        {
          path: '/',
          element: <Navigate to='home' />
        },
        RouterList.length > 0 && {
          path: '*',
          element: <Nopermission />
        }
      ]
    },
    {
      path: 'news',
      element: <News />
    },
    {
      path: 'detail/:id',
      element: <Detail />
    },
  ])

  return (
    <Fragment>
      {element}
    </Fragment>
  )
}

