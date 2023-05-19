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
