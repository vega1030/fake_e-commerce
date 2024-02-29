export const loadSpinner = (flag) => {
    const overlay = document.querySelector('.overlay')
    if (overlay !== null) {
        const confirm = !flag ? overlay.style.display = 'flex' : overlay.style.display = 'none'
        const result = confirm === 'flex' ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto'
    }
}