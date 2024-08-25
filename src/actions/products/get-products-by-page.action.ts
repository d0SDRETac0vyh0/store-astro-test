//src/actions/products/get-products-by-page.action.ts
import type { ProductWithImages } from '@/interfaces';
import { defineAction, z } from 'astro:actions';
import { count, db, eq, Product, ProductImage, sql } from 'astro:db';

export const getProductsByPage = defineAction({
  accept: 'json',
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(6),
    gender: z.string().optional(),
  }),
  handler: async ({ page, limit, gender }) => {
    page = page <= 0 ? 1 : page;

    const totalRecords = gender
    ? await db.select({ count: count() }).from(Product).where(eq(Product.gender, gender))
    : await db.select({ count: count() }).from(Product);
    const totalPages = Math.ceil(totalRecords[0].count / limit);

    if (page > totalPages) {
      // page = totalPages;
      return {
        products: [] as ProductWithImages[],
        totalPages: totalPages,
      };
    }

    const productsQuery = gender
    ? sql`
      select a.*,
      ( select GROUP_CONCAT(image, ',') from 
        ( select * from ${ProductImage} where productId = a.id limit 2 )
      ) as images
      from ${Product} a
      where a.gender = ${gender}  /* Filtro por género */
      LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `
    : sql`
      select a.*,
      ( select GROUP_CONCAT(image, ',') from 
        ( select * from ${ProductImage} where productId = a.id limit 2 )
      ) as images
      from ${Product} a
      LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `;

  const { rows } = await db.run(productsQuery);

  const products = rows.map(product => {
    return {
      ...product,
      images: product.images ? product.images : 'no-image.png',
    };
  }) as unknown as ProductWithImages[];

  return {
    products: products,
    totalPages: totalPages,
  };
},
});