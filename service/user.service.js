import { client } from "../index.js";

export async function logoutUserAndDeleteToken(email) {
    return await client
        .db('reset-password')
        .collection('token')
        .deleteOne({ email: email });
}
export async function resetPassword(data) {
    return await client
        .db("reset-password")
        .collection("signin-signup")
        .updateOne({ email: data.email }, { $set: { password: data.password } });
}
export async function creatingUser(userDetails) {
    return await client
        .db("reset-password")
        .collection("signin-signup")
        .insertOne(userDetails);
}
export async function creatingAndStoreUserToken(userFromDB, token) {
    return await client
        .db("reset-password")
        .collection("token")
        .insertOne({
            email: userFromDB.email,
            my_token: token
        });
}
export async function getingUserName(email) {
    return await client
        .db("reset-password")
        .collection("signin-signup")
        .findOne({ email: email });
}
