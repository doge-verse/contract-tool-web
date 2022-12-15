import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const routes = [
    
    {
        path: '/',
        name: 'Parser',
        loader: () => import('../pages/parser')
    },
    {
        path: '/parser',
        name: 'Parser',
        loader: () => import('../pages/parser')
    },
    
    {
        path: '/notifier',
        name: 'Notifier',
        loader: () => import('../pages/notifier')
    }
];

const createRoutes = (routes: any[]) =>
    routes.map(({ loader, ...config }) => {
        const Trunk = React.lazy(() => loader())
        return {
            ...config,
            component: (
                <React.Suspense>
                    {/* fallback={<Loading />} */}
                    <Trunk />
                </React.Suspense>
            ),
        }
    })

const RoutesPage = () => {


    return (
        <Routes>
            {createRoutes(routes).map((r) => {
                // if (r.signin)
                //     return (<Route key={r.path} path={r.path} element={
                //         <RequirAuthRoute element={r.component} pathname={r.path}></RequirAuthRoute>
                //     } />)
                return <Route key={r.path} path={r.path} element={r.component} />
            })}
        </Routes>
    )
}


export default RoutesPage