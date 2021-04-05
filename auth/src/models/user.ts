import { Schema, model, Document, Model } from "mongoose";

interface userAttributes {
  email: string;
  password: string;
}

interface UserModel extends Model<any> {
  build(attr: userAttributes): UserDocument;
}

interface UserDocument extends Document {
  email: string;
  password: string;
  // createdAt: string;
  // updatedAt: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 7,
  },
});

userSchema.statics.build = (attr: userAttributes) => {
  return new User(attr);
};

const User = model<UserDocument, UserModel>("User", userSchema);

export { User };
