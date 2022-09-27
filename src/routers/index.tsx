import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, redirect } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

// 不需要懒加载的页面组件
import Layout from '../pages/layout'
import Permission from '../components/Permission'
import NoFind from '../pages/noFind'

// 需要懒加载的页面组件
const Home = lazy(() => import('../pages/home'))
const List = lazy(() => import('../pages/list'))
const Detail = lazy(() => import('../pages/detail'))
const Login = lazy(() => import('../pages/login'))

/**
 * @param Component 懒加载的组件
 * @param code 用于判断权限的字段(你可以自己定)
 * @returns 
 */
const LazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>, code?: string) => {
   return (
      <Permission code={code}>
         <Suspense fallback={<div>loading...</div>}>
            <Component />
         </Suspense>
      </Permission>
   )
}

export interface UserInfo {
   name: string;
   age: number;
   permissionRoutes: string[];
   code: number;
}
/**
 * @description 模拟请求用户信息
 * @returns 
 */
export const getUserInfo = (): Promise<UserInfo> => {
   return new Promise(resolve => {
      setTimeout(() => {
         resolve({
            name: 'jianjian',
            age: 12,
            permissionRoutes: ['home', 'list'],
            code: 0
         })
      }, 1000);
   })
}


/**
 * @description 这个loader函数会在路由渲染前触发,所以可以用来做路由权限控制和登陆重定向
 * @description (取代请求拦截器中的登陆重定向)
 * @description 这个loader函数返回值可以在页面中通过 useRouteLoaderData(id)或者useLoaderData获取 
 */
const rootLoader = async () => {
   console.log('页面加载前请求用户信息');
   // 这里用假的接口模拟下
   const { permissionRoutes, name, age, code } = await getUserInfo();
   // 假设20001代表登陆过期
   if(code === 20001) {
      redirect('/login')
   }
   return {
      name,
      age,
      permissionRoutes
   }
}

const routerConfig: RouteObject[] = [
   {
      path: '/',
      element: <Navigate to='/home' />
   },
   {
      path: '/',
      id: 'root',
      errorElement: <ErrorBoundary />,
      element: <Layout />,
      loader: rootLoader,
      children: [
         {
            path: '/home',
            element: LazyLoad(Home, 'home')
         },
         {
            path: '/list',
            element: LazyLoad(List, 'list')
         },
         {
            path: '/detail',
            element: LazyLoad(Detail, 'detail')
         }
      ]
   },
   {
      path: '/login',
      element: LazyLoad(Login)
   },
   {
      path: '*',
      element: <NoFind />
   }
]

export const routes = createBrowserRouter(routerConfig)