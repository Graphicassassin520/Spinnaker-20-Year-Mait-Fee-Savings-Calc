document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', calculateProjection);
    document.getElementById('printChart').addEventListener('click', function() {
        window.print();
    });
});

function calculateProjection() {
    const guestName = document.getElementById('guestName').value;
    const companyName = document.getElementById('companyName').value || 'Current Ownership Location';
    const maintenanceFee = parseFloat(document.getElementById('maintenanceFee').value) || 0;
    const maintenanceFee2 = parseFloat(document.getElementById('maintenanceFee2').value) || 0;
    const priceIncrease = parseFloat(document.getElementById('priceIncrease').value) / 100 || 0;
    
    let data = [], data2 = [], labels = [], savingsData = [], totalSavings = 0;
    let fee1 = maintenanceFee, fee2 = maintenanceFee2;

    for (let year = 1; year <= 15; year++) {
        fee1 *= (1 + priceIncrease);
        fee2 *= (1 + 0.02);  // Increase by 2% per year
        data.push(fee1);
        data2.push(fee2);
        labels.push(`Year ${year}`);
        let annualSavings = fee1 - fee2;
        savingsData.push(annualSavings);
        totalSavings += annualSavings;
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: companyName,
                data: data,
                borderColor: 'red',
                fill: false,
            }, {
                label: 'New Ownership',
                data: data2,
                borderColor: 'green',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Maintenance Fee ($)'
                    }
                }
            }
        }
    });

    let tableHtml = '<table><tr><th>Year</th><th>' + companyName + ' Fee ($)</th><th>New Ownership Fee ($)</th><th>Savings ($)</th></tr>';
    data.forEach((amount, index) => {
        tableHtml += `<tr><td>${index + 1}</td><td>${amount.toFixed(2)}</td><td>${data2[index].toFixed(2)}</td><td>${savingsData[index].toFixed(2)}</td></tr>`;
    });
    tableHtml += `<tr><td colspan="3">Total Savings over 15 Years:</td><td>${totalSavings.toFixed(2)}</td></tr></table>`;
    document.getElementById('financialTable').innerHTML = tableHtml;

    document.getElementById('savings').innerHTML = `15-Year Savings with New Ownership: $${Math.abs(totalSavings).toFixed(2)}`;
}
