import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ref, get, set, push, update } from "firebase/database";
import { db } from "./firebaseConfig";

const Alumnos = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [fechaIngreso, setFechaIngreso] = useState("");
    const [alumnos, setAlumnos] = useState([]);
    const [pagos, setPagos] = useState({});
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [clasesTomadas, setClasesTomadas] = useState(0);
    const [clasesRestantes, setClasesRestantes] = useState(0);

    useEffect(() => {
        cargarAlumnos();
        cargarPagos();
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
                    clases: data[key].clases || { clasesTomadas: 0, clasesRestantes: 0 },
                }));
                setAlumnos(alumnosList);
            }
        } catch (error) {
            console.error("Error al cargar los alumnos:", error);
        }
    };

    const cargarPagos = async () => {
        try {
            const pagosRef = ref(db, "pagos");
            const snapshot = await get(pagosRef);
            if (snapshot.exists()) {
                setPagos(snapshot.val());
            }
        } catch (error) {
            console.error("Error al obtener los pagos:", error);
        }
    };

    const handleSubmit = async () => {
        if (!nombre || !apellido || !fechaIngreso) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            const alumnosRef = ref(db, "alumnos");
            const newAlumnoRef = push(alumnosRef);
            await set(newAlumnoRef, {
                nombre,
                apellido,
                fechaIngreso,
                clases: { clasesTomadas: 0, clasesRestantes: 0 },
            });
            alert(`Alumno ingresado: ${nombre} ${apellido}`);
            cargarAlumnos();
            setNombre("");
            setApellido("");
            setFechaIngreso("");
        } catch (error) {
            alert(`Error al guardar el alumno: ${error}`);
        }
    };

    const handleEditAlumno = (alumno) => {
        setSelectedAlumno(alumno);
        setClasesTomadas(alumno.clases?.clasesTomadas || 0);
        setClasesRestantes(alumno.clases?.clasesRestantes || 0);
        setEditDialogOpen(true);
    };

    const handleUpdateClases = async () => {
        if (!selectedAlumno) return;

        try {
            const alumnoRef = ref(db, `alumnos/${selectedAlumno.id}/clases`);
            await update(alumnoRef, {
                clasesTomadas: clasesTomadas,
                clasesRestantes: clasesRestantes,
            });

            alert(`Clases actualizadas para ${selectedAlumno.nombre} ${selectedAlumno.apellido}`);
            setEditDialogOpen(false);
            cargarAlumnos();
        } catch (error) {
            console.error("Error al actualizar las clases:", error);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: "100%",
                margin: "auto",
                padding: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 7,
                boxShadow: 2,
            }}
        >
            <Typography variant="h4" gutterBottom textAlign="center">
                Ingresar Alumno
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Apellido"
                        fullWidth
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Fecha de Ingreso (dd/mm/aaaa)"
                        fullWidth
                        value={fechaIngreso}
                        onChange={(e) => setFechaIngreso(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button sx={{ color: '#eee', borderRadius:7 }}
                        variant="contained"
                        color= 'secondary'
                        
                        onClick={handleSubmit}
                    >
                        Guardar Alumno
                    </Button>
                </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom textAlign="center" mt={3}>
                Alumnos Ingresados
            </Typography>

            <List>
                {alumnos.length === 0 ? (
                    <Typography>No hay alumnos registrados.</Typography>
                ) : (
                    alumnos.map((alumno) => (
                        <ListItem key={alumno.id}>
                            <ListItemText
                                primary={`${alumno.nombre} ${alumno.apellido}`}
                                secondary={
                                    <>
                                        <div>Fecha de ingreso: {alumno.fechaIngreso}</div>
                                        <div>
                                            Clases: Tomadas: {alumno.clases?.clasesTomadas || 0},{" "}
                                            Restantes: {alumno.clases?.clasesRestantes || 0}
                                        </div>
                                        <div style={{ color: "green" }}>
                                            Pago Realizado: ${pagos[alumno.id]?.monto || 0}
                                        </div>
                                    </>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleEditAlumno(alumno)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                )}
            </List>

            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
            >
                <DialogTitle>Editar Clases</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Clases Tomadas"
                        type="number"
                        fullWidth
                        value={clasesTomadas}
                        onChange={(e) => setClasesTomadas(Number(e.target.value))}
                        margin="dense"
                    />
                    <TextField
                        label="Clases Restantes"
                        type="number"
                        fullWidth
                        value={clasesRestantes}
                        onChange={(e) => setClasesRestantes(Number(e.target.value))}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions sx={{borderRadius:10}}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: 7,  color: '#f60' }}>Cancelar</Button>
                    <Button sx={{borderRadius:7}}
                        variant="contained"
                        color="secondary"
                        onClick={handleUpdateClases}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Alumnos;
