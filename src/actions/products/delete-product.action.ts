import { defineAction, z } from 'astro:actions';
import { db, eq, Product, ProductImage } from 'astro:db';
import { getSession } from 'auth-astro/server';

export const deleteProduct = defineAction({
  accept: 'json',
  input: z.object({
    id: z.string(),
  }),
  handler: async ({ id }, { request }) => {
    const session = await getSession(request);
    const user = session?.user;

    if (!user) {
      throw new Error('Unauthorized');
    }

    await db.delete(ProductImage).where(eq(ProductImage.productId, id));

    const [product] = await db
      .select()
      .from(Product)
      .where(eq(Product.id, id));

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    await db.delete(Product).where(eq(Product.id, id));

    return { ok: true };
  },
});
