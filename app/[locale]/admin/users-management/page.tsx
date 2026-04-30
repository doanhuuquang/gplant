"use client";

import { Button } from "@/components/ui/button";
import { columns } from "../../../../components/feature/user/columns";
import { DataTable } from "@/components/ui/data-table";
import { Field, FieldLabel } from "@/components/ui/field";
import { Role } from "@/lib/enums/role";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useMemo, useState } from "react";
import { useUsers } from "@/lib/hooks/use-user";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Lock,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_STATUS = "all";
const ALL_ROLE = "all";

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUS);
  const [roleFilter, setRoleFilter] = useState<string>(ALL_ROLE);

  const { data: usersResponsePageResult, isLoading } = useUsers({
    pageNumber: page,
    pageSize: pageSize,
  });

  const filteredUsers = useMemo(() => {
    let users = usersResponsePageResult?.data.items || [];

    if (statusFilter !== ALL_STATUS) {
      users = users.filter((u) => {
        if (statusFilter === "active") return !u.isLocked;
        if (statusFilter === "locked") return u.isLocked;
        return true;
      });
    }

    if (roleFilter !== ALL_ROLE) {
      users = users.filter((u) => u.roles.includes(roleFilter as Role));
    }

    return users;
  }, [usersResponsePageResult, statusFilter, roleFilter]);

  const headerActions = useMemo(
    () => (
      <>
        <InputGroup className="w-full max-w-xl border-transparent bg-muted dark:bg-background">
          <InputGroupInput
            placeholder="Tìm theo tên, email, tên đăng nhập..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
        </InputGroup>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-12! rounded-sm shadow-none w-full max-w-40">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUS}>Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="locked">Đã khóa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-12! rounded-sm shadow-none w-full max-w-40">
            <SelectValue placeholder="Tất cả vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ROLE}>Tất cả vai trò</SelectItem>
            <SelectItem value={Role.Admin}>Admin</SelectItem>
            <SelectItem value={Role.Manager}>Quản lý</SelectItem>
            <SelectItem value={Role.Customer}>Khách hàng</SelectItem>
          </SelectContent>
        </Select>
      </>
    ),
    [searchQuery, statusFilter, roleFilter],
  );

  useAdminHeader(headerActions);

  return (
    <>
      <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 gap-2 bg-background p-4 border rounded-sm">
        <div className="w-full bg-yellow-600/10 p-4 border border-yellow-600 rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-yellow-600">
                {usersResponsePageResult?.data.totalCount || 0}
              </p>
            </div>
            <Users className="size-6 text-yellow-600" />
          </div>
        </div>

        <div className="w-full bg-green-600/10 p-4 border border-green-600 rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Người dùng hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {usersResponsePageResult?.data.activeUsersCount || 0}
              </p>
            </div>
            <CheckCircle className="size-6 text-green-600" />
          </div>
        </div>

        <div className="w-full bg-destructive/10 p-4 border border-destructive rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-destructive">Người dùng bị khóa</p>
              <p className="text-2xl font-bold text-destructive">
                {usersResponsePageResult?.data.lockedUsersCount || 0}
              </p>
            </div>
            <Lock className="size-6 text-destructive" />
          </div>
        </div>

        <div className="w-full bg-blue-600/10 p-4 border border-blue-600 rounded-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Mới trong tuần</p>
              <p className="text-2xl font-bold text-blue-600">
                {usersResponsePageResult?.data.newUsersThisWeek || 0}
              </p>
            </div>
            <UserPlus className="size-6 text-blue-600" />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers || []}
        isLoading={isLoading}
        globalFilter={searchQuery}
      />

      <div className="flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">
            Số dòng mỗi trang
          </FieldLabel>
          <Select
            defaultValue="10"
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            disabled={!usersResponsePageResult?.data.hasPreviousPage}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!usersResponsePageResult?.data.hasNextPage}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
}
