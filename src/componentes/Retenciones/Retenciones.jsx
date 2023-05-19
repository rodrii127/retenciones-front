import React, { useContext, useEffect, useState } from "react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";

import { KeyboardDatePicker } from "@material-ui/pickers";

import esLocale from "date-fns/locale/es";
import { InputBuscador } from "../OtrosComponentes/InputBuscador";
import { TablaRetenciones } from "../OtrosComponentes/TablaRetenciones";

import { Loading } from "../OtrosComponentes/Loading";
import {
   retentionMunicipalityCsvUri,
   retentionTypeUri,
   retentionUri,
} from "../../utils/UrlUtils";
import { types } from "../../types/types";
import { errorAlert, mensajeArriba } from "../Alerts/SweetAlert";
import { UserContext } from "../Contexto/UserContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/DateUtils";
import { getCompanyName } from "../../utils/TokenUtils";
import { Button } from "antd";

export const Retenciones = () => {
   const { user, dispatch } = useContext(UserContext);

   const navigate = useNavigate();

   const [flag, setFlag] = useState(true);

   const [flagBusqueda, setFlagBusqueda] = useState(false);

   const [retentionTypeList, setRetentionTypeList] = useState([]);

   const [selectedDateDesde, handleDateChangeDesde] = useState(new Date());

   const [selectedDateHasta, handleDateChangeHasta] = useState(new Date());

   const [retentionList, setRetentionList] = useState([]);

   useEffect(() => {
      fetch(retentionTypeUri, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
         },
      })
         .then((res) => {
            if (res.status >= 400) {
               if (res.status === 401) {
                  dispatch({ type: types.logout });
                  errorAlert("Se venció la sesión actual.");
                  navigate("/login", { replace: true });
               } else if (res.status === 404) {
                  errorAlert("No existen tipos de retenciones creados.");
                  navigate("/");
               }
            }
            return res.json();
         })
         .then((res) => {
            setRetentionTypeList(
               res.map((retentionType) => {
                  return {
                     id: retentionType.id,
                     nombre: retentionType.description,
                  };
               })
            );
            setFlag(false);
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   const getParameters = () => {
      return {
         startDate: formatDate(selectedDateDesde),
         endDate: formatDate(selectedDateHasta),
         idRetentionType: document
            .querySelector(".input_buscador .caja_contenedor input")
            .getAttribute("valueId"),
      };
   };

   const getRetentionUri = (url) => {
      const parameters = getParameters();
      if (!parameters.idRetentionType) {
         return "";
      }
      return url
         .concat("?startDate=")
         .concat(parameters.startDate)
         .concat("&endDate=")
         .concat(parameters.endDate)
         .concat("&idRetentionType=")
         .concat(parameters.idRetentionType);
   };

   const findRetentions = () => {
      setFlagBusqueda(true);

      const retentionUriWithParams = getRetentionUri(retentionUri);
      if (!retentionUriWithParams) {
         errorAlert("Por favor, seleccione un tipo de retención.");
         setFlagBusqueda(false);
         return;
      }

      fetch(retentionUriWithParams, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
         },
      })
         .then((res) => {
            if (res.status >= 400) {
               if (res.status === 401) {
                  dispatch({ type: types.logout });
                  errorAlert("Se venció la sesión actual.");
                  navigate("/login", { replace: true });
               } else if (res.status === 404) {
                  errorAlert("No existen retenciones creadas.");
               }
            }
            return res.json();
         })
         .then((res) => {
            setRetentionList(
               res.map((retention) => {
                  return {
                     date: retention.date,
                     provider: retention.provider,
                     number: retention.number,
                     retentionAmount: retention.retentionAmount,
                  };
               })
            );
            setFlag(false);
         })
         .catch((err) => {
            console.log(err);
         });
      setFlagBusqueda(false);
   };

   const getRetentionCsv = () => {
      setFlag(true);

      if (!retentionList.length) {
         errorAlert("Por favor, busque las retenciones.");
         setFlag(false);
         return;
      }

      fetch(getRetentionUri(retentionMunicipalityCsvUri), {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
         },
      })
         .then((response) => response.blob())
         .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "retenciones.txt";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();
            mensajeArriba("success", "Descargado con éxito");
            setRetentionList([]);
            setFlag(false);
         })
         .catch((err) => {
            console.log(err);
            setRetentionList([]);
            setFlag(false);
         });
   };

   return (
      <div className="retenciones">
         <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            {flag ? (
               <Loading
                  estilo={{
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                     height: "100vh",
                  }}
                  ancho={"150"}
               />
            ) : (
               <div className="busqueda_factura">
                  <div
                     className="titulo"
                     style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                     }}
                  >
                     <div>Generar Informe de Retenciones:</div>
                     <div> {getCompanyName(user.token)} </div>
                     <div></div>
                  </div>
                  <div className="contenido">
                     <div
                        className="criterio_busqueda"
                        style={{ display: "flex", alignItems: "center" }}
                     >
                        <div
                           className="rango_fecha"
                           style={{ display: "flex", alignItems: "center" }}
                        >
                           <div className="desde">
                              <div className="titulo_desde"> Desde: </div>
                              <KeyboardDatePicker
                                 autoOk
                                 variant="inline"
                                 inputVariant="outlined"
                                 label=""
                                 format="yyyy-MM-dd"
                                 value={selectedDateDesde}
                                 InputAdornmentProps={{
                                    position: "start",
                                 }}
                                 onChange={(date) =>
                                    handleDateChangeDesde(date)
                                 }
                                 InputProps={{
                                    style: {
                                       height: "34px",
                                       padding: 0,
                                    },
                                 }}
                              />
                           </div>
                           <div
                              className="hasta"
                              style={{ marginLeft: "20px" }}
                           >
                              <div className="titulo_hasta"> Hasta: </div>
                              <KeyboardDatePicker
                                 autoOk
                                 variant="inline"
                                 inputVariant="outlined"
                                 label=""
                                 format="yyyy-MM-dd"
                                 value={selectedDateHasta}
                                 InputAdornmentProps={{
                                    position: "start",
                                 }}
                                 onChange={(date) =>
                                    handleDateChangeHasta(date)
                                 }
                                 InputProps={{
                                    style: {
                                       height: "34px",
                                       padding: 0,
                                    },
                                 }}
                              />
                           </div>
                        </div>
                        <InputBuscador
                           style={{
                              marginLeft: "20px",
                           }}
                           nombre={"Tipo retención:"}
                           lista={retentionTypeList}
                        />
                        <Button
                           type="primary"
                           id="butonBuscarFacturas"
                           onClick={findRetentions}
                           style={{ marginLeft: "30px" }}
                        >
                           Buscar
                        </Button>
                     </div>
                     <div className="caja_tabla">
                        {flagBusqueda ? (
                           <Loading
                              estilo={{
                                 display: "flex",
                                 justifyContent: "center",
                                 alignItems: "center",
                              }}
                              ancho={"150"}
                           />
                        ) : (
                           <TablaRetenciones listaBuscada={retentionList} />
                        )}
                     </div>
                     <div
                        className="botones_footer"
                        style={{
                           display: "flex",
                           justifyContent: "center",
                           marginTop: "30px",
                        }}
                     >
                        <Button
                           type="primary"
                           id="butonBuscarFacturas"
                           onClick={getRetentionCsv}
                        >
                           Generar Informe
                        </Button>
                     </div>
                  </div>
               </div>
            )}
         </MuiPickersUtilsProvider>
      </div>
   );
};
