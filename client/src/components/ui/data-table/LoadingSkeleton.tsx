
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSkeletonProps } from "./types";

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ columns }) => (
  <div className="w-full">
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-6 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default LoadingSkeleton;
