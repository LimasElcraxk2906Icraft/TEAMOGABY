const tabs = ['ilustracion1', 'ilustracion2', 'ilustracion3', 'ilustracion4', 'ilustracion5'];

function showTab(id) {
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  
  const content = document.getElementById(id);
  content.style.display = 'block';
  document.querySelector(`.tab-button[onclick="showTab('${id}')"]`).classList.add('active');

  if (!content.dataset.loaded) {
    fetch(`${id}.html`)
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        content.dataset.loaded = "true";
        const script = document.createElement('script');
        script.src = `${id}.js`;
        script.defer = true;
        document.body.appendChild(script);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showTab('ilustracion1');
});
