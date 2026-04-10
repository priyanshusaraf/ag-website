const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getOrCreateWishlist = async (userId) => {
  let wishlist = await prisma.wishlists.findUnique({
    where: { user_id: userId },
    include: {
      wishlist_items: {
        include: { products: true },
        orderBy: { added_at: 'desc' },
      },
    },
  });
  if (!wishlist) {
    wishlist = await prisma.wishlists.create({
      data: { user_id: userId },
      include: { wishlist_items: { include: { products: true } } },
    });
  }
  return wishlist;
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user.id);
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ message: 'product_id is required' });

    const product = await prisma.products.findUnique({ where: { id: Number(product_id) } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const wishlist = await getOrCreateWishlist(req.user.id);

    await prisma.wishlist_items.upsert({
      where: { wishlist_id_product_id: { wishlist_id: wishlist.id, product_id: Number(product_id) } },
      update: {},
      create: { wishlist_id: wishlist.id, product_id: Number(product_id) },
    });

    const updated = await getOrCreateWishlist(req.user.id);
    res.json({ success: true, wishlist: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ message: 'product_id is required' });

    const wishlist = await prisma.wishlists.findUnique({ where: { user_id: req.user.id } });
    if (!wishlist) return res.json({ success: true });

    await prisma.wishlist_items.deleteMany({
      where: { wishlist_id: wishlist.id, product_id: Number(product_id) },
    });

    const updated = await getOrCreateWishlist(req.user.id);
    res.json({ success: true, wishlist: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
