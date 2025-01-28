import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import Alumnos from './Alumnos';

function App() {
  const navigate = useNavigate(); // Hook para navegar entre rutas

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#8531ca',
          borderRadius: 7,
          mt: 2,
          width: '90%', // Ocupa el 90% del ancho disponible
          maxWidth: 800, // Limita el tamaño máximo de la barra
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly', // Espaciado uniforme entre botones
            flexWrap: 'wrap', // Permite que los botones se ajusten si el espacio es limitado
          }}
        >
          <Button color="inherit" onClick={() => navigate('/alumnos')}>
            Alumnos
          </Button>
          <Button color="inherit" onClick={() => navigate('/pagos')}>
            Pagos
          </Button>
          <Button color="inherit" onClick={() => navigate('/ventaVarios')}>
            Venta de Varios
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido de la Página */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center', // Centra el texto
          mt: 4,
          p: 2, // Padding para un espacio agradable
          width: '100%', // Ocupa el ancho completo del contenedor
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{ mt: 4, mb: 4, fontWeight: 'bold', color: '#333' }}
        >
          Huma Control
        </Typography>
        <Alumnos />
      </Box>
    </Box>
  );
}

export default App;
