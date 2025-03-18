import { Document, Model, FilterQuery, UpdateQuery, QueryOptions, SortOrder } from 'mongoose';

interface FindOptions {
    sort?: { [key: string]: SortOrder | { $meta: string } };
    skip?: number;
    limit?: number;
}

// Type-safe wrappers for Mongoose methods
export async function findOne<T extends Document>(
    model: Model<T>,
    filter: FilterQuery<T> = {},
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
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true }
): Promise<T | null> {
    return model.findByIdAndUpdate(id, update, options).exec() as Promise<T | null>;
}

export async function findOneAndUpdate<T extends Document>(
    model: Model<T>,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true }
): Promise<T | null> {
    return model.findOneAndUpdate(filter, update, options).exec() as Promise<T | null>;
}

export async function find<T extends Document>(
    model: Model<T>,
    filter: FilterQuery<T> = {},
    options: FindOptions = {}
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

export async function countDocuments<T extends Document>(
    model: Model<T>,
    filter: FilterQuery<T> = {}
): Promise<number> {
    return model.countDocuments(filter).exec() as Promise<number>;
}