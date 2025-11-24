// updateWineImages.mjs - Script para actualizar las imágenes de vinos en Supabase
import { createClient } from '@supabase/supabase-js'
import { readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configurar Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Variables de entorno de Supabase no encontradas')
    console.log('Por favor, asegúrate de que el archivo .env tiene:')
    console.log('  - VITE_SUPABASE_URL')
    console.log('  - VITE_SUPABASE_ANON_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateWineImages() {
    console.log('🍷 Iniciando actualización de imágenes de vinos...\n')

    // 1. Obtener la lista de imágenes en la carpeta
    const imagenesPath = join(__dirname, 'public', 'Imagenes Wine', 'vinos')
    const imageFiles = readdirSync(imagenesPath)

    console.log(`📁 Encontradas ${imageFiles.length} imágenes en la carpeta\n`)

    // 2. Obtener todos los vinos de Supabase
    const { data: vinos, error: fetchError } = await supabase
        .from('vinos')
        .select('id, nombre')
        .order('nombre', { ascending: true })

    if (fetchError || !vinos) {
        console.error('❌ Error al obtener los vinos:', fetchError)
        return
    }

    console.log(`📊 Encontrados ${vinos.length} vinos en la base de datos\n`)

    // 3. Actualizar cada vino con su imagen correspondiente
    let actualizados = 0
    let noEncontrados = []

    for (const vino of vinos) {
        // Buscar la imagen que coincida con el nombre del vino
        const imagenEncontrada = imageFiles.find(file => {
            const nombreSinExtension = file.replace(/\.(jpg|png|webp)$/i, '')
            return nombreSinExtension === vino.nombre
        })

        if (imagenEncontrada) {
            // Actualizar la URL de la imagen en Supabase
            const imagenUrl = `/Imagenes Wine/vinos/${imagenEncontrada}`

            const { error: updateError } = await supabase
                .from('vinos')
                .update({ imagen: imagenUrl })
                .eq('id', vino.id)

            if (updateError) {
                console.error(`❌ Error al actualizar ${vino.nombre}:`, updateError)
            } else {
                console.log(`✅ Actualizado: ${vino.nombre} -> ${imagenEncontrada}`)
                actualizados++
            }
        } else {
            noEncontrados.push(vino.nombre)
            console.log(`⚠️  No se encontró imagen para: ${vino.nombre}`)
        }
    }

    // 4. Resumen
    console.log('\n' + '='.repeat(60))
    console.log(`✨ Actualización completada!`)
    console.log(`   - Vinos actualizados: ${actualizados}`)
    console.log(`   - Vinos sin imagen: ${noEncontrados.length}`)

    if (noEncontrados.length > 0) {
        console.log(`\n⚠️  Vinos sin imagen encontrada:`)
        noEncontrados.forEach(nombre => console.log(`   - ${nombre}`))
    }
    console.log('='.repeat(60))
}

// Ejecutar el script
updateWineImages()
    .then(() => {
        console.log('\n🎉 Script finalizado correctamente')
        process.exit(0)
    })
    .catch(error => {
        console.error('\n💥 Error fatal:', error)
        process.exit(1)
    })