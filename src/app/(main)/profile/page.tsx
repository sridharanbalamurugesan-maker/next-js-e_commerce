"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_PROFILE_IMAGE,
  failureLoader,
  getLoginData,
  getProfileImageUrl,
  notifyProfileUpdated,
  setLoginData,
  successLoader,
} from "../utils/utils";
import { getProfile, updateProfile } from "../utils/userApi";

interface ProfileForm {
  name: string;
  email: string;
  mobile: string;
  address: string;
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [imagePreview, setImagePreview] = useState(DEFAULT_PROFILE_IMAGE);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    const localUser = getLoginData();
    if (localUser) {
      setForm({
        name: localUser.name || "",
        email: localUser.email || "",
        mobile: localUser.mobile?.toString() || "",
        address: localUser.address || "",
      });
      setImagePreview(getProfileImageUrl(localUser.image));
    }

    const response = await getProfile();
    if (response?.success && response.data) {
      const user = response.data;
      setForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile?.toString() || "",
        address: user.address || "",
      });
      setImagePreview(getProfileImageUrl(user.image));
      setLoginData({ ...localUser, ...user });
      notifyProfileUpdated();
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.mobile || !form.address) {
      failureLoader("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("mobile", form.mobile);
      formData.append("address", form.address);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await updateProfile(formData);
      if (response?.success) {
        const localUser = getLoginData() || {};
        setLoginData({ ...localUser, ...response.data });
        notifyProfileUpdated();
        setImageFile(null);
        setImagePreview(getProfileImageUrl(response.data.image));
        successLoader(response.message || "Profile updated successfully");
      } else {
        failureLoader(response?.message || "Failed to update profile");
      }
    } catch (error: any) {
      failureLoader(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-56px)] p-4">
      <div className="max-w-[900px] mx-auto bg-white">
        <div className="border-b border-[#f0f0f0] px-5 py-4">
          <h2 className="text-lg font-medium">My Profile</h2>
          <p className="text-sm text-[#64748b] mt-1">
            Update your name, photo, and personal details
          </p>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:w-[240px] shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-[#e2e8f0] bg-[#f8fafc]">
              <img
                src={imagePreview || DEFAULT_PROFILE_IMAGE}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="fk-orange-btn mt-4 px-4 py-2 text-xs cursor-pointer">
              Change Photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <p className="text-xs text-[#94a3b8] mt-2 text-center">
              JPEG, PNG or WEBP
            </p>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <label className="text-sm font-medium text-[#0f172a]">Name</label>
              <input
                type="text"
                name="name"
                className="fk-input"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0f172a]">Email</label>
              <input
                type="email"
                name="email"
                className="fk-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0f172a]">Mobile</label>
              <input
                type="text"
                name="mobile"
                className="fk-input"
                placeholder="Enter mobile number"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0f172a]">Address</label>
              <textarea
                name="address"
                className="fk-input min-h-[80px] resize-none"
                placeholder="Enter address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <button
              type="button"
              className="fk-orange-btn px-8 py-2.5 text-sm"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
