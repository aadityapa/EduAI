'use client';

import * as React from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Spinner } from './spinner';

export interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  /** Extra MIME allowlist; when set, files must match both accept and this list. */
  allowedMimeTypes?: readonly string[];
  onFilesSelected?: (files: File[]) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  emptyLabel?: string;
}

/** Drag-and-drop file upload with loading / error / empty states. */
export function FileUploader({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  allowedMimeTypes,
  onFilesSelected,
  label = 'Upload files',
  description = 'Drag and drop or click to browse',
  disabled,
  loading,
  error,
  emptyLabel = 'No files selected',
  className,
  ...props
}: FileUploaderProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || disabled || loading) return;
    const incoming = Array.from(fileList);
    const oversized = incoming.filter((f) => f.size > maxSize);
    if (oversized.length > 0) {
      setLocalError(`Some files exceed the ${Math.round(maxSize / (1024 * 1024))}MB limit`);
      return;
    }
    if (allowedMimeTypes?.length) {
      const bad = incoming.filter((f) => !allowedMimeTypes.includes(f.type));
      if (bad.length > 0) {
        setLocalError(`Disallowed file type: ${bad.map((f) => f.type || f.name).join(', ')}`);
        return;
      }
    }
    if (incoming.some((f) => f.name.includes('..') || /[/\\]/.test(f.name))) {
      setLocalError('Invalid filename');
      return;
    }
    setLocalError(null);
    setFiles(incoming);
    onFilesSelected?.(incoming);
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFilesSelected?.(next);
  };

  const displayError = error ?? localError;

  return (
    <div className={cn('space-y-4', className)} {...props}>
      <div
        role="button"
        tabIndex={disabled || loading ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled || loading || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !loading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!disabled && !loading) inputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !loading) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-fast',
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50',
          (disabled || loading) && 'cursor-not-allowed opacity-60',
          displayError && 'border-destructive bg-destructive/5',
        )}
      >
        {loading ? (
          <Spinner className="mb-3" label="Uploading" />
        ) : (
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
        )}
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          disabled={disabled || loading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {displayError && (
        <p className="inline-flex items-center gap-1.5 text-sm text-destructive" role="alert">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {displayError}
        </p>
      )}

      {files.length > 0 ? (
        <ul className="space-y-2" aria-label="Selected files">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                aria-label={`Remove ${file.name}`}
                disabled={disabled || loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <p className="text-center text-xs text-muted-foreground" data-state="empty">
            {emptyLabel}
          </p>
        )
      )}
    </div>
  );
}

/** Alias matching master-prompt naming. */
export const FileUpload = FileUploader;
