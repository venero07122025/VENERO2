import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_TEST_SECRET!, {
    // apiVersion: "2024-06-20",
});