import { db } from "./firebaseConfig"; // Importa la base de datos
import {
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
} from "@mui/material";
import { ref, get, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para navegación

const Pagos = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [monto, setMonto] = useState("");
    const [fechaPago, setFechaPago] = useState("");
    const navigate = useNavigate(); // Hook para navegar entre páginas

    useEffect(() => {
        cargarAlumnos();
    }, []);

    const cargarAlumnos = async () => {
        try {
            const alumnosRef = ref(db, "alumnos");
            const snapshot = await get(alumnosRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const alumnosList = Object.keys(data).map((key) => ({
                    ...data[key],
                    id: key,
                }));
                setAlumnos(alumnosList);
            } else {
                console.log("No hay alumnos registrados.");
            }
        } catch (error) {
            console.error("Error al cargar los alumnos:", error);
        }
    };

    const handlePagoSubmit = async () => {
        if (!alumnoSeleccionado || !monto || !fechaPago) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const pagosRef = ref(db, `pagos/${alumnoSeleccionado.id}`);
            await set(pagosRef, {
                monto: parseFloat(monto),
                fechaPago,
            });

            alert(
                `Pago registrado para: ${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido}\nMonto: $${monto}\nFecha: ${fechaPago}`
            );

            setAlumnoSeleccionado(null);
            setMonto("");
            setFechaPago("");
        } catch (error) {
            console.error("Error al guardar el pago:", error);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "auto",
                padding: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: 2,
            }}
        >
            <Typography variant="h4" gutterBottom textAlign="center">
                Registrar Pago
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Seleccionar Alumno</InputLabel>
                        <Select
                            value={alumnoSeleccionado}
                            onChange={(e) =>
                                setAlumnoSeleccionado(
                                    alumnos.find(
                                        (alumno) => alumno.id === e.target.value
                                    )
                                )
                            }
                            label="Seleccionar Alumno"
                        >
                            {alumnos.map((alumno) => (
                                <MenuItem key={alumno.id} value={alumno.id}>
                                    {`${alumno.nombre} ${alumno.apellido}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Monto"
                        fullWidth
                        type="number"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Fecha de Pago (dd/mm/aaaa)"
                        fullWidth
                        value={fechaPago}
                        onChange={(e) => setFechaPago(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handlePagoSubmit}
                    >
                        Guardar Pago
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => navigate(-1)} // Navega a la página anterior
                    >
                        Volver
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Pagos;


