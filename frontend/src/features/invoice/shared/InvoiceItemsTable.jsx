import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatCurrency, formatUnit } from "@/utils/formatters";
import { variants } from "@/utils/invoiceTableVarients";
import clsx from "clsx";

export default function InvoiceItemsTable({

    items = [],
    variant = "classic",

}) {

    const style = variants[variant];

    return (

        <div className="overflow-x-auto">

            <Table>

                <TableHeader className={style.header}>

                    <TableRow>

                        <TableHead className={clsx(style.headText)}>
                            NO.
                        </TableHead>

                        <TableHead className={clsx(style.headText)}>
                            DESCRIPTION
                        </TableHead>

                        <TableHead className={clsx(style.headText, "text-center")}>
                            PRICE
                        </TableHead>

                        <TableHead className={clsx(style.headText, "text-center")}>
                            QTY
                        </TableHead>

                        <TableHead className={clsx(style.headText, "text-right")}>
                            TOTAL
                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {items.map((item, index) => (

                        <TableRow
                            key={index}
                            className={style.row}
                        >

                            <TableCell>
                                {index + 1}
                            </TableCell>

                            <TableCell>
                                {item.itemName}
                            </TableCell>

                            <TableCell className="text-center">
                                {formatCurrency(item.price)}
                            </TableCell>

                            <TableCell className="text-center">

                                <div className="flex justify-center gap-1">

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <span className="text-xs text-gray-500">
                                        {formatUnit(item.unit)}
                                    </span>

                                </div>

                            </TableCell>

                            <TableCell className="text-right font-semibold">
                                {formatCurrency(item.total)}
                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </div>

    );

}