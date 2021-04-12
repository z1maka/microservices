import { Schema, model, Document, Model } from "mongoose";
import { PasswordService } from "../services/password";

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
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 7,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

userSchema.statics.build = (attr: userAttributes) => {
  return new User(attr);
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordService.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const User = model<UserDocument, UserModel>("User", userSchema);

export { User };
