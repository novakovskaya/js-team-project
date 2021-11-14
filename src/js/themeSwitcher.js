const checkbox = document.getElementById('checkbox');
const body = document.querySelector('body');
const modalWindow = document.querySelector('.modal-js')


const currentTheme = {
  DARK: 'dark-theme',
  LIGHT: 'light-theme',
};

checkbox.addEventListener('change', changeTheme);

function changeTheme(e) {
  if (checkbox.checked) {
    body.classList.toggle('dark');
    modalWindow.classList.toggle('dark');
    localStorage.setItem('theme', currentTheme.DARK);
    body.classList.toggle('light');
    modalWindow.classList.toggle('light');
   
  } else {
    body.classList.toggle('dark');
      modalWindow.classList.toggle('dark');
    localStorage.setItem('theme', currentTheme.LIGHT);
    body.classList.toggle('light');
        modalWindow.classList.toggle('light');
  
  }
}

if (localStorage.getItem('theme') === currentTheme.DARK) {
  checkbox.checked = true;
  body.classList.toggle('dark');
  body.classList.toggle('light');
}