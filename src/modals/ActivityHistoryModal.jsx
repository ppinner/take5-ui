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
import {alertService} from "../alert/alert-service";

const Moment = require('moment');

function ActivityHistoryModal({show, setShowHistory, activityLog, setShowActivityModal, setUser, setEditActivityLog, setActivityLog, setUpdatedActivityLog}) {
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
        alertService.clear();
    };

    const deleteLog = (id) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/plain'
            }
        };

        fetch(`http://localhost:8081/api/activityLog/delete/${id}`, requestOptions)
            .then(() => {
                setUpdatedActivityLog(true);
                alertService.success('Log was deleted successfully');

            })
            .catch(error => {
                alertService.error('Could not delete activity log');
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
            size="lg"
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
                                activityLog.length > 0 ?
                                    activityLog
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
                                        }) : <div className="m-2">No activities logged yet</div>
                            }
                        </TableBody>
                    </Table>
                    <TablePagination
                        style={{verticalAlign: "text-top"}}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={activityLog ? activityLog.length : 0}
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