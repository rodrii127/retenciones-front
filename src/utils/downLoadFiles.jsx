import xlsx from "json-as-xlsx";
import moment from "moment";

export const handleExcel = (dataList) => {
    let data = [
        {
            sheet: `Asientos Diarios`,
            columns: [
                { label: "Fecha", value: "date" },
                { label: "Número", value: "number" },
                { label: "Proveedor", value: "provider" },
                { label: "CUIT", value: "cuitProvider" },
                { label: "Base", value: "base" },
                { label: "Retención", value: "retention" },
                { label: "Monto a pagar", value: "amountPaid" },
            ],
            content: dataList,
        },
    ];

    xlsx(data, {
        fileName: `Informe por fechas ${moment().format("YYYY-MM-DD")}`,
        writeOptions: { cellStyles: true },
    });
};

export const handleExcelFactura = (dataList) => {
    let data = [
        {
            sheet: `Facturas`,
            columns: [
                { label: "Fecha", value: "date" },
                { label: "Proveedor", value: "provider" },
                { label: "Punto de Venta", value: "pointSale" },
                { label: "N° Factura", value: "number" },
                { label: "Grabado", value: "engraved" },
                { label: "Exento", value: "exempt" },
                { label: "IVA 105", value: "iva105" },
                { label: "IVA 21", value: "iva21" },
                { label: "IIBB", value: "iibb" },
                { label: "Otros impuestos", value: "taxedOthers" },
                { label: "Municipalidad", value: "municipality" },
                { label: "Total", value: "total" },
            ],
            content: dataList,
        },
    ];

    xlsx(data, {
        fileName: `Facturas ${moment().format("YYYY-MM-DD")}`,
        writeOptions: { cellStyles: true },
    });
};
