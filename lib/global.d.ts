import { Mongoose } from "mongoose";

declare module "node:global" {
    namespace NodeJS {
        interface Global {
            mongoose: {
                conn: Mongoose | null;
                promise: Promise<Mongoose> | null;
            };
        }
    }
}

// Export an empty object to ensure this is treated as a module
export { };
