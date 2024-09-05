document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', calculateProjection);
    document.getElementById('printChart').addEventListener('click', function() {
        window.print();
    });
});

function calculateProjection() {
    const guestName = document.getElementById('guestName').value;
    const currentLocationName = document.getElementById('currentLocation').value;
    const maintenanceFee = parseFloat(document.getElementById('maintenanceFee').value) || 0;
    const newLocationName = document.getElementById('newLocation').value;
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
                label: currentLocationName,
                data: data,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointBackgroundColor: '#FF6384',
                fill: true,
                tension: 0.4,  // Smooth curves
            }, {
                label: newLocationName,
                data: data2,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                pointBackgroundColor: '#36A2EB',
                fill: true,
                tension: 0.4,  // Smooth curves
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatNumberWithCommas(context.parsed.y);
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Maintenance Fee ($)',
                        font: {
                            size: 16
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });

    let tableHtml = `<table class="results-table"><tr><th>Year</th><th>${currentLocationName} Fee ($)</th><th>${newLocationName} Fee ($)</th><th>Savings ($)</th></tr>`;
    data.forEach((amount, index) => {
        tableHtml += `<tr><td>${index + 1}</td><td>${formatNumberWithCommas(amount)}</td><td>${formatNumberWithCommas(data2[index])}</td><td>${formatNumberWithCommas(savingsData[index])}</td></tr>`;
    });
    tableHtml += `<tr><td colspan="3">Total Savings over 15 Years:</td><td>${formatNumberWithCommas(totalSavings)}</td></tr></table>`;
    document.getElementById('financialTable').innerHTML = tableHtml;

    document.getElementById('savings').innerHTML = `15-Year Savings with New Ownership: <strong>$${formatNumberWithCommas(Math.abs(totalSavings))}</strong>`;
}

// Function to format numbers with commas for thousands
function formatNumberWithCommas(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
