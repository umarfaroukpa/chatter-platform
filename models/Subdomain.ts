import mongoose, { Document, Schema } from 'mongoose';

// Export the interface for use in API handlers
export interface ISubdomain extends Document {
    subdomain: string;
}

// Define a schema for the subdomain
const SubdomainSchema = new Schema<ISubdomain>({
    subdomain: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
});

// Export the Subdomain model
const Subdomain = mongoose.models.Subdomain as mongoose.Model<ISubdomain> ||
    mongoose.model<ISubdomain>("Subdomain", SubdomainSchema);

export default Subdomain;