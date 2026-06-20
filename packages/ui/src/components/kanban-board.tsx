'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ScrollArea } from './scroll-area';

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  assignee?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color?: string;
}

export interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: KanbanColumn[];
  onItemClick?: (item: KanbanItem, columnId: string) => void;
}

export function KanbanBoard({ columns, onItemClick, className, ...props }: KanbanBoardProps) {
  return (
    <div
      className={cn('flex gap-4 overflow-x-auto pb-4', className)}
      role="region"
      aria-label="Kanban board"
      {...props}
    >
      {columns.map((column) => (
        <div key={column.id} className="flex w-72 shrink-0 flex-col">
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <Badge variant="secondary">{column.items.length}</Badge>
          </div>
          <ScrollArea className="h-[480px]">
            <div className="space-y-3 pr-3">
              {column.items.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => onItemClick?.(item, column.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onItemClick?.(item, column.id);
                    }
                  }}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 pt-0">
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {item.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {item.assignee && (
                      <p className="text-xs text-muted-foreground">Assigned to {item.assignee}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
