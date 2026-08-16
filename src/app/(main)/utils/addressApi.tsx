import { axiosDelete, axiosGet, axiosPost, axiosPut } from "./Api";

export interface Address {
  _id: string;
  fullName: string;
  mobile: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export const addAddress = async (payload: unknown) => {
  let data;
  try {
    data = await axiosPost("/address/add", payload);
  } catch (error) {
    return false;
  }
  return data?.data;
};

export const getAddressesByUser = async () => {
  let data;
  try {
    data = await axiosGet("/address/get-by-user");
  } catch (error) {
    return false;
  }
  return data?.data;
};

export const updateAddress = async (id: string, payload: unknown) => {
  let data;
  try {
    data = await axiosPut(`/address/update/${id}`, payload);
  } catch (error) {
    return false;
  }
  return data?.data;
};

export const deleteAddress = async (id: string) => {
  let data;
  try {
    data = await axiosDelete(`/address/delete/${id}`);
  } catch (error) {
    return false;
  }
  return data?.data;
};

export const setDefaultAddress = async (id: string) => {
  let data;
  try {
    data = await axiosPut(`/address/set-default/${id}`, {});
  } catch (error) {
    return false;
  }
  return data?.data;
};
