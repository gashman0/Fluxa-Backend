import "dotenv/config";
import axios from "axios";

console.log("KEY:", process.env.PAYSTACK_SECRET_KEY);

const paystackClient = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    },
});

export const initializeTransaction = async ({
    email,
    amount,
    reference,
}) => {
    const response = await paystackClient.post(
        "/transaction/initialize",
        {
            email,
            amount: String(amount),
            reference,
        }
    );

    return response.data;
};

const testPayment = async () => {
    try {
        const response = await initializeTransaction({
            email: "gashman878@gmail.com",
            amount: 500000,
            reference: `TEST_${Date.now()}`,
        });

        console.log(response);
    } catch (error) {
        console.error(
            error.response?.data || error.message
        );
    }
};

testPayment();