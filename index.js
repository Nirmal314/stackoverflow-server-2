import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import users from "./models/auth.js";

import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
const app = express();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const stripe = new Stripe(
  "sk_test_51MKk5ySEPJAvvtMCgjyyMNtdAB7qTj0MJZA84jeHBpfhTvPsiwNLDvYU12lZ6ENjjtUJYHmmZKDMMsSGFyLoHkZf00b1UNiytO"
);

dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is a stack overflow clone API");
});
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get("/create-payment-silver", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "INR",
      amount: 10000,
      automatic_payment_methods: { enabled: true },
    });

    console.log(paymentIntent.client_secret);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});
app.get("/create-payment-gold", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "INR",
      amount: 100000,
      automatic_payment_methods: { enabled: true },
    });

    console.log(paymentIntent.client_secret);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

// app.get("/silver", async (req, res) => {
//   const { email } = req.body;
//   // const allUsers = await users.find();
//   const user = await users.findOne({ email });
//   res.send({ user: user });
// });

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);

const PORT = process.env.PORT || 5000;

const DATABASE_URL = process.env.CONNECTION_URL;

mongoose
  .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
