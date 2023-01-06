import { enviroment } from "./Enviroment";

const baseUrl =
    enviroment === "dev"
        ? "http://retenciones.ddns.net:8081/v1/retenciones"
        : "http://retenciones.ddns.net:8081/v1/retenciones";

export const loginUri = baseUrl + "/users/login";
export const invoiceUri = baseUrl + "/invoice";
export const providerUri = baseUrl + "/providers";
export const payOrderUri = baseUrl + "/pay-order";
export const retentionTypeUri = baseUrl + "/retention-type";
export const retentionUri = baseUrl + "/retentions";
export const retentionMunicipalityCsvUri = retentionUri + "/retentionCsv";
