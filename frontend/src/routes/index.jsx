import { Routes, Route, Navigate } from 'react-router-dom'

import Produtos from '../pages/Produtos'
import ProdutoForm from '../pages/ProdutoForm'
import Chat from '../pages/Chat'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/produtos" replace />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produtos/criar" element={<ProdutoForm />} />
      <Route path="/produtos/:id" element={<ProdutoForm />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/produtos" replace />} />
    </Routes>
  )
}

export default AppRoutes
