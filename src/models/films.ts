import { model, Schema } from 'mongoose';

export interface IFilm {
  title: string;
  genre: string;
}

const filmSchema = new Schema<IFilm>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  genre: {
    type: String,
    enum: ['комедия', 'драма', 'боевик', 'триллер', 'документальный'],
    required: true
  }
});

export default model<IFilm>('Film', filmSchema);
