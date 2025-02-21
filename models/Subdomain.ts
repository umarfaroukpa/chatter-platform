import mongoose from "mongoose";

// Define a schema for the subdomain
const SubdomainSchema = new mongoose.Schema({
    subdomain: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
});

// Export the Subdomain model
const Subdomain = mongoose.models.Subdomain || mongoose.model("Subdomain", SubdomainSchema);

export default Subdomain;
