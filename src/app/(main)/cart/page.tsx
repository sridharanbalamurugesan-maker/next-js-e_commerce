"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { deleteById, getCartByUser } from "../utils/cartApi";
import {failureLoader,getLoginData,successLoader} from "../utils/utils";
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

      }

    } catch (error: any) {

      failureLoader(error.message);

    }
  };

  const handleDelete = async (id: string) => {

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

  const handleBuy = async () => {
      if (!window.Razorpay) {
    alert("Razorpay not loaded");
    return;
  }
    try {

      const userId = getLoginData();

      const payload = {
        user_id: userId._id,
        order_data: selectedData.map((e) => ({
          id: e.id,
        })),
      };
      const paymentRes = await makePayment(payload);
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
            status:"completed"
         });

      }

      successLoader("Payment Success");
      fetchCart();
      
   },

   prefill: {
      name: 'Gaurav Kumar',
      email: 'gaurav.kumar@example.com',
      contact: '9999999999'
   },

   theme: {
      color: '#F37254'
   },
};
      const rzp = new window.Razorpay(options);
      rzp.open();

        fetchCart();

        setSelectedIds([]);

        setSelectedData([]);
        
      

    } catch (error: any) {

      failureLoader(error.message);

    }
  };

  const columns: GridColDef[] = [

    {field: "product",headerName: "Name",width: 200,},

    {field: "image",headerName: "Image",width: 200,renderCell: (params) => (
        <img
          src={params.value}
          alt="product"
          width={50}
          height={50}
          style={{
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      ),
    },
    {field: "quantity", headerName: "Quantity",width: 150},
    {field: "price",headerName: "Price",width: 150},
    {field: "delete",headerName: "Delete",width: 120,renderCell: (params) => (
        <BsTrash
          className="text-red-500 cursor-pointer text-lg"
          onClick={() => handleDelete(params.row.id)}
        />
      ),
    },
  ];
  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Cart Page</h2>
      <hr />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 100]}
        checkboxSelection
        onRowSelectionModelChange={(selection) => {

          const idsArray = Array.from(
            selection.ids
          ) as string[];

          setSelectedIds(idsArray);

          console.log("Selected Ids", idsArray);
        }}
      />
      <div  className="flex items-center justify-between mt-5 px-5">

        <div>Total:</div>

        <div className="ml-3">
          {total}
        </div>

        <div>
          <button
            className="btn btn-primary flex justify flex row"
            onClick={handleBuy}
            disabled={total === 0}
            >
            Buy
          </button>
        </div>

      </div>

    </div>
  );
}