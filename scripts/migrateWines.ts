// scripts/migrateWines.ts
/**
 * Script para migrar los vinos hardcodeados a la base de datos Supabase
 * Ejecutar con: npx ts-node scripts/migrateWines.ts
 * o: node --loader ts-node/esm scripts/migrateWines.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridas')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Datos de vinos a migrar (copiados del array hardcodeado)
const wines = [
    // Tintos
    { nombre: 'Château Margaux', tipo: 'Tinto', pais: 'Francia', region: 'Burdeos', precio: 450, descripcion: 'Elegante y complejo, con notas de frutas negras y especias', stock: 50, stock_minimo: 5 },
    { nombre: 'Barolo Cannubi', tipo: 'Tinto', pais: 'Italia', region: 'Piamonte', precio: 380, descripcion: 'Robusto y estructurado, ideal para carnes rojas', stock: 40, stock_minimo: 5 },
    { nombre: 'Opus One', tipo: 'Tinto', pais: 'Estados Unidos', region: 'California', precio: 420, descripcion: 'Blend excepcional con gran potencial de guarda', stock: 30, stock_minimo: 5 },
    { nombre: 'Vega Sicilia Único', tipo: 'Tinto', pais: 'España', region: 'Ribera del Duero', precio: 500, descripcion: 'Icónico vino español con elegancia y complejidad', stock: 25, stock_minimo: 5 },
    { nombre: 'Penfolds Grange', tipo: 'Tinto', pais: 'Australia', region: 'Sur de Australia', precio: 650, descripcion: 'Potente y concentrado, uno de los mejores del mundo', stock: 20, stock_minimo: 3 },
    { nombre: 'Catena Zapata Malbec', tipo: 'Tinto', pais: 'Argentina', region: 'Mendoza', precio: 180, descripcion: 'Expresión perfecta del Malbec argentino', stock: 60, stock_minimo: 10 },
    { nombre: 'Château Lafite Rothschild', tipo: 'Tinto', pais: 'Francia', region: 'Burdeos', precio: 850, descripcion: 'Primer cru legendario, sofisticación absoluta', stock: 15, stock_minimo: 3 },
    { nombre: 'Brunello di Montalcino', tipo: 'Tinto', pais: 'Italia', region: 'Toscana', precio: 320, descripcion: 'Sangiovese en su máxima expresión', stock: 35, stock_minimo: 5 },
    { nombre: 'Pingus', tipo: 'Tinto', pais: 'España', region: 'Ribera del Duero', precio: 750, descripcion: 'Vino de culto, producción limitada', stock: 12, stock_minimo: 3 },
    { nombre: 'Screaming Eagle Cabernet', tipo: 'Tinto', pais: 'Estados Unidos', region: 'Napa Valley', precio: 3500, descripcion: 'Ultra premium, uno de los más exclusivos', stock: 5, stock_minimo: 2 },

    // Blancos
    { nombre: 'Chablis Grand Cru', tipo: 'Blanco', pais: 'Francia', region: 'Borgoña', precio: 280, descripcion: 'Mineral y fresco, Chardonnay en su forma más pura', stock: 40, stock_minimo: 5 },
    { nombre: 'Cloudy Bay Sauvignon Blanc', tipo: 'Blanco', pais: 'Nueva Zelanda', region: 'Marlborough', precio: 150, descripcion: 'Aromático y vibrante, notas cítricas', stock: 55, stock_minimo: 10 },
    { nombre: 'Albariño Pazo de Señorans', tipo: 'Blanco', pais: 'España', region: 'Rías Baixas', precio: 95, descripcion: 'Fresco y floral, perfecto para mariscos', stock: 70, stock_minimo: 10 },
    { nombre: 'Gavi di Gavi', tipo: 'Blanco', pais: 'Italia', region: 'Piamonte', precio: 120, descripcion: 'Elegante y delicado, excelente aperitivo', stock: 45, stock_minimo: 8 },
    { nombre: 'Casillero del Diablo Chardonnay', tipo: 'Blanco', pais: 'Chile', region: 'Valle Central', precio: 65, descripcion: 'Equilibrado y versátil, gran relación calidad-precio', stock: 80, stock_minimo: 15 },
    { nombre: 'Riesling Dr. Loosen', tipo: 'Blanco', pais: 'Alemania', region: 'Mosel', precio: 140, descripcion: 'Dulzura equilibrada con acidez refrescante', stock: 50, stock_minimo: 8 },
    { nombre: 'Chassagne-Montrachet', tipo: 'Blanco', pais: 'Francia', region: 'Borgoña', precio: 350, descripcion: 'Gran Chardonnay, complejo y longevo', stock: 25, stock_minimo: 5 },
    { nombre: 'Verdejo Rueda', tipo: 'Blanco', pais: 'España', region: 'Rueda', precio: 55, descripcion: 'Herbáceo y fresco, notas de frutas blancas', stock: 90, stock_minimo: 15 },

    // Espumosos
    { nombre: 'Moët & Chandon', tipo: 'Espumoso', pais: 'Francia', region: 'Champagne', precio: 180, descripcion: 'Champagne icónico, elegante y festivo', stock: 100, stock_minimo: 20 },
    { nombre: 'Prosecco Valdobbiadene', tipo: 'Espumoso', pais: 'Italia', region: 'Véneto', precio: 75, descripcion: 'Ligero y afrutado, perfecto para aperitivos', stock: 120, stock_minimo: 25 },
    { nombre: 'Cava Codorníu', tipo: 'Espumoso', pais: 'España', region: 'Penedés', precio: 60, descripcion: 'Método tradicional, excelente calidad', stock: 110, stock_minimo: 20 },
    { nombre: 'Veuve Clicquot', tipo: 'Espumoso', pais: 'Francia', region: 'Champagne', precio: 220, descripcion: 'Champagne de gran prestigio y elegancia', stock: 80, stock_minimo: 15 },
    { nombre: 'Chandon Brut', tipo: 'Espumoso', pais: 'Argentina', region: 'Mendoza', precio: 85, descripcion: 'Espumoso argentino de alta calidad', stock: 95, stock_minimo: 15 },
    { nombre: 'Franciacorta Ca del Bosco', tipo: 'Espumoso', pais: 'Italia', region: 'Lombardía', precio: 190, descripcion: 'Método clásico italiano, refinado', stock: 60, stock_minimo: 10 },

    // Rosados
    { nombre: 'Whispering Angel', tipo: 'Rosado', pais: 'Francia', region: 'Provenza', precio: 110, descripcion: 'Rosado de culto, elegante y refrescante', stock: 85, stock_minimo: 15 },
    { nombre: 'Mateus Rosé', tipo: 'Rosado', pais: 'Portugal', region: 'Portugal', precio: 45, descripcion: 'Clásico portugués, ligero y afrutado', stock: 100, stock_minimo: 20 },
    { nombre: 'Marqués de Cáceres Rosado', tipo: 'Rosado', pais: 'España', region: 'Rioja', precio: 55, descripcion: 'Fresco y versátil, excelente para el verano', stock: 95, stock_minimo: 15 },

    // Dulces/Fortificados
    { nombre: 'Sauternes Château d\'Yquem', tipo: 'Dulce', pais: 'Francia', region: 'Burdeos', precio: 550, descripcion: 'El mejor vino dulce del mundo', stock: 20, stock_minimo: 3 },
    { nombre: 'Oporto Taylor\'s', tipo: 'Fortificado', pais: 'Portugal', region: 'Valle del Duero', precio: 180, descripcion: 'Porto vintage, complejo y longevo', stock: 45, stock_minimo: 8 },
    { nombre: 'Pedro Ximénez González Byass', tipo: 'Dulce Fortificado', pais: 'España', region: 'Jerez', precio: 120, descripcion: 'Intensamente dulce, perfecto para postres', stock: 50, stock_minimo: 10 },

    // Costa Rica
    { nombre: 'Viñedos Altamira Tinto', tipo: 'Tinto', pais: 'Costa Rica', region: 'Coto Brus', precio: 85, descripcion: 'Orgullo local, producción artesanal', stock: 60, stock_minimo: 10 },
    { nombre: 'Viñedos Altamira Blanco', tipo: 'Blanco', pais: 'Costa Rica', region: 'Coto Brus', precio: 80, descripcion: 'Vino blanco costarricense único', stock: 55, stock_minimo: 10 },
    { nombre: 'Viñedos Altamira Rosado', tipo: 'Rosado', pais: 'Costa Rica', region: 'Coto Brus', precio: 75, descripcion: 'Frescura tropical en cada copa', stock: 50, stock_minimo: 10 }
]

async function migrateWines() {
    console.log('🍷 Iniciando migración de vinos a Supabase...\n')

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const wine of wines) {
        try {
            // Verificar si el vino ya existe
            const { data: existing, error: checkError } = await supabase
                .from('vinos')
                .select('nombre')
                .eq('nombre', wine.nombre)
                .single()

            if (existing) {
                console.log(`⏭️  Saltando "${wine.nombre}" (ya existe)`)
                skipCount++
                continue
            }

            // Insertar el vino
            const { error: insertError } = await supabase
                .from('vinos')
                .insert([{
                    nombre: wine.nombre,
                    tipo: wine.tipo,
                    pais: wine.pais,
                    region: wine.region,
                    precio: wine.precio,
                    descripcion: wine.descripcion,
                    stock: wine.stock,
                    stock_minimo: wine.stock_minimo,
                    activo: true
                }])

            if (insertError) {
                console.error(`❌ Error insertando "${wine.nombre}":`, insertError.message)
                errorCount++
            } else {
                console.log(`✅ Migrado: "${wine.nombre}"`)
                successCount++
            }
        } catch (error) {
            console.error(`❌ Error procesando "${wine.nombre}":`, error)
            errorCount++
        }
    }

    console.log('\n📊 Resumen de migración:')
    console.log(`   ✅ Insertados: ${successCount}`)
    console.log(`   ⏭️  Saltados: ${skipCount}`)
    console.log(`   ❌ Errores: ${errorCount}`)
    console.log(`   📦 Total procesados: ${wines.length}`)

    if (errorCount === 0 && successCount > 0) {
        console.log('\n🎉 ¡Migración completada exitosamente!')
    }
}

// Ejecutar migración
migrateWines()
    .then(() => {
        console.log('\n✨ Script finalizado')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n💥 Error fatal:', error)
        process.exit(1)
    })
