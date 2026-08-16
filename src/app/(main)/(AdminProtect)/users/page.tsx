"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { failureLoader, successLoader } from "../../utils/utils";
import { blockUser, getAllUsers } from "../../utils/userApi";

interface UserRow {
    _id: string;
    name: string;
    email: string;
    address: string;
    mobile: string;
    isBlock: boolean;
}

export default function Users() {

    const [rows, setRows] = useState<UserRow[]>([]);

    const columns: GridColDef[] = [

        {field: "name",headerName: "Name",width: 150},
        {field: "email",headerName: "Email",width: 220},
        {field: "address",headerName: "Address",width: 200},
        {field: "mobile",headerName: "Mobile Number",width: 160},
        {field: "isBlock",headerName: "Is Block",width: 120,renderCell: (params) => (
                <span className={params.row.isBlock ? "text-red-500 font-medium" : "text-[#10b981] font-medium"}>
                    {params.row.isBlock ? "Blocked" : "Active"}
                </span>
            )},

        {
  field: "blockUser",
  headerName: "Block User",
  width: 140,
  renderCell: (params) => (
    <i
      className="bi bi-ban"
      style={{
        cursor: "pointer",
        fontSize: "20px",
        color: params.row.isBlock ? "red" : "black"
      }}
      onClick={() => handBlock(params.row._id)}
    />
  )
}
    ];

    const handBlock = async (id: string) => {

        try {

            const response = await blockUser(id, {});

            if (response.success === true) {

                successLoader(response.message);

                fetchUsers();

            } else {

                failureLoader(response.message);
            }

        } catch (error: any) {

            failureLoader(error.message);
        }
    };

    const fetchUsers = async () => {

        try {

            const response = await getAllUsers();

            console.log("Users Response", response);

            if (response.success === true) {

                setRows(response.data);
            }

        } catch (error: any) {

            failureLoader(error.message);
        }
    };

    useEffect(() => {

        fetchUsers();

    }, []);

    return (

        <div className="p-4 bg-[#f8fafc] min-h-[calc(100vh-56px)]">
            <div className="max-w-[1240px] mx-auto bg-white">
            <div className="px-5 py-4 border-b border-[#f0f0f0]">
            <h2 className="text-lg font-medium">
                Users
            </h2>
            </div>

            <div className="p-2">
            <DataGrid
                rows={rows}
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
                }}
            />
            </div>
            </div>

        </div>
    );
}
