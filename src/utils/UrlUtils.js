import { enviroment } from "./Enviroment";

export const baseUrl =
    enviroment === "dev"
        ? "https://miadmin-d03d0c76af30.herokuapp.com/v1/retenciones"
        : "https://miadmin-d03d0c76af30.herokuapp.com/v1/retenciones";

export const loginUri = baseUrl + "/users/login";
export const invoiceUri = baseUrl + "/invoice";
export const providerUri = baseUrl + "/providers";
export const payOrderUri = baseUrl + "/pay-order";
export const retentionTypeUri = baseUrl + "/retention-type";
export const retentionUri = baseUrl + "/retentions";
export const retentionMunicipalityCsvUri = retentionUri + "/retentionCsv";
export const payOrderList = payOrderUri + "/payOrderList";
