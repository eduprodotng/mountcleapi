import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  motto: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  phonetwo: {
    type: String,
  },
  currency: {
    type: String,
  },
  email: {
    type: String,
  },
  sessionStart: {
    type: String,
  },
  sessionEnd: {
    type: String,
  },
  schoolLogo: {
    type: String,
  },
});

const Account = mongoose.model("Account", accountSchema); // Change "School" to "Account"

export default Account;
