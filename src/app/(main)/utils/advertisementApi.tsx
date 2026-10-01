import { axiosDelete, axiosGet, axiosPost } from "./Api";

export const getActiveAdvertisement = async () => {
  try {
    const data = await axiosGet("/advertisement/active");
    return data?.data;
  } catch {
    return false;
  }
};

export const setAdvertisement = async (productId: string) => {
  try {
    const data = await axiosPost("/advertisement", { productId });
    return data?.data;
  } catch {
    return false;
  }
};

export const clearAdvertisement = async () => {
  try {
    const data = await axiosDelete("/advertisement");
    return data?.data;
  } catch {
    return false;
  }
};
