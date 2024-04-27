import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, Container } from '@chakra-ui/react'
import theme from './theme.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Container 
          minHeight='$100vh'
          minWidth='100%'
          p={0}
        >
          <App />
        </Container>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
