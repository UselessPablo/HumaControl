import React from "react";
import {Routes, Route, HashRouter, BrowserRouter } from 'react-router-dom';
import App from "./App";
import Alumnos from "./Alumnos";
import Pagos from "./Pagos";
import Clases from "./Clases";
import VentaVarios from './VentaVarios'


const Router = ()=> (
    <HashRouter>
<Routes>
<Route path='/' element={<App/>}/>
<Route path='/Alumnos' element={<Alumnos/>}/>
<Route path='/Pagos' element={<Pagos/>}/>
<Route path="/Clases"  element={<Clases/>}/>
<Route path="/VentaVarios" element={<VentaVarios/>}/>

</Routes>


    </HashRouter>
)

export default Router;