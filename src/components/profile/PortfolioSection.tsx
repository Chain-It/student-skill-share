import { useState, useRef } from 'react';
import { Image, FileText, Link as LinkIcon, Plus, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PortfolioItem } from '@/lib/profile-types';
import { usePortfolioUpload } from '@/hooks/usePortfolioUpload';

interface PortfolioSectionProps {
  items: PortfolioItem[];
  isEditable?: boolean;
}

export function PortfolioSection({ items, isEditable = false }: PortfolioSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'link'>('image');
  const [externalLink, setExternalLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, addPortfolioItem, removePortfolioItem } = usePortfolioUpload();

  const isSubmitting = uploadFile.isPending || addPortfolioItem.isPending;

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFileType('image');
    setExternalLink('');
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let fileUrl = '';

    if (fileType === 'link') {
      fileUrl = externalLink;
    } else if (selectedFile) {
      fileUrl = await uploadFile.mutateAsync(selectedFile);
    } else {
      return;
    }

    await addPortfolioItem.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      file_url: fileUrl,
      file_type: fileType,
      external_link: fileType === 'link' ? externalLink : undefined,
    });

    resetForm();
    setIsDialogOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'pdf': return FileText;
      case 'link': return LinkIcon;
      default: return Image;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Portfolio
          </span>
          {isEditable && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Add Work
                </Button>
              </DialogTrigger>
              <DialogContent
                onInteractOutside={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('[data-radix-select-content]')) {
                    e.preventDefault();
                  }
                }}
              >
                <DialogHeader>
                  <DialogTitle>Add Portfolio Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Project name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your work..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={fileType} onValueChange={(v) => setFileType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="link">External Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {fileType === 'link' ? (
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        type="url"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        placeholder="https://..."
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>File</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={fileType === 'image' ? 'image/*' : 'application/pdf'}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {selectedFile ? selectedFile.name : 'Choose file'}
                      </Button>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Add to Portfolio'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No portfolio items yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => {
              const Icon = getIcon(item.file_type);
              return (
                <div
                  key={item.id}
                  className="group relative rounded-lg border border-border overflow-hidden bg-muted/50"
                >
                  {item.file_type === 'image' ? (
                    <img
                      src={item.file_url}
                      alt={item.title}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-muted">
                      <Icon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                    <p className="text-white font-medium text-sm text-center truncate w-full">
                      {item.title}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {item.file_type === 'link' || item.file_type === 'pdf' ? (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-white/20 rounded hover:bg-white/30 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                      ) : (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-white/20 rounded hover:bg-white/30 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                      )}
                      {isEditable && (
                        <button
                          type="button"
                          onClick={() => removePortfolioItem.mutate(item.id)}
                          className="p-1.5 bg-red-500/80 rounded hover:bg-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
