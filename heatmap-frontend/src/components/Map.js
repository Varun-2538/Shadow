import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Modal, Button, TextField, Select, MenuItem, Box, FormControl, InputLabel } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from 'axios';

function MapEvents({ onUpdate }) {
  useMapEvents({
    dblclick(e) {
      onUpdate(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const HeatMap = ({ entries, color, onUpdate }) => {
  const center = [12.9716, 77.5946]; // Center on Bangalore

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents onUpdate={onUpdate} />
      {entries.map((entry, index) => (
        <Circle
          key={index}
          center={[entry.latitude, entry.longitude]}
          fillColor={color}
          color={color}
          radius={200}
        />
      ))}
    </MapContainer>
  );
};

const useStyles = makeStyles({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    outline: "none",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    maxHeight: "90vh",
    overflowY: "auto",
    width: "80%",
    maxWidth: "600px",
  },
});

function Map() {
  const classes = useStyles();
  const [dataEntries, setDataEntries] = useState([]);
  const [entry, setEntry] = useState({
    crime_no: "",
    district_name: "",
    unitname: "",
    accused_presentaddress: "",
    victim_presentaddress: "",
    accused_age: "",
    accused_caste: "",
    accused_profession: "",
    accused_sex: "",
    victim_age: "",
    victim_profession: "",
    victim_sex: "",
    crime: "",
    latitude: "",
    longitude: "",
    fir_type: "",
    fir_stage: "",
    distance_from_ps: "",
    beat_name: "",
    place_of_offence: "",
    offence_from_date: "",
    offence_from_time: "",
    offence_to_date: "",
    offence_to_time: "",
  });
  const [mapType, setMapType] = useState("alleged");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCrimeNo, setSelectedCrimeNo] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    // Fetch the initial data
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/entries');
        setDataEntries(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntry = { ...entry };

    try {
      if (selectedEntry) {
        // Update existing entry
        await axios.put(`http://localhost:5000/api/entries/${selectedEntry.id}`, newEntry);
        setDataEntries(dataEntries.map(entry => entry.id === selectedEntry.id ? newEntry : entry));
        setSelectedEntry(null);
      } else {
        // Add new entry
        await axios.post('http://localhost:5000/api/entries', newEntry);
        setDataEntries([...dataEntries, newEntry]);
      }

      setEntry({
        crime_no: "",
        district_name: "",
        unitname: "",
        accused_presentaddress: "",
        victim_presentaddress: "",
        accused_age: "",
        accused_caste: "",
        accused_profession: "",
        accused_sex: "",
        victim_age: "",
        victim_profession: "",
        victim_sex: "",
        crime: "",
        latitude: "",
        longitude: "",
        fir_type: "",
        fir_stage: "",
        distance_from_ps: "",
        beat_name: "",
        place_of_offence: "",
        offence_from_date: "",
        offence_from_time: "",
        offence_to_date: "",
        offence_to_time: "",
      }); // Reset form
      setShowModal(false); // Close modal
      setEditModal(false); // Close edit modal
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleDelete = (indexToDelete) => {
    setDataEntries(
      dataEntries.filter((_, index) => index !== indexToDelete)
    );
  };

  const updateEntry = (lat, lng) => {
    setEntry({ ...entry, latitude: lat.toString(), longitude: lng.toString() });
    setShowModal(true); // Open modal when the map is double-clicked
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openEditModal = () => setEditModal(true);
  const closeEditModal = () => setEditModal(false);

  const handleCrimeNoChange = (e) => {
    const crimeNo = e.target.value;
    setSelectedCrimeNo(crimeNo);
    const entry = dataEntries.find(entry => entry.crime_no === crimeNo);
    if (entry) {
      setSelectedEntry(entry);
      setEntry(entry);
    } else {
      setSelectedEntry(null);
      setEntry({
        crime_no: crimeNo,
        district_name: "",
        unitname: "",
        accused_presentaddress: "",
        victim_presentaddress: "",
        accused_age: "",
        accused_caste: "",
        accused_profession: "",
        accused_sex: "",
        victim_age: "",
        victim_profession: "",
        victim_sex: "",
        crime: "",
        latitude: "",
        longitude: "",
        fir_type: "",
        fir_stage: "",
        distance_from_ps: "",
        beat_name: "",
        place_of_offence: "",
        offence_from_date: "",
        offence_from_time: "",
        offence_to_date: "",
        offence_to_time: "",
      });
    }
  };

  return (
    <div className="App">
      <h1 className="font-bold text-center text-3xl mb-4">Karnataka Heatmap Visualization</h1>
      <Button variant="contained" color="primary" onClick={openModal} style={{ margin: "20px" }}>
        Add Entry
      </Button>
      <Button variant="contained" color="secondary" onClick={openEditModal} style={{ margin: "20px" }}>
        Edit Data
      </Button>
      <Modal
        open={showModal}
        onClose={closeModal}
        className={classes.modal}
      >
        <Box className={classes.paper}>
          <h2>Add Entry</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Crime No"
              value={entry.crime_no}
              onChange={(e) => setEntry({ ...entry, crime_no: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="District Name"
              value={entry.district_name}
              onChange={(e) => setEntry({ ...entry, district_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Unit Name"
              value={entry.unitname}
              onChange={(e) => setEntry({ ...entry, unitname: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Present Address"
              value={entry.accused_presentaddress}
              onChange={(e) => setEntry({ ...entry, accused_presentaddress: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Victim Present Address"
              value={entry.victim_presentaddress}
              onChange={(e) => setEntry({ ...entry, victim_presentaddress: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Age"
              value={entry.accused_age}
              onChange={(e) => setEntry({ ...entry, accused_age: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Caste"
              value={entry.accused_caste}
              onChange={(e) => setEntry({ ...entry, accused_caste: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Profession"
              value={entry.accused_profession}
              onChange={(e) => setEntry({ ...entry, accused_profession: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Sex"
              value={entry.accused_sex}
              onChange={(e) => setEntry({ ...entry, accused_sex: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Victim Age"
              value={entry.victim_age}
              onChange={(e) => setEntry({ ...entry, victim_age: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Victim Profession"
              value={entry.victim_profession}
              onChange={(e) => setEntry({ ...entry, victim_profession: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Victim Sex"
              value={entry.victim_sex}
              onChange={(e) => setEntry({ ...entry, victim_sex: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Crime Type"
              value={entry.crime}
              onChange={(e) => setEntry({ ...entry, crime: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Latitude"
              value={entry.latitude}
              onChange={(e) => setEntry({ ...entry, latitude: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Longitude"
              value={entry.longitude}
              onChange={(e) => setEntry({ ...entry, longitude: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="FIR Type"
              value={entry.fir_type}
              onChange={(e) => setEntry({ ...entry, fir_type: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="FIR Stage"
              value={entry.fir_stage}
              onChange={(e) => setEntry({ ...entry, fir_stage: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Distance from PS"
              value={entry.distance_from_ps}
              onChange={(e) => setEntry({ ...entry, distance_from_ps: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Beat Name"
              value={entry.beat_name}
              onChange={(e) => setEntry({ ...entry, beat_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Place of Offence"
              value={entry.place_of_offence}
              onChange={(e) => setEntry({ ...entry, place_of_offence: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Offence From Date"
              value={entry.offence_from_date}
              onChange={(e) => setEntry({ ...entry, offence_from_date: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Offence From Time"
              value={entry.offence_from_time}
              onChange={(e) => setEntry({ ...entry, offence_from_time: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Offence To Date"
              value={entry.offence_to_date}
              onChange={(e) => setEntry({ ...entry, offence_to_date: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Offence To Time"
              value={entry.offence_to_time}
              onChange={(e) => setEntry({ ...entry, offence_to_time: e.target.value })}
              fullWidth
            />
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: "20px" }}>
              {selectedEntry ? "Update Entry" : "Add to Map"}
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal
        open={editModal}
        onClose={closeEditModal}
        className={classes.modal}
      >
        <Box className={classes.paper}>
          <h2>Edit Data</h2>
          <FormControl fullWidth margin="normal">
            <InputLabel>Crime No</InputLabel>
            <Select
              value={selectedCrimeNo}
              onChange={handleCrimeNoChange}
            >
              {dataEntries.map(entry => (
                <MenuItem key={entry.crime_no} value={entry.crime_no}>
                  {entry.crime_no}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Crime No"
              value={entry.crime_no}
              onChange={(e) => setEntry({ ...entry, crime_no: e.target.value })}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="District Name"
              value={entry.district_name}
              onChange={(e) => setEntry({ ...entry, district_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Unit Name"
              value={entry.unitname}
              onChange={(e) => setEntry({ ...entry, unitname: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Present Address"
              value={entry.accused_presentaddress}
              onChange={(e) => setEntry({ ...entry, accused_presentaddress: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Victim Present Address"
              value={entry.victim_presentaddress}
              onChange={(e) => setEntry({ ...entry, victim_presentaddress: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Age"
              value={entry.accused_age}
              onChange={(e) => setEntry({ ...entry, accused_age: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Caste"
              value={entry.accused_caste}
              onChange={(e) => setEntry({ ...entry, accused_caste: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Profession"
              value={entry.accused_profession}
              onChange={(e) => setEntry({ ...entry, accused_profession: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Accused Sex"
              value={entry.accused_sex}
              onChange={(e) => setEntry({ ...entry, accused_sex: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Victim Age"
              value={entry.victim_age}
              onChange={(e) => setEntry({ ...entry, victim_age: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Victim Profession"
              value={entry.victim_profession}
              onChange={(e) => setEntry({ ...entry, victim_profession: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Victim Sex"
              value={entry.victim_sex}
              onChange={(e) => setEntry({ ...entry, victim_sex: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Crime Type"
              value={entry.crime}
              onChange={(e) => setEntry({ ...entry, crime: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Latitude"
              value={entry.latitude}
              onChange={(e) => setEntry({ ...entry, latitude: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Longitude"
              value={entry.longitude}
              onChange={(e) => setEntry({ ...entry, longitude: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="FIR Type"
              value={entry.fir_type}
              onChange={(e) => setEntry({ ...entry, fir_type: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="FIR Stage"
              value={entry.fir_stage}
              onChange={(e) => setEntry({ ...entry, fir_stage: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Distance from PS"
              value={entry.distance_from_ps}
              onChange={(e) => setEntry({ ...entry, distance_from_ps: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Beat Name"
              value={entry.beat_name}
              onChange={(e) => setEntry({ ...entry, beat_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Place of Offence"
              value={entry.place_of_offence}
              onChange={(e) => setEntry({ ...entry, place_of_offence: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Offence From Date"
              value={entry.offence_from_date}
              onChange={(e) => setEntry({ ...entry, offence_from_date: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Offence From Time"
              value={entry.offence_from_time}
              onChange={(e) => setEntry({ ...entry, offence_from_time: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Offence To Date"
              value={entry.offence_to_date}
              onChange={(e) => setEntry({ ...entry, offence_to_date: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Offence To Time"
              value={entry.offence_to_time}
              onChange={(e) => setEntry({ ...entry, offence_to_time: e.target.value })}
              fullWidth
            />
            <Button variant="contained" color="primary" type="submit" style={{ marginTop: "20px" }}>
              Update Entry
            </Button>
          </form>
        </Box>
      </Modal>
      {mapType === "alleged" ? (
        <HeatMap
          entries={dataEntries.filter(entry => entry.fir_stage === 'alleged')}
          color="red"
          onUpdate={updateEntry}
        />
      ) : (
        <HeatMap
          entries={dataEntries.filter(entry => entry.fir_stage === 'proven')}
          color="green"
          onUpdate={updateEntry}
        />
      )}
    </div>
  );
}

export default Map;
