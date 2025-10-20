import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, type KYCStatus, type RiskBand } from "./StatusBadge";
import { Search, MoreVertical, Eye, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  kycStatus: KYCStatus;
  riskBand: RiskBand;
  submittedDate: string;
  assignedTo?: string;
}

interface ClientTableProps {
  clients: Client[];
  onViewClient?: (clientId: string) => void;
  onEditClient?: (clientId: string) => void;
}

export function ClientTable({ clients, onViewClient, onEditClient }: ClientTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Client KYC Overview</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              data-testid="input-client-search"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm">
                <th className="text-left py-3 px-4 font-medium">Client Name</th>
                <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Company</th>
                <th className="text-left py-3 px-4 font-medium">KYC Status</th>
                <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Risk Band</th>
                <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Submitted</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b hover-elevate"
                  data-testid={`row-client-${client.id}`}
                >
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm">{client.company || "—"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={client.kycStatus} type="kyc" />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <StatusBadge status={client.riskBand} type="risk" />
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                    {new Date(client.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-actions-${client.id}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onViewClient?.(client.id)}
                          data-testid={`button-view-${client.id}`}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditClient?.(client.id)}
                          data-testid={`button-edit-${client.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit KYC
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No clients found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
