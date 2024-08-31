// src/actions/products/get-products-by-page.action.ts
import type { ProductWithImages } from '@/interfaces';
import { defineAction, z } from 'astro:actions';
import { count, db, eq, Product, ProductImage, sql } from 'astro:db';

export const getProductsByPage = defineAction({
  accept: 'json',
  input: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(6),
    gender: z.string().optional(),
    type: z.string().optional(),  // Agregado filtro por tipo
    categorys: z.string().optional(),  // Añadido el filtro de categoría
  }),

  handler: async ({ page, limit, type, categorys }) => {
    page = page <= 0 ? 1 : page;

    let totalRecords;
    if (type && categorys) {
      totalRecords = await db
        .select({ count: count() })
        .from(Product)
        .where(
          sql`${eq(Product.type, type)} AND ${eq(Product.categorys, categorys)}`
        );
    } else if (type) {
      totalRecords = await db
        .select({ count: count() })
        .from(Product)
        .where(eq(Product.type, type));
    } else if (categorys) {
      totalRecords = await db
        .select({ count: count() })
        .from(Product)
        .where(eq(Product.categorys, categorys));
    } else {
      totalRecords = await db.select({ count: count() }).from(Product);
    }

    const totalPages = Math.ceil(totalRecords[0].count / limit);

    if (page > totalPages) {
      return {
        products: [] as ProductWithImages[],
        totalPages: totalPages,
      };
    }

    let productsQuery;
    if (type && categorys) {
      productsQuery = sql`
        select a.*,
        ( select GROUP_CONCAT(image, ',') from 
          ( select * from ${ProductImage} where productId = a.id limit 2 )
        ) as images
        from ${Product} a
        where a.type = ${type} and a.categorys = ${categorys} /* Filtro por tipo y categoría */
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
      `;
    } else if (type) {
      productsQuery = sql`
        select a.*,
        ( select GROUP_CONCAT(image, ',') from 
          ( select * from ${ProductImage} where productId = a.id limit 2 )
        ) as images
        from ${Product} a
        where a.type = ${type}  /* Filtro por tipo */
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
      `;
    } else if (categorys) {
      productsQuery = sql`
        select a.*,
        ( select GROUP_CONCAT(image, ',') from 
          ( select * from ${ProductImage} where productId = a.id limit 2 )
        ) as images
        from ${Product} a
        where a.categorys = ${categorys}  /* Filtro por categoría */
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
      `;
    } else {
      productsQuery = sql`
        select a.*,
        ( select GROUP_CONCAT(image, ',') from 
          ( select * from ${ProductImage} where productId = a.id limit 2 )
        ) as images
        from ${Product} a
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
      `;
    }

    const { rows } = await db.run(productsQuery);

    const products = rows.map((product) => {
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
