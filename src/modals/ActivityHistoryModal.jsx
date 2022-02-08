import '../Page.css';
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton/IconButton";
import Table from "@mui/material/Table/Table";
import TableHead from "@mui/material/TableHead/TableHead";
import TableRow from "@mui/material/TableRow/TableRow";
import TableCell from "@mui/material/TableCell/TableCell";
import TableBody from "@mui/material/TableBody/TableBody";
import {emoticons} from "../constants";
import TablePagination from "@mui/material/TablePagination/TablePagination";

const Moment = require('moment');

function ActivityHistoryModal({show, setShowHistory, user, setShowActivityModal, setUser, setEditActivityLog}) {
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setEntriesPerPage(+event.target.value);
        setPage(0);
    };

    const handleClose = () => {
        setPage(0);
        setShowHistory(false);
    };

    const deleteLog = (id) => {
        const requestOptions = {
            method: 'DELETE',
        };

        fetch(`http://localhost:8081/api/users/${user.id}/activityLog/delete/${id}`, requestOptions)
            .then(async res => {
                const data = await res.json();

                if (!res.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || res.status;
                    return Promise.reject(error);
                }
                setUser(data);
            })
            .catch(error => {
                console.log(error)
            });
    };

    const editLog = (log) => {
        setEditActivityLog(log);
        setShowActivityModal(true);
        setShowHistory(false);
    };

    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-90w"
            centered
        >
            <Modal.Header>
                <Modal.Title>Activity Log</Modal.Title>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Header>

            <Modal.Body className="py-0">
                <div className="justify-content-center">
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Activity</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Reflection</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                user.activityLog != null ?
                                    user.activityLog
                                        .sort((a, b) => new Moment(b.date).diff(new Moment(a.date)))
                                        .slice(currentPage * entriesPerPage, currentPage * entriesPerPage + entriesPerPage)
                                        .map((log) => {
                                            return <TableRow
                                                key={log.id}
                                                tabIndex={-1}
                                            >
                                                <TableCell>{new Moment(log.date).format("MMM Do YYYY")}</TableCell>
                                                <TableCell>{log.activity.name}</TableCell>
                                                <TableCell>{emoticons[log.rating].icon}</TableCell>
                                                <TableCell>{log.reflection}</TableCell>
                                                <TableCell>
                                                    <IconButton className="mx-1 col " variant="outlined"
                                                                onClick={() => editLog(log)}>
                                                        <EditIcon/>
                                                    </IconButton>
                                                    <IconButton className="mx-1 col " variant="outlined"
                                                                onClick={() => deleteLog(log.id)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        }) : "No activities logged yet"
                            }
                        </TableBody>
                    </Table>
                    <TablePagination
                        style={{ verticalAlign: "text-top"}}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={user.activityLog.length}
                        rowsPerPage={entriesPerPage}
                        page={currentPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ActivityHistoryModal