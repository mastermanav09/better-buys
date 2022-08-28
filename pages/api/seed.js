import User from "../../models/user";
import data from "../../utils/data";
import db from "../../utils/db";

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();

  const users = JSON.parse(data).users;
  await User.insertMany(users);
  await db.disconnect();
  res.send({ message: "sended successfully!" });
};

export default handler;
