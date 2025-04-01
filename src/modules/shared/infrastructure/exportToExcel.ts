import { saveAs } from "file-saver";
import { utils, write } from "xlsx/";

type Args<T> = {
  fileName: string;
  sheets: Record<
    PropertyKey,
    {
      data: T[];
    }
  >;
};

const exportToExcel = <T>({ fileName, sheets }: Args<T>) => {
  const workbook = utils.book_new();

  Object.entries(sheets).forEach(([k, v]) => {
    const worksheet = utils.json_to_sheet(v.data);
    utils.book_append_sheet(workbook, worksheet, k);
  });
  const excelBuffer = write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;
