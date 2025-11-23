#!/usr/bin/env python3
"""
Script para modificar CatalogoVinos.tsx con precisión
"""
import re

# Leer archivo
with open('src/pages/CatalogoVinos.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Agregar imports
old_imports = """import React, { useState, useEffect, useMemo } from 'react';
import { Wine, MapPin, Filter, X, Search, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatBot from '../components/ChatBot';
import { supabase } from '../supabaseClient';
import { getCurrentUser } from '../auth';
import { isBirthday, applyBirthdayDiscount, getBirthdayDiscountAmount, BIRTHDAY_DISCOUNT_PERCENT } from '../utils/birthday';
import { getAllWines, Wine as Vino } from '../services/wineService';"""

new_imports = """import React, { useState, useEffect, useMemo } from 'react';
import { Wine, MapPin, Filter, X, Search, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatBot from '../components/ChatBot';
import CartIcon from '../components/CartIcon';
import { supabase } from '../supabaseClient';
import { getCurrentUser } from '../auth';
import { isBirthday, applyBirthdayDiscount, getBirthdayDiscountAmount, BIRTHDAY_DISCOUNT_PERCENT } from '../utils/birthday';
import { getAllWines, Wine as Vino } from '../services/wineService';
import { addToCart } from '../utils/cartUtils';"""

content = content.replace(old_imports, new_imports)

# 2. Reemplazar función agregarAlCarrito
old_function = """  const agregarAlCarrito = (vino: Vino) => {
    // Aquí implementarías la lógica de agregar al carrito
    console.log('Agregado al carrito:', vino);
    alert(`${vino.nombre} agregado al carrito`);
  };"""

new_function = """  const agregarAlCarrito = (vino: Vino) => {
    if (!vino.stock || vino.stock === 0) {
      alert('Este vino no tiene stock disponible')
      return
    }

    const success = addToCart({
      vino_id: vino.id,
      nombre: vino.nombre,
      precio: isBirthdayToday ? applyBirthdayDiscount(vino.precio) : vino.precio,
      imagen_url: vino.imagen_url,
      stock: vino.stock
    }, 1)

    if (success) {
      alert(`✅ ${vino.nombre} agregado al carrito`)
    }
  };"""

content = content.replace(old_function, new_function)

# 3. Agregar CartIcon
old_chatbot = """      {/* ChatBot flotante */}
      <ChatBot />"""

new_chatbot = """      {/* Ícono flotante del carrito */}
      <CartIcon />

      {/* ChatBot flotante */}
      <ChatBot />"""

content = content.replace(old_chatbot, new_chatbot)

# Guardar archivo
with open('src/pages/CatalogoVinos.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Archivo modificado exitosamente!")
print("3 cambios aplicados:")
print("  1. Imports agregados (CartIcon y addToCart)")
print("  2. Función agregarAlCarrito implementada")
print("  3. CartIcon agregado antes de ChatBot")
