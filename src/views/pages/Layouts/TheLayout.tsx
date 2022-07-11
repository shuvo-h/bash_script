import React, { Suspense } from 'react';
import {Routes,Route} from "react-router-dom";
import { privateRoutes } from '../../../routes/privateRoutes';
import { publicRoutes } from '../../../routes/publicRoutes';
import PrivateRoute from '../../components/sharedComponents/PrivateRoute/PrivateRoute';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';

const TheLayout = () => {
    // if I need more protected route
    // publicRoutes.map((route,idx)=> <Route path={route.path} element={<PrivateRoute><route.Component></route.Component></PrivateRoute>}></Route>)
    return (
        <main>
            <Suspense fallback={<>Loading suspence loader....</>}>
                <Routes>
                    <Route path='/' element={<PublicLayout></PublicLayout>}>
                        {
                            publicRoutes.map((route,idx)=> <Route path={route.path} element={<route.Component></route.Component>} key={`route-${idx}`}></Route>)
                        }
                    </Route>
                     <Route path='/my-order' element={<PrivateRoute><PrivateLayout></PrivateLayout></PrivateRoute>}>
                        {
                            privateRoutes.map((route,idx)=> <Route path={route.path} element={<route.Component></route.Component>}  key={`routeP-${idx}`}></Route>)
                        }
                    </Route> 
                </Routes>
            </Suspense>
        </main>
        
    );
};

export default TheLayout;