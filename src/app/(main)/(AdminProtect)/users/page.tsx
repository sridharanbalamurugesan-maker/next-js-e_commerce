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
                <span>
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

        <div className="p-5">

            <h2 className="text-2xl font-bold mb-5">
                Users Page
            </h2>

            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row._id}
                pageSizeOptions={[5, 10, 100]}
                autoHeight
            />

        </div>
    );
}