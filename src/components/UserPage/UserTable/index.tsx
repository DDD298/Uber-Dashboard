import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/interface/auth";
import { motion } from "framer-motion";
import { IconTrash, IconMenu3 } from "@tabler/icons-react";
interface UserTableProps {
  users: IUser[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage?: number;
  pageSize?: number;
}

export const UserTable = ({
  users,
  isSearching,
  onEdit,
  onDelete,
  currentPage = 1,
  pageSize = 10,
}: UserTableProps) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-green-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-800 text-nowrap w-[60px]">
              STT
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Thông tin người dùng
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap w-[180px]">
              Email
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Tổng chuyến đi
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Hoàn thành
            </TableHead>
            <TableHead className="font-semibold text-gray-800 text-nowrap">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-800">
                {isSearching ? "No user found" : "No users available"}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => {
              const rowNumber = (currentPage - 1) * pageSize + index + 1;
              const userId = user.clerk_id || user._id || user.id || "";

              return (
                <TableRow
                  key={userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-center font-medium text-gray-800">
                    {rowNumber}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          user.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                            user.name || user.email
                          }`
                        }
                        alt={user.name}
                        className="w-full h-full object-cover flex-shrink-0"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      {user.clerk_id && (
                        <p className="text-sm text-gray-500">
                          ID: {user.clerk_id.substring(0, 12)}...
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[180px]">
                    <div className="flex items-center">
                      <span className="text-gray-800 text-wrap">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge variant="blue">{user.total_rides || 0}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge variant="green">{user.completed_rides || 0}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(userId)}
                          className="text-gray-800 hover:text-mainTextHoverV1 hover:bg-transparent"
                        >
                          <IconMenu3 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(userId)}
                          className="text-gray-800 hover:text-mainDangerV1 hover:bg-transparent"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
