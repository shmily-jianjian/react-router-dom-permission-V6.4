import { Button, Space } from 'antd'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'

const btnData = [
   {
      label: '首页',
      path: '/home'
   },
   {
      label: '列表',
      path: '/list'
   },
   {
      label: '详情',
      path: '/detail'
   },
   {
      label: '登陆',
      path: '/login'
   },
   {
      label: '404',
      path: '/404'
   }
]

const Layout = () => {
   const location = useLocation();
   const navigate = useNavigate();
   return <div>
   <Space>
      {
         btnData.map(item => <Button key={item.path} type='primary' onClick={() => {
            if(location.pathname === item.path) {
               return
            }
            navigate(item.path)
         }}>{item.label}</Button>)
      }
   </Space>
   <Outlet />
</div>
}

export default Layout