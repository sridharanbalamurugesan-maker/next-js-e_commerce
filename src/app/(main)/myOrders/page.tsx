"use client"

import { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
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
    const router=useRouter();

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
        {field:"image", headerName:"Image",width:140,renderCell:(params)=>(
                <img src={params.value}
                alt="image"
                className="cursor-pointer"
                onClick={() => router.push(`/viewProduct/${params.row.productId}`)}
                style={{width:50,height:50,objectFit:"cover"}}/>)},
        {field:"product", headerName:"Product",flex:1,minWidth:160,renderCell:(params)=>(
                <button
                  className="text-[#6366f1] text-left"
                  onClick={() => router.push(`/viewProduct/${params.row.productId}`)}
                >
                  {params.value}
                </button>
        )},
        {field:"quantity",headerName:"Quantity",width:140},
        {field:"review",headerName:"Review",width:180,renderCell:(params)=>(
        <button className="btn btn-primary btn-sm" style={{cursor:"pointer"}} onClick={()=>{handleReview(params.row)}} >Review</button>
        )},
        {
          field:"Edit",
          headerName:"Edit",
          width:120,
          align:"center",
          headerAlign:"center",
          sortable:false,
          filterable:false,
          renderCell:(params)=>(
            <div className="flex items-center justify-center w-full h-full">
              <BsPencilFill
                className="text-[#6366f1] cursor-pointer text-lg"
                onClick={() => handleUpdate(params.row)}
              />
            </div>
          )
        }
    ]
    const handleReview=async(row:any)=>{
        setProductIds(row.productId);
        setReviewMode("add");
         const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                modal?.showModal();
    }
    const handleUpdate=async(row:any)=>{
                setProductIds(row.productId);
                setReviewMode("edit");
          const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                modal?.showModal();
    }
    const handlereload=()=>{
            setReload((prev)=>!prev)
        }
    return(
    <>
    <div className="bg-[#f8fafc] min-h-[calc(100vh-56px)] p-4">
      <div className="max-w-[1240px] mx-auto bg-white">
        <div className="border-b border-[#f0f0f0] px-5 py-4">
          <h3 className="text-lg font-medium">My Orders</h3>
        </div>
        <ReviewModal
        productId={productIds}
        setRating={setRating}
        rating={rating}
        reviewMode={reviewMode}/>

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
          autoHeight
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: 600,
            },
          }}/>
        </div>
      </div>
    </div>
    </>
    )
}
