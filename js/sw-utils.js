

// Guardar  en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {


    if ( res.ok ) {

        return caches.open( dynamicCache ).then( cache => {

            cache.put( req, res.clone() );
            
            return res.clone();

        });

    } else {
        return res;
    }

}

// Cache with network update
function actualizaCacheStatico( staticCache, req, APP_SHELL_INMUTABLE ) {


    if ( APP_SHELL_INMUTABLE.includes(req.url) ) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );

    } else {
        // console.log('actualizando', req.url );
        return fetch( req )
                .then( res => {
                    return actualizaCacheDinamico( staticCache, req, res );
                });
    }



};


// network with cache fallback //update
// Manejo de APIS REST

function manejoApiMensajes(cacheName, req) {
    

    if (req.clone().method === 'POST') {
        
        return fetch(req);

    } else {
        
    return fetch(req).then(res => {
        // si la respuesta es exitosa
        if (res.ok) {
            actualizaCacheDinamico(cacheName, req, res.clone());
            return res.clone();

            // si la respuesta falla
        } else {
            return caches.match(req); //retorna mensajes anteriores almacenados en cache
        }
    }).catch(err => {     //falla por conexion a internet
        return caches.match(req);
    });

        
    }

};


