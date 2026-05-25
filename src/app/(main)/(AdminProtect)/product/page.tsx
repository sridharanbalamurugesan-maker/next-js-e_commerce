"use client";
import { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { BsPencilFill, BsTrash } from "react-icons/bs";
import { deleteCategory, updateCategory } from "../../utils/categoryApi";
import { failureLoader, successLoader } from "../../utils/utils";
import { deleteProduct, getAllProduct } from "../../utils/productApi";
import ProductModal from "../../components/ProductModal";

export default function Product(){
    interface Product{
        _id:string;
        name:string;
        price:number;
        description:string;
        stocks:number;
        category:string;
        brand:string;
        isFreeShipping:boolean;
        image:File|string;
    }
    const [row,setRow]=useState<Product[]>([]);
    const [updateData,setUpdateData]=useState<Product|null>(null);
    const [reload,setReload]=useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);

    useEffect(()=>{
        const Product=async()=>{
            try {
                const response=await getAllProduct(page+1,pageSize);
                if(response.success==true){
                    setRow(response.data);
                    setRowCount(response.total||0);
                    return;
                }
            } catch (error:any) {
                failureLoader(error.message);
            }
        }
        Product();
    },[page,pageSize,reload])
    const columns:GridColDef[]=[
        {field:"name",headerName:"Product Name",width:200},
        {field:"price",headerName:"Price",width:200},
        {field:"description",headerName:"Description",width:200},
        {field:"stocks",headerName:"Stocks",width:200},
        // {field:"category",headerName:"Category ID",width:400},
        {field:"image",headerName:"Image",renderCell:(params)=>(
            <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${params.value}`}
            alt="product image"
            style={{width:50,height:50,objectFit:"cover"}} />
        )},
        {field:"edit",headerName:"Edit",width:120,renderCell:(params)=>(
        <BsPencilFill className="text-blue-500 cursor-pointer text-lg" style={{cursor:"pointer"}}  onClick={() => handleUpdate(params.row)}/>
                    )},
        {field:"delete",headerName:"Detele",width:120,renderCell: (params) => (
              <BsTrash className="text-red-500 cursor-pointer text-lg" style={{cursor:"pointer"}} onClick={() => handleDelete(params.row._id)}/>)}         
    ]
    const handleUpdate=async(row:any)=>{
        console.log("Product Edit",row);
        setUpdateData(row);
         const modal = document.getElementById("my_modal_2")as HTMLDialogElement;
                          modal?.showModal();
    }
    const handleDelete=async(id:string)=>{
        const confirmDelete = window.confirm("Make Sure To Delete");
             if(!confirmDelete){
                return;
             }
             try {
                await deleteProduct(id);
                successLoader("deleted");
                handleReload();
             } catch (error:any) {
                failureLoader(error.message);
             }
    }
    const handleModal=()=>{
          const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                modal?.showModal();
                setUpdateData(null);
        }
    const handleReload=()=>{
            setReload((prev)=>!prev)
        }
    return(
    <div className="w-full p-5">
    <div className="flex items-center justify-between w-full mb-5">
        <h2 className="text-2xl font-bold">Product</h2>
        <button className="btn btn-primary" onClick={handleModal}>Add Product</button>
    </div>
    <ProductModal
    handleReload={handleReload}
    updateData={updateData}/>
    <DataGrid
    rows={row}
    columns={columns}
    getRowId={(row) => row._id}
    pagination
    paginationMode="server"

    rowCount={rowCount||0}

    paginationModel={{
        page,
        pageSize
    }}

    onPaginationModelChange={(model) => {
        setPage(model.page);
        setPageSize(model.pageSize);
    }}

    pageSizeOptions={[5,10,100]}>
    </DataGrid>
    <h2>Product</h2>
    </div>)
}