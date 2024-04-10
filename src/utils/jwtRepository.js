import jwt from "jsonwebtoken";

const signOptions = { expiresIn: "1d" };

export function generateToken(userId, role) {
  const token = jwt.sign({ userId, role }, process.env.JWT_KEY, signOptions);

  return token;
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, signOptions, (err, data) => {
      if (err) {
        reject("Please login to continue");
      }
      resolve({ userId: data.userId });
    });
  });
}
