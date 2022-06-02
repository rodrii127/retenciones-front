import { enviroment } from "./Enviroment";

const baseUrl = enviroment === 'dev'
    ? 'https://retenciones-test.herokuapp.com/v1/retenciones'
    : 'https://retentencionesnmisiones.herokuapp.com/v1/retenciones';

export const loginUri = baseUrl + '/users/login';
export const invoiceUri = baseUrl + '/invoice';
export const providerUri = baseUrl + '/providers';
export const payOrderUri = baseUrl + '/pay-order';