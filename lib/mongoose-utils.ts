import mongoose, { Document, Model } from 'mongoose';

// Type-safe wrappers for Mongoose methods
export async function findOne<T extends Document>(
    model: Model<T>,
    filter: any
): Promise<T | null> {
    return model.findOne(filter).exec() as Promise<T | null>;
}

export async function findById<T extends Document>(
    model: Model<T>,
    id: string
): Promise<T | null> {
    return model.findById(id).exec() as Promise<T | null>;
}

export async function findByIdAndUpdate<T extends Document>(
    model: Model<T>,
    id: string,
    update: any,
    options: { new?: boolean; upsert?: boolean } = { new: true }
): Promise<T | null> {
    return model.findByIdAndUpdate(id, update, options).exec() as Promise<T | null>;
}

export async function findOneAndUpdate<T extends Document>(
    model: Model<T>,
    filter: any,
    update: any,
    options: { new?: boolean; upsert?: boolean } = { new: true }
): Promise<T | null> {
    return model.findOneAndUpdate(filter, update, options).exec() as Promise<T | null>;
}

export async function find<T extends Document>(
    model: Model<T>,
    filter: any = {},
    options: { sort?: any; skip?: number; limit?: number } = {}
): Promise<T[]> {
    let query = model.find(filter);

    if (options.sort) {
        query = query.sort(options.sort);
    }

    if (options.skip) {
        query = query.skip(options.skip);
    }

    if (options.limit) {
        query = query.limit(options.limit);
    }

    return query.exec() as Promise<T[]>;
}

export async function countDocuments(
    model: Model<any>,
    filter: any = {}
): Promise<number> {
    return model.countDocuments(filter).exec() as Promise<number>;
}