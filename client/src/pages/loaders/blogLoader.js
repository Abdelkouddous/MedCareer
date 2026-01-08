import customFetch from "../../utils/customFetch.js";

export const blogLoader = async () => {
  try {
    const response = await customFetch.get("/auth/showMe");
    return { user: response.data.user };
  } catch (error) {
    return { user: null };
  }
};




