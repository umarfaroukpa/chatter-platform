import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../lib/mongodb";
import Subdomain from "../../models/Subdomain";

interface Data {
    available: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        const { subdomain } = req.body;

        if (!subdomain || subdomain.length < 3) {
            return res.status(400).json({ available: false, message: "Subdomain must be at least 3 characters long." });
        }

        try {
            await connectToDatabase();

            // Check if the subdomain exists using the Subdomain model
            const existingSubdomain = await Subdomain.findOne({ subdomain });

            if (existingSubdomain) {
                return res.status(200).json({ available: false, message: "This subdomain is already taken." });
            }

            return res.status(200).json({ available: true, message: "This subdomain is available!" });
        } catch (error) {
            console.error("Error occurred while checking subdomain:", error);
            return res.status(500).json({ available: false, message: "An error occurred while checking availability." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
