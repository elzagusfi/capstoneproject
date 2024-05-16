document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch('data_cleaning.json').then(response => response.json()),
        fetch('location.json').then(response => response.json()),
        fetch('productcategory.json').then(response => response.json()),
        fetch('activemachine.json').then(response => response.json()),
        fetch('favproduct.json').then(response => response.json())
    ]).then(([dataCleaning, locationData, productCategoryData, activeMachineData, favProductData]) => {
        const totalRevenue = dataCleaning.reduce((acc, item) => acc + parseFloat(item.TransTotal), 0);
        const totalQuantity = dataCleaning.reduce((acc, item) => acc + parseInt(item.RQty), 0);
        document.getElementById('total-revenue').innerText = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('total-quantity').innerText = totalQuantity;

        const categories = ['Food', 'Carbonated', 'Non Carbonated', 'Water'];
        const locations = ['GuttenPlans', 'EB Public Library', 'Brunswick Sq Mall', 'Earle Asphalt'];
        const categorySalesData = categories.map(category => {
            return locations.map(location => {
                return dataCleaning
                    .filter(item => item.Category === category && item.Location === location)
                    .reduce((acc, item) => acc + parseFloat(item.LineTotal), 0);
            });
        });

        const categoryChartCtx = document.getElementById('categoryChart').getContext('2d');
        new Chart(categoryChartCtx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: locations.map((location, index) => ({
                    label: location,
                    data: categorySalesData.map(data => data[index]),
                    backgroundColor: ['#007bff', '#00ccff', '#ff007b', '#ff9933'][index]
                }))
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const priceChartCtx = document.getElementById('priceChart').getContext('2d');
        new Chart(priceChartCtx, {
            type: 'bar',
            data: {
                labels: productCategoryData.map(item => item.Category),
                datasets: [{
                    label: 'AVG Product Price',
                    data: productCategoryData.map(item => parseFloat(item.AverageRetailPrice)),
                    backgroundColor: '#007bff'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Process Sales Based on Location
        const locationChartCtx = document.getElementById('locationChart').getContext('2d');
        new Chart(locationChartCtx, {
            type: 'pie',
            data: {
                labels: locationData.map(item => item.Location),
                datasets: [{
                    data: locationData.map(item => parseFloat(item.PercentageOfTotal)),
                    backgroundColor: ['#007bff', '#ff9933', '#ff007b', '#00ccff']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        // Process Sales Based on Active Machine
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const machineSalesData = locations.map(location => {
            return months.map(month => {
                return activeMachineData
                    .filter(item => item.Machine.includes(location) && item.MonthName === month)
                    .reduce((acc, item) => acc + parseFloat(item.TotalSales), 0);
            });
        });

        const machineChartCtx = document.getElementById('machineChart').getContext('2d');
        new Chart(machineChartCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: locations.map((location, index) => ({
                    label: location,
                    data: machineSalesData[index],
                    borderColor: ['#007bff', '#00ccff', '#ff007b', '#ff9933'][index],
                    fill: false
                }))
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const favProductChartCtx = document.getElementById('favProductChart').getContext('2d');
        new Chart(favProductChartCtx, {
            type: 'bar',
            data: {
                labels: favProductData.map(item => item.Product),
                datasets: [{
                    label: 'Total USD',
                    data: favProductData.map(item => parseFloat(item.TotalTransaction)),
                    backgroundColor: '#007bff'
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }).catch(error => console.error('Error loading JSON data:', error));
});

