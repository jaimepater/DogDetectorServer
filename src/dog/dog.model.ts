import { Schema, Document } from 'mongoose';

export enum DogType {
  DOG = 'dog',
  BIG_DOG = 'big-dog',
}

export interface Dog extends Document {
  image: string;
  date: Date;
  type: DogType;
}

export const DogSchema = new Schema({
  image: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: Object.values(DogType), required: true },
});
