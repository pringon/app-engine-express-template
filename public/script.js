document.getElementById('action-button').addEventListener('click', async function() {
    const res = await fetch("/api/hello");
    const payload = await res.json();
    alert(payload.message)
})
