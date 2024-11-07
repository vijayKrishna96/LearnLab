const express = require("express");
const stripe = require("stripe")(process.env.VITE_STRIPE_KEY);
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/create-checkout", async (req, res) => {
  const { product, returnUrl } = req.body;
  //   Adjust this if `product` is an array
  const lineItems = product.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.title, // Use appropriate field names from your frontend
        images: [item.image.url], // Stripe expects an array for images
      },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));

  const itemIds = [];
  const instructorIds = [];

  product.forEach((item) => {
    const ids = Array.isArray(item._id) ? item._id : [item._id];
    itemIds.push(...ids);
    instructorIds.push(item.instructor);
  });

  // Change the JWT payload to use 'items' instead of 'itemIds'
  const token = jwt.sign(
    { 
      items: itemIds,  // Changed from itemIds to items
      instructorIds 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "10m" }
  );


  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${returnUrl}?success=true&token=${token}`,
      cancel_url: `${returnUrl}?success=false`,
    });

    res.json({ id: session.id, success: true });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
