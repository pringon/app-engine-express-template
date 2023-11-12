byId('action-button').addEventListener('click', async function() {
    const res = await fetch("/api/hello")
    const payload = await res.json()
    alert(payload.message)
})

fetch("/api/suggestions")
    .then(res => res.json())
    .then(data => {
        const { suggestions } = data
        table = document.getElementById("suggestions-table")
        suggestions.map(({ name, suggestion }) => appendRow(table, name, suggestion))
    })
    .catch(err => alert(err))

byId("form-submit").addEventListener("click", async () => {
    const name = byId("form-name").value
    const suggestion = byId("form-suggestion").value
    if (!name || ! suggestion) {
        alert("Fill in both name and suggestion")
        return
    }
    const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, suggestion })
    })
    const payload = await res.json()
    if (payload.code !== 201) {
        console.error(payload)
        alert("Something went wrong")
        return
    }
    appendRow(byId("suggestions-table"), name, suggestion)
    byId("form-name").value = ""
    byId("form-suggestion").value = ""
})

function appendRow(table, name, suggestion) {
    const row = table.insertRow()
    row.classList.add("border-b")

    const nameCol = document.createElement('td')
    nameCol.classList.add("p-3")
    nameCol.appendChild(document.createTextNode(name))
    const suggestionCol = document.createElement('td')
    suggestionCol.classList.add("p-3")
    suggestionCol.appendChild(document.createTextNode(suggestion))

    row.appendChild(nameCol)
    row.appendChild(suggestionCol)
}

/**
 * UTILITIES
 */

function byId(id) {
    return document.getElementById(id)
}
