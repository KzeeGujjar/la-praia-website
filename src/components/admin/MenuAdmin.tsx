"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Item = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  glutenFree: boolean;
  available: boolean;
  featured: boolean;
  imageUrl: string | null;
};

type Category = {
  id: string;
  nameIt: string;
  nameEn: string;
  items: Item[];
};

export function MenuAdmin({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-8">
      <AddCategoryForm />
      {categories.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
}

function CategorySection({ category }: { category: Category }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function deleteCategory() {
    if (!confirm(`Delete "${category.nameIt}" and all ${category.items.length} of its items? This can't be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/menu/categories/${category.id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <section className="border border-navy/10 bg-white">
      <div className="flex items-center justify-between border-b border-navy/10 bg-sand-dark/30 px-4 py-3">
        <h2 className="font-display text-lg font-semibold text-navy">
          {category.nameIt} <span className="text-sm font-normal text-ink/50">/ {category.nameEn}</span>
        </h2>
        <button
          type="button"
          onClick={deleteCategory}
          disabled={busy}
          className="text-xs font-semibold uppercase tracking-wide text-terracotta hover:text-terracotta-dark disabled:opacity-50"
        >
          Delete Category
        </button>
      </div>

      <div className="divide-y divide-navy/5">
        {category.items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>

      <AddItemForm categoryId={category.id} />
    </section>
  );
}

function ItemRow({ item }: { item: Item }) {
  const router = useRouter();
  const [draft, setDraft] = useState(item);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(item);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/menu/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draft.name,
        price: draft.price,
        glutenFree: draft.glutenFree,
        available: draft.available,
        featured: draft.featured,
      }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  async function remove() {
    if (!confirm(`Delete "${item.name}"?`)) return;
    const res = await fetch(`/api/admin/menu/items/${item.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/admin/menu/items/${item.id}/image`, { method: "POST", body: formData });
    setUploading(false);
    if (res.ok) {
      router.refresh();
    } else {
      setUploadError(await res.text());
    }
  }

  async function removePhoto() {
    const res = await fetch(`/api/admin/menu/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: null }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-sm">
      <div className="flex shrink-0 items-center gap-2">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded border border-dashed border-navy/20 bg-sand-dark/20" />
        )}
        <div className="flex flex-col gap-0.5">
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="text-[11px] font-semibold uppercase text-terracotta hover:text-terracotta-dark disabled:opacity-50">
            {uploading ? "Uploading…" : item.imageUrl ? "Replace" : "Add Photo"}
          </button>
          {item.imageUrl && (
            <button type="button" onClick={removePhoto} className="text-left text-[11px] text-ink/40 hover:text-terracotta">
              Remove
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadPhoto(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      <input
        type="text"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        className="min-w-[180px] flex-1 border border-transparent px-2 py-1 focus:border-navy/20"
      />
      <input
        type="number"
        step="0.5"
        min={0}
        value={draft.price}
        onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
        className="w-20 border border-navy/15 px-2 py-1"
      />
      <label className="flex items-center gap-1.5 text-xs text-ink/70">
        <input type="checkbox" checked={draft.glutenFree} onChange={(e) => setDraft({ ...draft, glutenFree: e.target.checked })} />
        GF
      </label>
      <label className="flex items-center gap-1.5 text-xs text-ink/70">
        <input type="checkbox" checked={draft.available} onChange={(e) => setDraft({ ...draft, available: e.target.checked })} />
        Available
      </label>
      <label className="flex items-center gap-1.5 text-xs text-ink/70">
        <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
        Featured
      </label>

      {dirty && (
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-terracotta px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sand hover:bg-terracotta-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      )}
      <button type="button" onClick={remove} className="ml-auto text-xs text-ink/40 hover:text-terracotta">
        Delete
      </button>
      {uploadError && <p className="w-full text-xs text-terracotta-dark">{uploadError}</p>}
    </div>
  );
}

function AddItemForm({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/menu/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name, price: Number(price) }),
    });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    setName("");
    setPrice("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border-t border-navy/10 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-navy/60 hover:bg-sand-dark/20"
      >
        + Add Item
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2 border-t border-navy/10 bg-sand-dark/20 px-4 py-3">
      <input
        type="text"
        required
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="min-w-[180px] flex-1 border border-navy/15 px-2 py-1.5 text-sm"
      />
      <input
        type="number"
        required
        step="0.5"
        min={0}
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-24 border border-navy/15 px-2 py-1.5 text-sm"
      />
      <button type="submit" className="bg-navy px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-sand">
        Add
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-ink/50">
        Cancel
      </button>
      {error && <p className="w-full text-xs text-terracotta-dark">{error}</p>}
    </form>
  );
}

function AddCategoryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [nameIt, setNameIt] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/menu/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nameIt, nameEn }),
    });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    setId("");
    setNameIt("");
    setNameEn("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-dashed border-navy/25 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-navy/60 hover:bg-white"
      >
        + Add Category
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2 border border-navy/15 bg-white px-4 py-3">
      <label className="text-xs">
        <span className="mb-1 block font-semibold uppercase tracking-wide text-navy/70">Slug (id)</span>
        <input
          type="text"
          required
          placeholder="e.g. antipasti-freddi"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-48 border border-navy/15 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-xs">
        <span className="mb-1 block font-semibold uppercase tracking-wide text-navy/70">Name (IT)</span>
        <input
          type="text"
          required
          value={nameIt}
          onChange={(e) => setNameIt(e.target.value)}
          className="w-40 border border-navy/15 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-xs">
        <span className="mb-1 block font-semibold uppercase tracking-wide text-navy/70">Name (EN)</span>
        <input
          type="text"
          required
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          className="w-40 border border-navy/15 px-2 py-1.5 text-sm"
        />
      </label>
      <button type="submit" className="bg-navy px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-sand">
        Add
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-ink/50">
        Cancel
      </button>
      {error && <p className="w-full text-xs text-terracotta-dark">{error}</p>}
    </form>
  );
}
