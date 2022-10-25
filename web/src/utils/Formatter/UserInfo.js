import moment from "moment";

export const UserInfoFormatter = (user) => {
  const createdAt = moment(user.createdAt).format("DD-MM-YYYY");
  const name = `${user.firstname} ${user.lastname}`;
  const role = user.role.toLowerCase();
  return {
    id: user.id,
    name,
    firstName: user.firstname,
    lastName: user.lastname,
    email: user.email,
    role,
    createdAt,
  };
};
