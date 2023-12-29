import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './DesktopView.module.css';
import { v4 as uuidv4 } from 'uuid';

const generateHexCode = () => {
  // Manual generation of a random 16-digit hex code
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  )
    .join('')
    .toUpperCase();
};

const encryptData = (data) => {
  // Dummy encryption function, you should use a secure encryption library
  return btoa(JSON.stringify(data));
};

const decryptData = (encryptedData) => {
  // Dummy decryption function, you should use a secure decryption library
  return JSON.parse(atob(encryptedData));
};

const DesktopView = () => {
  const [tableData, setTableData] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    // Load data from local storage on component mount
    const encryptedData = localStorage.getItem('tableData');
    if (encryptedData) {
      const decryptedData = decryptData(encryptedData);
      setTableData(decryptedData);
      setSubscriberCount(decryptedData.length);
    }
  }, []);

  useEffect(() => {
    // Save data to local storage whenever it changes
    const encryptedData = encryptData(tableData);
    localStorage.setItem('tableData', encryptedData);
    setSubscriberCount(tableData.length);
  }, [tableData]);

  const handleJoin = (name, email) => {
    const hexCode = generateHexCode();
    const newRow = { id: uuidv4(), name, email, hexCode };
    setTableData([...tableData, newRow]);
    setSubscriberCount(subscriberCount + 1);
  };

  const handleDelete = (id) => {
    const updatedData = tableData.filter((row) => row.id !== id);
    setTableData(updatedData);
    setSubscriberCount(subscriberCount - 1);
  };

  const handleEdit = (id, newName, newEmail) => {
    const updatedData = tableData.map((row) =>
      row.id === id ? { ...row, name: newName, email: newEmail } : row
    );
    setTableData(updatedData);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tableData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTableData(items);
  };

  const downloadCSV = () => {
    // Dummy CSV creation, you should use a proper CSV library
    const csvContent = `Name,Email,Hex Code\n${tableData
      .map((row) => `${row.name},${row.email},${row.hexCode}`)
      .join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'subscribers.csv';
    link.click();
  };

  return (
    <div className={styles.desktopView}>
      <TextField
        className={styles.desktopViewChild}
        color="primary"
        sx={{ width: 1920 }}
        variant="filled"
      />
      <div className={styles.joinUniqueSchoolsParent}>
        <div className={styles.joinUniqueSchoolsContainer}>
          <span className={styles.joineesTxt}>
            <span>{`Join `}</span>
            <b className={styles.uniqueSchools}>Unique Schools</b>
          </span>
        </div>
        <div className={styles.rectangleParent}>
          <div className={styles.groupChild} />
          <TextField
            className={styles.email}
            color="primary"
            label="    Email"
            sx={{ width: 519 }}
            variant="filled"
            multiline
          />
        </div>
        <div className={styles.rectangleGroup}>
          <div className={styles.groupChild} />
          <TextField
            className={styles.email}
            color="primary"
            label="    Name"
            sx={{ width: 519 }}
            variant="filled"
            multiline
          />
        </div>
        <div className={styles.rectangleContainer}>
          <div className={styles.groupChild} />
          <TextField
            className={styles.email}
            color="primary"
            label="16 digit hex code"
            sx={{ width: 519 }}
            variant="filled"
            multiline
          />
        </div>
        <div className={styles.rectangleDiv}>
          <Button
            className={styles.join}
            sx={{ width: 264 }}
            color="primary"
            variant="contained"
            onClick={() =>
              handleJoin(prompt('Enter name'), prompt('Enter email'))
            }
          >
            Join
          </Button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TableContainer component={Paper} className={styles.groupParent}>
          <Droppable droppableId="table" type="ROW">
            {(provided) => (
              <Table {...provided.droppableProps} ref={provided.innerRef}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Hex Code</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, index) => (
                    <Draggable key={row.id} draggableId={row.id} index={index}>
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.hexCode}</TableCell>
                          <TableCell>
                            <Button
                              color="primary"
                              variant="outlined"
                              onClick={() =>
                                handleEdit(
                                  row.id,
                                  prompt('Enter new name', row.name),
                                  prompt('Enter new email', row.email)
                                )
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              color="secondary"
                              variant="outlined"
                              onClick={() => handleDelete(row.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </TableContainer>
      </DragDropContext>

      <Button
        className={styles.downloadButton}
        sx={{ marginTop: '10px' }}
        color="primary"
        variant="contained"
        onClick={downloadCSV}
      >
        Download CSV
      </Button>

      <div className={styles.uniqueSchools}>
        <span>{subscriberCount} Joinee's</span>
      </div>
    </div>
  );
};

export default DesktopView;
