"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import AddressModal from "../components/AddressModal";
import { deleteById, getCartByUser } from "../utils/cartApi";
import {failureLoader,getLoginData,notifyCartUpdated,successLoader} from "../utils/utils";
import { makePayment } from "../utils/paymentApi";
import { orderStatusChange } from "../utils/order";

interface CartRow {
  id: string;

  product: string;

  image: string;

  quantity: number;

  price: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Cart() {

  const [rows, setRows] = useState<CartRow[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedData, setSelectedData] = useState<CartRow[]>([]);

  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {

    const data = rows.filter((e) =>
      selectedIds.includes(e.id)
    );
    console.log("selectedId",data);
    console.log("selectedIdss",selectedIds);
    setSelectedData(data);

  }, [selectedIds, rows]);

  const fetchCart = async () => {

    try {

      const userId = getLoginData();

      const response = await getCartByUser(userId._id);

      if (response.success === true) {

        const data = response.data;

        const formatted: CartRow[] = data.map(
          (item: any, index: number) => ({
            id: item._id || index.toString(),

            product: item.product?.name,

            image: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.product?.image}`,

            quantity: item.quantity,

            price: item.totalPrice,
          })
        );

        setRows(formatted);
        notifyCartUpdated();

      }

    } catch (error: any) {

      failureLoader(error.message);

    }
  };

  const handleDelete = async (id: string) =>{

    try {

      const confirmDelete = window.confirm(
        "Are you sure to delete?"
      );

      if (!confirmDelete) return;

      const response = await deleteById(id);

      successLoader(response.message);

      fetchCart();

    } catch (error: any) {

      failureLoader(error.message);

    }
  };

  const calculateTotalValue = () => {
    return selectedData.reduce(
      (acc, curr) => Number(curr.price) + Number(acc),0);
    };

  const total = calculateTotalValue();

  const handleBuy = () => {
    if (total === 0) return;
    setShowAddressModal(true);
  };

  const proceedToPayment = async (addressId: string) => {
      if (!window.Razorpay) {
    alert("Razorpay not loaded");
    return;
  }
    try {

      const userId = getLoginData();

      const payload = {
        user_id: userId._id,
        address_id: addressId,
        order_data: selectedData.map((e) => ({
          id: e.id,
        })),
      };
      const paymentRes = await makePayment(payload);
      if (!paymentRes || paymentRes.success === false) {
        failureLoader(paymentRes?.message || "Payment initialization failed");
        return;
      }
       console.log("Payment Response", paymentRes);
       const options = {

   key: paymentRes.key,

   amount: paymentRes.amount,

   currency: paymentRes.currency,

   name: 'Payment Gateway',

   description: 'Test Transaction',

   order_id: paymentRes.order_id,

   handler: async function (response:any){

      console.log("Razorpay Response", response);

      console.log("Mongo IDs", paymentRes.mongoOrderId);

      for(let id of paymentRes.mongoOrderId){

         await orderStatusChange(id,{
            status:"completed",
            address_id: addressId,
         });

      }

      successLoader("Payment Success");
      fetchCart();
      
   },

   prefill: {
      name: userId.name || 'Customer',
      email: userId.email || '',
      contact: userId.mobile?.toString() || ''
   },

   theme: {
      color: '#6366f1'
   },
};
      const rzp = new window.Razorpay(options);
      rzp.open();

        setSelectedIds([]);

        setSelectedData([]);
        
      

    } catch (error: any) {

      failureLoader(error.message);

    }
  };

  const columns: GridColDef[] = [

    {field: "product",headerName: "Name",flex: 1, minWidth: 180,},

    {field: "image",headerName: "Image",width: 140,renderCell: (params) => (
        <img
          src={params.value}
          alt="product"
          width={50}
          height={50}
          style={{
            objectFit: "cover",
            borderRadius: "2px",
          }}
        />
      ),
    },
    {field: "quantity", headerName: "Quantity",width: 120},
    {field: "price",headerName: "Price",width: 140, renderCell: (params) => (
      <span className="font-semibold">₹{params.value}</span>
    )},
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex items-center justify-center w-full h-full">
          <BsTrash
            className="text-red-500 cursor-pointer text-lg"
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-56px)] p-4">
      <AddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onConfirm={proceedToPayment}
      />
      <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white">
          <div className="border-b border-[#f0f0f0] px-5 py-4">
            <h2 className="text-lg font-medium">My Cart ({rows.length})</h2>
          </div>
          <div className="p-2">
            <DataGrid
              rows={rows}
              columns={columns}
              pagination
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              autoHeight
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: 600,
                },
              }}
              onRowSelectionModelChange={(selection) => {

                const idsArray = Array.from(
                  selection.ids
                ) as string[];

                setSelectedIds(idsArray);

                console.log("Selected Ids", idsArray);
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-[320px] bg-white h-fit">
          <div className="border-b border-[#f0f0f0] px-5 py-4">
            <h3 className="text-sm font-medium text-[#64748b] uppercase tracking-wide">Price Details</h3>
          </div>
          <div className="px-5 py-4 space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Price ({selectedData.length} items)</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-[#10b981]">FREE</span>
            </div>
            <div className="border-t border-dashed border-[#e2e8f0] pt-4 flex justify-between text-base font-semibold">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
          </div>
          <div className="px-5 pb-5">
            <button
              className="fk-orange-btn w-full py-3.5 text-sm"
              onClick={handleBuy}
              disabled={total === 0}
              >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
