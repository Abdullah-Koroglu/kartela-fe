import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import CSS from './index.module.css'
import { StateContext } from "../../utils/context/StateContext";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { IoArrowBackCircleOutline } from 'react-icons/io5';


const columns = [
  {
    id: 'tc_id',
    label: 'T.C. Kimlik',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'name',
    label: 'İsim',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'gender',
    label: 'Cinsiyet',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'age',
    label: 'Yaş',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  }
];

function createData(client) {
  const {name, gender, tc_id, birth_date} = client.attributes
  var month_diff = new Date () - new Date (birth_date).getTime ()
  var age_dt = new Date(month_diff);
  var year = age_dt.getUTCFullYear();
  var age = Math.abs(year - 1970);

  return { name, gender, tc_id: tc_id ?? '-', birth_date, age};
}

const Clients = () => {
  const {setHeaderContent} = useContext (StateContext)
  const [rows, setRows] = useState ([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getClients = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const clients = await axios.get (`clients?filters[$and][0][therapist][id]=${user.id}&filters[$and][1][active][$ne]=false&populate=*`)

    // setClients (clients.data)
    setRows (clients.data.map (client => createData (client)))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect (() => {
    getClients ()
    setHeaderContent (
      <>
        <a href="/"><IoArrowBackCircleOutline size={'3rem'} className={CSS["go-back-icon"]}/></a>
        <h2 className={CSS["page-header"]}>Danışanlarım</h2>
      </>
    )
  },[setHeaderContent])

  return <div className={CSS["main-container"]}>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ?.map((row) => {
                return (
                  <TableRow key={row.name} hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  </div>
}

export default Clients