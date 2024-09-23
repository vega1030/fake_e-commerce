const initPage = ()=>{
    // Obtén la URL actual

    let currentURL = window.location.href;
    
    // Verifica si la URL contiene un ID
    if (currentURL.includes("#")) {
        // Reemplaza cualquier ID existente con "home"
        currentURL = currentURL.replace(/#.*/, "#home");
    } else {
        // Si no hay ningún ID, simplemente agrega "#home" al final
        currentURL += "#home";
    }
    
    // Actualiza la URL en la barra del navegador
    window.history.replaceState({}, "", currentURL);
}



export{initPage}


