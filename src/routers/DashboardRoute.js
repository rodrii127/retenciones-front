import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import MenuLateral from "../componentes/MenuLateral/MenuLateral.jsx";
import { UserContext } from "../componentes/Contexto/UserContext";

export const DashboardRoute = () => {
   const { user } = useContext(UserContext);
   return (
      <>
         <Routes>
            <Route path="/*" element={<MenuLateral user={user} />} />
            <Route
               path="/proveedor"
               element={<MenuLateral user={user} selection={"3"} />}
            />
            <Route
               path="/orden-pago"
               element={
                  <MenuLateral
                     user={user}
                     selection={"4"}
                     subSelection={"sub2"}
                  />
               }
            />
            <Route
               path="/nueva-factura"
               element={
                  <MenuLateral
                     user={user}
                     selection={"1"}
                     subSelection={"sub1"}
                  />
               }
            />
            <Route
               path="/ver-facturas"
               element={
                  <MenuLateral
                     user={user}
                     selection={"2"}
                     subSelection={"sub1"}
                  />
               }
            />
            <Route
               path="/retenciones"
               element={
                  <MenuLateral
                     user={user}
                     selection={"5"}
                     subSelection={"sub3"}
                  />
               }
            />
         </Routes>
      </>
   );
};
