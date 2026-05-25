"use client"

import { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { BsPencilFill } from "react-icons/bs";
import { editOrder, getAllOrder } from "../utils/order";
import ReviewModal from "../components/ReviewModal";

interface CartRow {
  id: string;

  product: string;

  productId:string;

  image: string;

  quantity: number;

  price: number;
}
export default function MyOrders(){
    const [rows,setRows]=useState<CartRow[]>([]);
    const [reload,setReload]=useState(false);
    const [rating, setRating] = useState(5);
    const [productIds,setProductIds]=useState<string>("");
    const [reviewMode, setReviewMode] = useState("add");

    useEffect(()=>{
        const fetchOrder=async()=>{
            const response=await getAllOrder();
            if(response.success==true){
                console.log("myORderResponse",response);
                const data=response.data; 
                console.log("ProductIds",data);
                   const formatted: CartRow[] = data.map(
          (item: any, index: number) => ({
            id: item._id || index.toString(),

            product: item.product?.name,

             productId: item.product?._id,

            image: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.product?.image}`,

            quantity: item.quantity,

            price: item.totalPrice,

          })
        );
                setRows(formatted);
                console.log("formatedData",formatted);
            }
        }
        fetchOrder();
    },[reload])
    const columns:GridColDef[]=[
        {field:"image", headerName:"Image",width:200,renderCell:(params)=>(
                <img src={params.value}
                alt="image" 
                style={{width:50,height:50,objectFit:"cover"}}/>)},
        {field:"quantity",headerName:"Quantity",width:200},
        {field:"review",headerName:"Review",width:200,renderCell:(params)=>(
        <button className="btn btn-primary" style={{cursor:"pointer"}} onClick={()=>{handleReview(params.row)}} >Review</button>
        )},
        {field:"Edit",headerName:"Edit",width:200,renderCell:(params)=>(
        <BsPencilFill className="text-blue-500 cursor-pointer text-lg" style={{cursor:"pointer"}}  onClick={() => handleUpdate(params.row)}/>
        )}
    ]
    const handleReview=async(row:any)=>{
         const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                modal?.showModal();
        setProductIds(row.productId);
        setReviewMode("add");
    }
    const handleUpdate=async(row:any)=>{
          const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                modal?.showModal();
                setProductIds(row.productId);
                setReviewMode("edit");
    }
    const handlereload=()=>{
            setReload((prev)=>!prev)
        }
    return(
    <>
    <h3 className="flex justify-center items-center">My Orders</h3>
    <ReviewModal
    productId={productIds}
    setRating={setRating}
    rating={rating}
    reviewMode={reviewMode}/>

    <DataGrid
    rows={rows}
    columns={columns}
    pageSizeOptions={[5,10,100]}/>
    </>
    )
}