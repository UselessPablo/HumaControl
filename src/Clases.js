
import React, { useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { ref, set } from 'firebase/database';
import { db } from './firebaseConfig';

const Clases = ({ alumnos }) => {
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
    const [clasesTomadas, setClasesTomadas] = useState('');
    const [clasesRestantes, setClasesRestantes] = useState('');

    const handleGuardarClases = () => {
        if (!alumnoSeleccionado || clasesTomadas === '' || clasesRestantes === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Buscar el alumno seleccionado en la lista de alumnos utilizando el ID
        const alumno = alumnos.find(a => a.id === alumnoSeleccionado);

        if (alumno) {
            // Referencia de Firebase para guardar las clases
            const clasesRef = ref(db, `clases/${alumno.id}`);

            set(clasesRef, {
                clasesTomadas: parseInt(clasesTomadas),
                clasesRestantes: parseInt(clasesRestantes),
            })
                .then(() => {
                    alert(`Clases actualizadas para ${alumno.nombre} ${alumno.apellido}`);
                })
                .catch((error) => {
                    alert(`Error al guardar las clases: ${error}`);
                });
        }
    };

    return (
        <div>
            <h3>Gestionar Clases</h3>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Seleccionar Alumno"
                        select
                        fullWidth
                        value={alumnoSeleccionado}
                        onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Selecciona un alumno</option>
                        {alumnos && alumnos.length > 0 ? (
                            alumnos.map((alumno, index) => (
                                <option key={index} value={alumno.id}>
                                    {alumno.nombre} {alumno.apellido}
                                </option>
                            ))
                        ) : (
                            <option value="">No hay alumnos disponibles</option>
                        )}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Clases Tomadas"
                        type="number"
                        fullWidth
                        value={clasesTomadas}
                        onChange={(e) => setClasesTomadas(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Clases Restantes"
                        type="number"
                        fullWidth
                        value={clasesRestantes}
                        onChange={(e) => setClasesRestantes(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleGuardarClases}
                    >
                        Guardar Clases
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Clases;
