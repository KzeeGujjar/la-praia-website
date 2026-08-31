const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export class MenuValidationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type CategoryInput = { id?: string; nameIt?: string; nameEn?: string; sortOrder?: number };

export function parseCategoryInput(body: Record<string, unknown>, { partial }: { partial: boolean }): CategoryInput {
  const result: CategoryInput = {};

  if (!partial) {
    if (typeof body.id !== "string" || !SLUG_RE.test(body.id)) {
      throw new MenuValidationError("id must be a lowercase, hyphen-separated slug (e.g. 'pizze-speciali')");
    }
    result.id = body.id;
  }

  if (body.nameIt !== undefined || !partial) {
    if (typeof body.nameIt !== "string" || !body.nameIt.trim()) throw new MenuValidationError("Invalid nameIt");
    result.nameIt = body.nameIt.trim();
  }
  if (body.nameEn !== undefined || !partial) {
    if (typeof body.nameEn !== "string" || !body.nameEn.trim()) throw new MenuValidationError("Invalid nameEn");
    result.nameEn = body.nameEn.trim();
  }
  if (body.sortOrder !== undefined) {
    if (typeof body.sortOrder !== "number" || !Number.isInteger(body.sortOrder)) {
      throw new MenuValidationError("Invalid sortOrder");
    }
    result.sortOrder = body.sortOrder;
  }

  return result;
}

export type ItemInput = {
  categoryId?: string;
  name?: string;
  descriptionIt?: string | null;
  descriptionEn?: string | null;
  price?: number;
  glutenFree?: boolean;
  imageUrl?: string | null;
  available?: boolean;
  featured?: boolean;
  sortOrder?: number;
};

export function parseItemInput(body: Record<string, unknown>, { partial }: { partial: boolean }): ItemInput {
  const result: ItemInput = {};

  if (body.categoryId !== undefined || !partial) {
    if (typeof body.categoryId !== "string" || !body.categoryId) throw new MenuValidationError("Invalid categoryId");
    result.categoryId = body.categoryId;
  }
  if (body.name !== undefined || !partial) {
    if (typeof body.name !== "string" || !body.name.trim()) throw new MenuValidationError("Invalid name");
    result.name = body.name.trim();
  }
  if (body.price !== undefined || !partial) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0) {
      throw new MenuValidationError("Invalid price");
    }
    result.price = body.price;
  }
  if (body.descriptionIt !== undefined) {
    if (body.descriptionIt !== null && typeof body.descriptionIt !== "string") throw new MenuValidationError("Invalid descriptionIt");
    result.descriptionIt = body.descriptionIt as string | null;
  }
  if (body.descriptionEn !== undefined) {
    if (body.descriptionEn !== null && typeof body.descriptionEn !== "string") throw new MenuValidationError("Invalid descriptionEn");
    result.descriptionEn = body.descriptionEn as string | null;
  }
  if (body.imageUrl !== undefined) {
    if (body.imageUrl !== null && typeof body.imageUrl !== "string") throw new MenuValidationError("Invalid imageUrl");
    result.imageUrl = body.imageUrl as string | null;
  }
  if (body.glutenFree !== undefined) {
    if (typeof body.glutenFree !== "boolean") throw new MenuValidationError("Invalid glutenFree");
    result.glutenFree = body.glutenFree;
  }
  if (body.available !== undefined) {
    if (typeof body.available !== "boolean") throw new MenuValidationError("Invalid available");
    result.available = body.available;
  }
  if (body.featured !== undefined) {
    if (typeof body.featured !== "boolean") throw new MenuValidationError("Invalid featured");
    result.featured = body.featured;
  }
  if (body.sortOrder !== undefined) {
    if (typeof body.sortOrder !== "number" || !Number.isInteger(body.sortOrder)) throw new MenuValidationError("Invalid sortOrder");
    result.sortOrder = body.sortOrder;
  }

  return result;
}
