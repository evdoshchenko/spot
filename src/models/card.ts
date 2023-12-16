import { model, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
import validator from 'validator';

export interface ICard {
  name: string
  link: string;
  owner: Schema.Types.ObjectId;
  likes: [];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неправильный формат почты',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'owner',
    required: true
  },
  likes: {
    type: [],
  },
  createdAt: {
    type: Date
  },
});

export default model<ICard>('Card', cardSchema);
