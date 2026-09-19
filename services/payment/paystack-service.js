import axios from "axios";

const paystackClient = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    },
});

export const initializeTransaction = async ({
    email, amount, refrence,
}) => {
    const response = await paystackClient.post("/transaction/initialize", {
        email, amount, refrence
    });

    return response.data;
};