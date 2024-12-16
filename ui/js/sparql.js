document.getElementById('run-query').addEventListener('click', async () => {
    const query = document.getElementById('sparql-query').value;

    if (!query.trim()) {
        alert('Please enter a SPARQL query!');
        return;
    }

    try {
        const endpoint = "";
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/sparql-query' },
            body: query
        });

        if (!response.ok) throw new Error('Failed to execute query');

        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error(error);
        alert('Error executing query. Check console for details.');
    }
});

function displayResults(results) {
    const tableHead = document.querySelector('#results-table thead tr');
    const tableBody = document.querySelector('#results-table tbody');
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    if (results.head && results.head.vars) {
        results.head.vars.forEach(varName => {
            const th = document.createElement('th');
            th.textContent = varName;
            tableHead.appendChild(th);
        });
    }

    if (results.results && results.results.bindings) {
        results.results.bindings.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell.value;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }
}
