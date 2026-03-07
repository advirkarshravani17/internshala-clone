  const express = require("express");
  const crypto = require("crypto");
  const razorpay = require("../utils/razorpay");
  const moment = require("moment-timezone");
  const Subscription = require("../Model/subscription");
  const User = require("../Model/User");
  const sendOtpMail = require("../utils/sentOtpMail");

  const router = express.Router();


  // ================= EXISTING RESUME PAYMENT =================

  // Create order
  router.post("/create-order", async (req, res) => {
    try {
      const options = {
        amount: 50 * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      res.json({
        orderId: order.id,
        amount: order.amount,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Verify payment
  router.post("/verify", (req, res) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ status: "SUCCESS" });
    }

    res.status(400).json({ message: "Payment verification failed" });
  });


  // ================= NEW SUBSCRIPTION SYSTEM =================

  // ✅ PLAN CONFIG
  const plans = {
    Bronze: { price: 100, limit: 3 },
    Silver: { price: 300, limit: 5 },
    Gold: { price: 1000, limit: Infinity },
  };


  // ✅ CREATE SUBSCRIPTION ORDER
  router.post("/create-subscription-order", async (req, res) => {
  try {
    const { plan, uid } = req.body; // ✅ added uid

    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }
    // TIME LIMIT
    const now = moment().tz("Asia/Kolkata");
    const hour = now.hour();
    const minute = now.minute();

    if (!(hour === 10 && minute <= 59)) {
      return res.status(403).json({
        message: "Payments allowed only between 10-11 AM IST",
      });
    }

    // ✅ BLOCK IF ACTIVE MONTHLY PLAN EXISTS
    const existingSubscription = await Subscription.findOne({ uid });

    if (
      existingSubscription &&
      existingSubscription.expiryDate &&
      existingSubscription.expiryDate > new Date()
    ) {
      return res.status(403).json({
        message:
          "You already have an active monthly plan. You can upgrade only after it expires.",
      });
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.price * 100,
      currency: "INR",
      receipt: `sub_${Date.now()}`, // ✅ fixed
    });

    res.json({
      id: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.log("SUBSCRIPTION ORDER ERROR:", err);
    res.status(500).json({ message: "Subscription order failed" });
  }
});
  // ✅ VERIFY SUBSCRIPTION PAYMENT
  // ✅ VERIFY SUBSCRIPTION PAYMENT
  router.post("/verify-subscription-payment", async (req, res) => {
    try {
      console.log("VERIFY BODY:", req.body);

      const { paymentId, orderId, signature, uid, plan } = req.body;

      const body = orderId + "|" + paymentId;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).json({ message: "Invalid payment" });
      }

      const selectedPlan = plans[plan];
      if (!selectedPlan) {
        return res.status(400).json({ message: "Invalid plan" });
      }

      const start = new Date();
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);

      // ✅ FIXED — MATCHES Subscription MODEL (uid)
      await Subscription.findOneAndUpdate(
        { uid: uid },   // find by uid
        {
          uid: uid,     // save uid
          plan,
          applyLimit: selectedPlan.limit,
          applicationsUsed: 0,
          startDate: start,
          expiryDate: expiry,
        },
        { upsert: true, new: true }
      );

      // ✅ FIXED USER FETCH (your User uses uid)
      const user = await User.findOne({ uid: uid });

      if (user && user.email) {
  await sendOtpMail(
    user.email,
    `${plan} Plan Activated | ₹${selectedPlan.price}`,
    "subscription" // ✅ separate email template
  );
}

      res.json({ success: true });

    } catch (err) {
      console.log("VERIFY ERROR:", err);
      res.status(500).json({ message: "Verification failed" });
    }
  });


  module.exports = router;
