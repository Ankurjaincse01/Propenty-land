"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Upload, X, ArrowUp, ArrowDown, Loader2, Star, Link2 } from "lucide-react";
import api from "@/lib/api";

export interface UploadedImage {
  url: string;
  publicId?: string;
  alt?: string;
  order?: number;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "greenland-estates",
  max = 12,
}: {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder?: string;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (value.length + files.length > max) {
      toast.error(`You can upload up to ${max} images.`);
      return;
    }
    setUploading(true);
    try {
      const uploaded: UploadedImage[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image.`);
          continue;
        }
        if (file.size > 6 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 6 MB.`);
          continue;
        }
        const dataUrl = await toDataUrl(file);
        const { data } = await api.post("/admin/upload", { file: dataUrl, folder });
        if (data.success) {
          uploaded.push({ url: data.data.url, publicId: data.data.publicId, alt: file.name });
        }
      }
      if (uploaded.length) {
        onChange([...value, ...uploaded].map((img, i) => ({ ...img, order: i })));
        toast.success(`${uploaded.length} image(s) uploaded`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const addByUrl = () => {
    const url = urlInput.trim();
    if (!/^https?:\/\//.test(url)) {
      toast.error("Enter a valid http(s) image URL");
      return;
    }
    onChange([...value, { url, alt: "" }].map((img, i) => ({ ...img, order: i })));
    setUrlInput("");
    toast.success("Image added");
  };

  const remove = async (index: number) => {
    const img = value[index];
    if (img.publicId && !img.publicId.startsWith("local_")) {
      try {
        await api.delete(`/admin/upload/${encodeURIComponent(img.publicId)}`);
      } catch {
        /* non-blocking */
      }
    }
    onChange(value.filter((_, i) => i !== index).map((im, i) => ({ ...im, order: i })));
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((im, i) => ({ ...im, order: i })));
  };

  const setAlt = (index: number, alt: string) => {
    const next = [...value];
    next[index] = { ...next[index], alt };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-outline"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload images"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-navy-200 bg-white px-3">
          <Link2 className="h-4 w-4 text-navy-400" />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-sm focus:outline-none"
            placeholder="…or paste an image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addByUrl())}
          />
          <button type="button" onClick={addByUrl} className="text-xs font-semibold text-forest-700">
            Add
          </button>
        </div>
      </div>

      <p className="text-[11px] text-navy-400">
        JPG, PNG, WebP or AVIF · up to 6 MB each · {value.length}/{max} added. The first image
        is the cover image.
      </p>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((img, i) => (
            <div key={`${img.url}-${i}`} className="group overflow-hidden rounded-xl border border-navy-100 bg-white">
              <div className="relative aspect-[4/3] bg-stone">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt || `Image ${i + 1}`} className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="chip absolute left-2 top-2 bg-gold-400 text-navy-900">
                    <Star className="h-3 w-3" /> Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute right-2 top-2 rounded-md bg-rose-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 p-2">
                <input
                  className="w-full rounded-md border border-navy-100 px-2 py-1 text-xs focus:border-forest-600 focus:outline-none"
                  placeholder="Alt text"
                  value={img.alt || ""}
                  onChange={(e) => setAlt(i, e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      className="rounded-md border border-navy-100 p-1.5 text-navy-500 hover:bg-stone"
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      className="rounded-md border border-navy-100 p-1.5 text-navy-500 hover:bg-stone"
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-[10px] text-navy-400">#{i + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
