"use client";

import { useEffect, useRef, useState } from "react";
import { BsTrash } from "react-icons/bs";
import {
  addAddress,
  Address,
  deleteAddress,
  getAddressesByUser,
} from "../utils/addressApi";
import { failureLoader, getLoginData, successLoader } from "../utils/utils";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (addressId: string) => void;
}

const emptyForm = {
  fullName: "",
  mobile: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AddressModal({ open, onClose, onConfirm }: AddressModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    const response = await getAddressesByUser();
    if (response?.success === true) {
      const list: Address[] = response.data || [];
      setAddresses(list);
      const defaultAddress = list.find((item) => item.isDefault);
      setSelectedId(defaultAddress?._id || list[0]?._id || "");
      setShowForm(list.length === 0);
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      const user = getLoginData();
      setForm({
        ...emptyForm,
        fullName: user?.name || "",
        mobile: user?.mobile?.toString() || "",
      });
      fetchAddresses();
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    setShowForm(false);
    setForm(emptyForm);
    onClose();
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveAddress = async () => {
    if (
      !form.fullName ||
      !form.mobile ||
      !form.addressLine ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      failureLoader("Please fill all address fields");
      return;
    }

    setLoading(true);
    try {
      const response = await addAddress({
        ...form,
        isDefault: addresses.length === 0,
      });

      if (response?.success === true) {
        successLoader("Address saved successfully");
        setForm(emptyForm);
        setShowForm(false);
        await fetchAddresses();
        if (response.data?._id) {
          setSelectedId(response.data._id);
        }
      } else {
        failureLoader(response?.message || "Failed to save address");
      }
    } catch (error: any) {
      failureLoader(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this address?");
    if (!confirmed) return;

    const response = await deleteAddress(id);
    if (response?.success === true) {
      successLoader("Address deleted");
      await fetchAddresses();
    } else {
      failureLoader(response?.message || "Failed to delete address");
    }
  };

  const handleContinue = () => {
    if (!selectedId) {
      failureLoader("Please select a delivery address");
      return;
    }
    onConfirm(selectedId);
    handleClose();
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={handleClose}>
      <div className="modal-box w-11/12 max-w-2xl rounded-sm p-0 overflow-hidden">
        <div className="bg-[#6366f1] px-6 py-4">
          <h3 className="text-lg font-medium text-white">Select Delivery Address</h3>
          <p className="text-sm text-white/80 mt-1">
            Choose a saved address or add a new one for delivery
          </p>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {addresses.length > 0 && (
            <div className="space-y-3 mb-6">
              {addresses.map((address) => (
                <label
                  key={address._id}
                  className={`flex items-start gap-3 border rounded-sm p-4 cursor-pointer transition-colors ${
                    selectedId === address._id
                      ? "border-[#6366f1] bg-[#eef2ff]"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="radio radio-primary mt-1"
                    checked={selectedId === address._id}
                    onChange={() => setSelectedId(address._id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0f172a]">
                        {address.fullName}
                      </span>
                      {address.isDefault && (
                        <span className="text-xs bg-[#6366f1] text-white px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#64748b] mt-1">
                      {address.addressLine}, {address.city}, {address.state} -{" "}
                      {address.pincode}
                    </p>
                    <p className="text-sm text-[#64748b]">Mobile: {address.mobile}</p>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-600 p-1"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(address._id);
                    }}
                  >
                    <BsTrash className="text-lg" />
                  </button>
                </label>
              ))}
            </div>
          )}

          {!showForm ? (
            <button
              type="button"
              className="btn btn-outline w-full border-dashed"
              onClick={() => setShowForm(true)}
            >
              + Add New Address
            </button>
          ) : (
            <div className="border border-[#e2e8f0] rounded-sm p-4 space-y-4">
              <h4 className="font-medium text-[#0f172a]">Add New Address</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    className="input input-bordered w-full"
                    value={form.fullName}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Mobile</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Enter mobile number"
                    className="input input-bordered w-full"
                    value={form.mobile}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Address</span>
                </label>
                <textarea
                  name="addressLine"
                  placeholder="House no, street, area"
                  className="textarea textarea-bordered w-full"
                  value={form.addressLine}
                  onChange={handleFormChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">City</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="input input-bordered w-full"
                    value={form.city}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">State</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="input input-bordered w-full"
                    value={form.state}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Pincode</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    className="input input-bordered w-full"
                    value={form.pincode}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="fk-orange-btn px-6 py-2 text-sm"
                  onClick={handleSaveAddress}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Address"}
                </button>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#e2e8f0] px-6 py-4 flex justify-end gap-3">
          <button type="button" className="btn btn-outline" onClick={handleClose}>
            Close
          </button>
          <button
            type="button"
            className="fk-orange-btn px-8 py-2.5 text-sm"
            onClick={handleContinue}
            disabled={!selectedId}
          >
            Deliver Here
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}
