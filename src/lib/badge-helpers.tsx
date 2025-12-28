import { Badge } from "@/components/ui/badge";

export function getRoleBadge(role: string) {
  // Only admin role is supported in this dashboard
  return <Badge variant="cyan">Admin</Badge>;
}
