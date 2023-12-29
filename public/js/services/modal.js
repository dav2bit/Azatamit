export var modal = {
    open : (modalEl) =>{
       modal.closeAllModals()
       modalEl.parentElement.querySelector('i').classList.add("active")
       modalEl.style.display = "flex"
   },

    close: (modalEL) =>{
        modalEL.parentElement.querySelector('i').classList.remove("active")
        modalEL.style.display = "none"
   },

    closeAllModals : () => {
       var modals = document.querySelectorAll(".modal")
       var icons = document.querySelectorAll(".modal-icon")

       icons.forEach(icon => {
           icon.classList.remove("active")
       })
       modals.forEach((modalEL) => {
           modal.close(modalEL)
       })
   }
}
