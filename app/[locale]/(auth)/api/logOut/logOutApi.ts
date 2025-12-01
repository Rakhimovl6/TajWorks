import axios from "axios";

export async function logOut(refresh: string) {
  console.log("logOut() CALLED WITH:", refresh); // A

  try {
    const res = await axios.post(
      "https://tajwork.softclub.tj/auth/logout/",
      { token: refresh }
    );

    console.log("SERVER RESPONSE:", res.status); // B
    return true;

  } catch (err) {
    console.log("LOGOUT ERROR:", err); // C
    return true;
  }
}

