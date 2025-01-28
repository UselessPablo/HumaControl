import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TextField,
} from "@mui/material";
import { ref, get, push } from "firebase/database";
import { db } from "./firebaseConfig";

const VentaVarios = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [productos, setProductos] = useState([
        { nombre: "Arcilla", cantidad: "", precioVenta: "", precioCosto: "" },
        { nombre: "Engobes", cantidad: "", precioVenta: "", precioCosto: "" },
        { nombre: "Horneada", cantidad: "", precioVenta: "", precioCosto: "" },
        { nombre: "Esmaltes", cantidad: "", precioVenta: "", precioCosto: "" },
    ]);
    const [gananciaTotal, setGananciaTotal] = useState(0);

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
            }
        } catch (error) {
            console.error("Error al cargar los alumnos:", error);
        }
    };

    const handleVentaSubmit = async () => {
        if (!alumnoSeleccionado) {
            alert("Por favor, selecciona un alumno.");
            return;
        }

        try {
            const ventasRef = ref(db, `ventas/${alumnoSeleccionado.id}`);
            const nuevaVenta = push(ventasRef);

            const productosConGanancia = productos.map((producto) => {
                const ganancia =
                    (parseFloat(producto.precioVenta) || 0) -
                    (parseFloat(producto.precioCosto) || 0);
                return {
                    ...producto,
                    ganancia: ganancia * (parseFloat(producto.cantidad) || 0),
                };
            });

            const gananciaTotalVenta = productosConGanancia.reduce(
                (acc, producto) => acc + producto.ganancia,
                0
            );

            await nuevaVenta.set({
                productos: productosConGanancia,
                fecha: new Date().toISOString(),
                gananciaTotal: gananciaTotalVenta,
            });

            setGananciaTotal(gananciaTotalVenta);

            alert(`Venta registrada para ${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido}.`);
            setProductos(
                productos.map((producto) => ({
                    ...producto,
                    cantidad: "",
                    precioVenta: "",
                    precioCosto: "",
                }))
            );
        } catch (error) {
            console.error("Error al registrar la venta:", error);
        }
    };

    const handleProductoChange = (index, campo, valor) => {
        const nuevosProductos = [...productos];
        nuevosProductos[index][campo] = valor;
        setProductos(nuevosProductos);
    };

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: "auto",
                padding: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: 2,
            }}
        >
            <Typography variant="h4" gutterBottom textAlign="center">
                Venta de Productos
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Seleccionar Alumno</InputLabel>
                        <Select
                            value={alumnoSeleccionado?.id || ""}
                            onChange={(e) =>
                                setAlumnoSeleccionado(
                                    alumnos.find((alumno) => alumno.id === e.target.value)
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
                {productos.map((producto, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={3}>
                            <Typography>{producto.nombre}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Cantidad (g)"
                                fullWidth
                                type="number"
                                value={producto.cantidad}
                                onChange={(e) =>
                                    handleProductoChange(index, "cantidad", e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Precio de Venta"
                                fullWidth
                                type="number"
                                value={producto.precioVenta}
                                onChange={(e) =>
                                    handleProductoChange(index, "precioVenta", e.target.value)
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Precio de Costo"
                                fullWidth
                                type="number"
                                value={producto.precioCosto}
                                onChange={(e) =>
                                    handleProductoChange(index, "precioCosto", e.target.value)
                                }
                            />
                        </Grid>
                    </React.Fragment>
                ))}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleVentaSubmit}
                    >
                        Registrar Venta
                    </Button>
                </Grid>
                {gananciaTotal > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6" textAlign="center" color="green">
                            Ganancia Total de esta Venta: ${gananciaTotal.toFixed(2)}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default VentaVarios;
