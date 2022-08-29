// jshint version 6
exports.getDate = () => {
    let fecha = new Date()
    
    let opciones = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    return fecha.toLocaleDateString("es-ES", opciones)

}