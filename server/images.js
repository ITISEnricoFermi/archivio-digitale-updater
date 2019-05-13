
const images = Object.freeze({
    "backend": "itisenricofermi/archivio-digitale-server",
    "frontend": "itisenricofermi/archivio-digitale-client",
    "mailer": "itisenricofermi/archivio-digitale-mailer",
    "reverse_proxy": "itisenricofermi/archivio-digitale-stack",
    "updater": "itisenricofermi/archivio-digitale-updater",
    "database": "mongo",
    "minio": "minio/minio"
})


module.exports = function getImageName(service) {
    return images[service];
}