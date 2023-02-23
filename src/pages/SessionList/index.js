import { useContext, useEffect, useState } from "react";
import CSS from "./index.module.css"

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from "axios";
import { millisToMinutesAndSeconds } from "../../utils/services/functions";
import moment from 'moment'
import 'moment/locale/tr'  // without this line it didn't work
import { StateContext } from "../../utils/context/StateContext";
import { IoArrowBackCircleOutline } from "react-icons/io5";
moment.locale('tr')

const columns = [
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
    id: 'room',
    label: 'Oda',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'start_date',
    label: 'Başlangıç',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'duration',
    label: 'Süre',
    minWidth: 170,
    align: 'right',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'price',
    label: 'Ücret (₺)',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'is_paid',
    label: 'Ödendi mi?',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
  {
    id: 'is_completed',
    label: 'Tamamlandı mı?',
    minWidth: 170,
    align: 'center',
    // format: (value) => value.toFixed(2),
  },
];

function createData(start_date, duration, price, is_paid, is_completed, name, gender,room) {

  return { start_date, duration, price, is_paid, is_completed, name, gender,room };
}


function SessionList() {
  const {setHeaderContent} = useContext (StateContext)
  const [rows, setRows] = useState ([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getSessions = async () => {
    //TODO filtreleme yap
    // client
    // room
    // is_paid
    // is_completed
    const sessions = await axios.get ('sessions?filters&populate=*')

    setRows(sessions.data.map ((session) => {
      const sessionData = session.attributes
      const startTime = new Date (sessionData.start_time).getTime ()
      const endTime = new Date (sessionData.end_time).getTime ()
      const duration = millisToMinutesAndSeconds(endTime - startTime)

      return createData(
        moment(startTime).format('MMMM Do YYYY, HH:mm:ss'),
        duration,
        sessionData.price,
        sessionData.is_paid === true ? 'V' : sessionData.is_paid === false ? 'X' : null,
        sessionData.is_completed === true ? 'V' : sessionData.is_completed === false ? 'X' : null,
        sessionData.client.data.attributes.name,
        sessionData.client.data.attributes.gender,
        sessionData.room.data.attributes.name)
      }))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect (() => {
    getSessions ()
    setHeaderContent (
      <>
        <a href="/"><IoArrowBackCircleOutline size={'3rem'} className={CSS["go-back-icon"]}/></a>
        <h2 className={CSS["page-header"]}>Seanslarım</h2>
      </>
    )
  },[])

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
  </div>;
}

export default SessionList