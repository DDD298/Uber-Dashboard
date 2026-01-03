import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  IconEdit,
  IconTrash,
  IconPercentage,
  IconCurrencyDollar,
  IconCalendar,
  IconUsers,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { PromoCode } from "../types";

interface PromoCodeCardProps {
  promoCode: PromoCode;
  onEdit: (promoCode: PromoCode) => void;
  onDelete: (promoCode: PromoCode) => void;
}

export default function PromoCodeCard({
  promoCode,
  onEdit,
  onDelete,
}: PromoCodeCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="p-0 w-full bg-transparent border-b border-b-[#ccc] pb-2">
        <div className="flex justify-between items-start w-full">
          <div className="flex-1">
            <CardTitle className="text-lg flex flex-row justify-between font-semibold text-gray-700 mb-1">
              {promoCode.code}
              {promoCode.is_active && !isExpired(promoCode.end_date) ? (
                <Badge variant="green">Hoạt động</Badge>
              ) : isExpired(promoCode.end_date) ? (
                <Badge variant="red">Hết hạn</Badge>
              ) : (
                <Badge variant="gray">Đã tắt</Badge>
              )}
            </CardTitle>
            <CardDescription className="text-sm w-full font-medium text-ellipsis line-clamp-1">
              {promoCode.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-0 flex-1">
        {/* Discount Value */}
        <div className="flex items-center gap-2 mt-3 text-3xl font-semibold text-green-600">
          {promoCode.discount_type === "percentage" ? (
            <>
              <IconPercentage size={24} />
              <span>{promoCode.discount_value}%</span>
            </>
          ) : (
            <>
              <IconCurrencyDollar size={24} />
              <span>{formatCurrency(promoCode.discount_value)}</span>
            </>
          )}
        </div>

        {/* Details */}
        <div className="text-sm text-gray-700 mt-4 border rounded-md overflow-hidden">
          <Table>
            <TableBody>
              {promoCode.max_discount_amount && (
                <TableRow className="hover:bg-muted/50">
                  <TableCell className="p-3 text-gray-600 font-medium">
                    Giảm tối đa
                  </TableCell>
                  <TableCell className="p-3 font-semibold text-right">
                    {formatCurrency(promoCode.max_discount_amount)}
                  </TableCell>
                </TableRow>
              )}
              {promoCode.min_order_amount && (
                <TableRow className="hover:bg-muted/50">
                  <TableCell className="p-3 text-gray-600 font-medium">
                    Đơn tối thiểu
                  </TableCell>
                  <TableCell className="p-3 font-semibold text-right">
                    {formatCurrency(promoCode.min_order_amount)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="hover:bg-muted/50">
                <TableCell className="p-3 text-gray-600 font-medium flex items-center gap-2">
                  <IconCalendar size={16} />
                  Thời hạn
                </TableCell>
                <TableCell className="p-3 font-semibold text-right">
                  {formatDate(promoCode.start_date)} -{" "}
                  {formatDate(promoCode.end_date)}
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/50 border-none">
                <TableCell className="p-3 text-gray-600 font-medium flex items-center gap-2">
                  <IconUsers size={16} />
                  Đã dùng
                </TableCell>
                <TableCell className="p-3 font-semibold text-right">
                  {promoCode.used_count}
                  {promoCode.usage_limit && ` / ${promoCode.usage_limit}`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onEdit(promoCode)}
        >
          <IconEdit size={16} />
          Sửa
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => onDelete(promoCode)}
        >
          <IconTrash size={16} />
          Xóa
        </Button>
      </CardFooter>
    </Card>
  );
}
