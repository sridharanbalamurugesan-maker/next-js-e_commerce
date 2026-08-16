"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react"
import { deleteCategory, getAllCategory } from "../../utils/categoryApi";
import { failureLoader, successLoader } from "../../utils/utils";
import { BsPencilFill, BsTrash } from "react-icons/bs";
import CategoryModal from "../../components/CategoryModal";


interface CategoryType{
  _id:string;
  name:string;
  image:string;
}
export default function category(){
        const [row,setRow]=useState<CategoryType[]>([]);
        const [reload,setReload]=useState(false);
        const [updateData,setUpdateData]=useState<CategoryType|null>(null);
        useEffect(()=>{
            const category=async()=>{
                try {
                const response=await getAllCategory();
            if(response.success==true){
                setRow(response.data);
                return;
            }
            } catch (error:any) {
                failureLoader(error.message)
            }
            }
            category();
        },[reload])
        const columns:GridColDef[]=[
            {field:"name",headerName:"Category Name",width:200},
            {field:"image",headerName:"Image",width:300,renderCell:(params)=>{return(
                <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${params.value}`}
                alt="category image" 
                style={{width:50,height:50,objectFit:"cover"}}/>
            )}},
            {field:"edit",headerName:"Edit",width:120,renderCell:(params)=>(
                <BsPencilFill className="text-[#6366f1] cursor-pointer text-lg" style={{cursor:"pointer"}}  onClick={() => handleUpdate(params.row)}/>
            )},
              {field:"delete",headerName:"Detele",width:120,renderCell: (params) => (
      <BsTrash className="text-red-500 cursor-pointer text-lg" style={{cursor:"pointer"}} onClick={() => handleDelete(params.row._id)}/>)} 
        ]
        const handleUpdate=(row:any)=>{
            setUpdateData(row);
          const modal = document.getElementById("my_modal_2")as HTMLDialogElement;
                          modal?.showModal();
        };
        const handleDelete=async(id:string)=>{
            const confirmDelete = window.confirm("Make Sure To Delete");
             if(!confirmDelete){
                return;
             }
            try {
                await deleteCategory(id);
                successLoader("deleted");
                handlereload();
            } catch (error:any) {
                failureLoader(error.message)
            }
        };
        const handleModal=()=>{
          const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
                modal?.showModal();
                setUpdateData(null);
        }
        const handlereload=()=>{
            setReload((prev)=>!prev)
        }

    return(
    <div className="w-full p-4 bg-[#f8fafc] min-h-[calc(100vh-56px)]">
    <div className="max-w-[1240px] mx-auto bg-white">
    <div className="flex items-center justify-between w-full px-5 py-4 border-b border-[#f0f0f0]">
        <h2 className="text-lg font-medium">Category</h2>
        <button className="btn btn-primary" onClick={handleModal}>Add Category</button>
    </div>
    <CategoryModal 
    handleReload={handlereload}
    updateData={updateData}/>
    <div className="p-2">
    <DataGrid
    rows={row}
    columns={columns}
    getRowId={(row) => row._id}
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
    )
}
