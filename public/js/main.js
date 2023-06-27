const server = 'http://localhost:3001';
var studentId;
var studentName;
var studentGrade;

// Fetch student functions
async function fetchStudents() {
    const url = server + '/students';
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }
    const response = await fetch(url, options);
    const students = await response.json();
    populateContent(students);
}

// Add student function
async function addStudent() {
    const url = server + '/students';
    const student = { id: studentId, name: studentName, grade: studentGrade };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    }
    const response = await fetch(url, options);
    if (response.ok) {
        populateContent(await fetchStudents()); // update the chart
    }
}

// Delete student function
async function deleteStudent(id) {
    const url = server + '/students/' + id;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch(url, options);
}

// Edit student function
async function editStudent(id, name, grade) {
    const url = server + '/students/' + id;
    const student = { id: id, name: name, grade: grade };
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    }
    const response = await fetch(url, options);

    if (response.ok) {
        // If the response status is 200 or 204, assume the update was successful
        populateContent(await fetchStudents());
    }
}

// Median grade calculation
function calculateMedianGrade(students) {
    // sort the students by grade
    const sortedStudents = students.sort((a, b) => a.grade - b.grade);
    const numStudents = sortedStudents.length;
    // calculate the median index
    const medianIndex = Math.floor(numStudents / 2);
    // if the number of students is odd, return the median value
    if (numStudents % 2 !== 0) {
        return sortedStudents[medianIndex].grade;
    } else { // if the number of students is even, calculate the average of the middle two values
        return (sortedStudents[medianIndex - 1].grade + sortedStudents[medianIndex].grade) / 2;
    }
}

function getLetterGrade(grade) {
    if (grade >= 90 && grade <= 100) {
        return 'A';
    } else if (grade >= 87 && grade <= 89) {
        return 'A-';
    } else if (grade >= 84 && grade <= 86) {
        return 'B+';
    } else if (grade >= 80 && grade <= 83) {
        return 'B';
    } else if (grade >= 77 && grade <= 79) {
        return 'B-';
    } else if (grade >= 74 && grade <= 76) {
        return 'C+';
    } else if (grade >= 70 && grade <= 73) {
        return 'C';
    } else if (grade >= 67 && grade <= 69) {
        return 'C-';
    } else if (grade >= 64 && grade <= 66) {
        return 'D+';
    } else if (grade >= 62 && grade <= 63) {
        return 'D';
    } else if (grade >= 60 && grade <= 61) {
        return 'D-';
    }
    else {
        return 'F';
    }
}



function populateContent(students) { // populates an HTML table with the data from a list of students
    var table = document.getElementById('content');
    table.innerHTML = "<tr><th>Student Id</th><th>Full Name</th><th>Mark</th><th>Grade</th><th></th></tr>";

    // Display chart
    var gradeData = students;

    // Create an object to store the grades and their frequency
    var grades = {};
    gradeData.forEach(function (item) {
        if (grades[item.grade]) {
            grades[item.grade]++;
        } else {
            grades[item.grade] = 1;
        }
    });

    // Create an object to store the grades and their frequency
    var grades = {};
    gradeData.forEach(function (item) {
        var gradeRange = Math.floor(item.grade / 10) * 10 + 10;
        if (grades[gradeRange]) {
            grades[gradeRange]++;
        } else {
            grades[gradeRange] = 1;
        }
    });

    // Convert the grades object to an array of objects with x and y properties
    var xyValues = Object.keys(grades).map(function (key) {
        return { x: key, y: grades[key] };
    });

    // Sort the array by the x property in ascending order
    xyValues.sort(function (a, b) {
        return a.x - b.x;
    });

    var barColors = ["purple", "blue", "orange", "turquoise", "green", "red", "indigo", "yellow"];
    
    // Create chart
    new Chart("myChart", {
        type: "bar",
        data: {
            datasets: [
                {
                    label: "Number of Students",
                    backgroundColor: barColors,
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    data: xyValues.map(function (item) {
                        return item.y;
                    }),
                },
            ],
            labels: xyValues.map(function (item) {
                return item.x;
            }),
        },
        options: { 
            title: {
                display: true,
                text: "BAR CHART:",
                fontSize: 35
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            precision: 0,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Number of Students",
                        },
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            stepSize: 10,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Grade Range",
                        },
                        afterTickToLabelConversion: function (scaleInstance) {
                            scaleInstance.ticks.forEach(function (tick, index, ticks) {
                                var rangeStart = tick - 10;
                                var rangeEnd = tick;
                                ticks[index] = rangeStart + " - " + rangeEnd;
                            });
                        },
                    },
                ],
            },
        },
    });

    // Create chart
    new Chart("myChart1", {
        type: "pie",
        data: {
            datasets: [
                {
                    label: "Number of Students",
                    backgroundColor: barColors,
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    data: xyValues.map(function (item) {
                        return item.y;
                    }),
                },
            ],
            labels: xyValues.map(function (item) {
                return item.x;
            })
        },
        options: {
            title: {
                display: true,
                text: "PIE CHART:",
                fontSize: 35
            },
            tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                      return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = Math.floor(((currentValue/total) * 100)+0.5);
                    return percentage + "%";
                  }
                }
              },
              hover: {
                mode: 'nearest',
                intersect: true
              },
        },
    });

    // Set chart invisible until its button is clicked
    document.getElementById("myChart").style.display = "none";
    document.getElementById("myChart1").style.display = "none";

    // View chart button
    var chartVisible = false;

    viewButton = document.getElementById('viewChartButton');
    viewButton.innerHTML = "View Chart";
    viewButton.onclick = function () {
        chartVisible = !chartVisible;
        document.getElementById('myChart').style.display = chartVisible ? 'block' : 'none';
        document.getElementById('myChart1').style.display = chartVisible ? 'block' : 'none';
        var footer = document.querySelector("footer");
        setTimeout(function () {
            footer.scrollIntoView({ behavior: "smooth" });
        }, 100);

    };


    // Creates the elements' rows
    students.forEach(student => {
        var row = document.createElement('tr');

        var dataId = document.createElement('td');
        var textId = document.createTextNode(student.id);
        dataId.appendChild(textId);

        var dataName = document.createElement('td');
        var textName = document.createTextNode(student.name);
        dataName.appendChild(textName);

        var dataGrade = document.createElement('td');
        var textGrade = document.createTextNode(student.grade);
        dataGrade.appendChild(textGrade);

        var dataLetterGrade = document.createElement('td');
        var textLetterGrade = document.createTextNode(getLetterGrade(student.grade));
        dataLetterGrade.appendChild(textLetterGrade);

        // Creates edit button
        var editButton = document.createElement('button');
        editButton.innerHTML = "Edit";
        editButton.style.backgroundColor = "#2867CB";
        editButton.addEventListener("mouseover", function () {
            editButton.style.backgroundColor = "blue";

        });

        editButton.addEventListener("mouseout", function () {
            editButton.style.backgroundColor = "#2867CB";
        });


        editButton.onclick = function () {
            document.body.style.overflow = "hidden";
            // create a popup form for editing student details
            var form = document.createElement('form');
            form.style.display = "flex";
            form.style.flexDirection = "column";
            form.style.alignItems = "center";

            var studentIdInput = document.createElement('input');
            studentIdInput.type = "hidden";
            studentIdInput.name = "id";
            studentIdInput.value = student.id;
            form.appendChild(studentIdInput);

            var studentNameInput = document.createElement('input');
            studentNameInput.type = "text";
            studentNameInput.name = "name";
            studentNameInput.placeholder = "Enter student name";
            studentNameInput.value = student.name;
            form.appendChild(studentNameInput);

            var studentGradeInput = document.createElement('input');
            studentGradeInput.type = "number";
            studentGradeInput.name = "grade";
            studentGradeInput.placeholder = "Enter student grade";
            studentGradeInput.value = student.grade;
            form.appendChild(studentGradeInput);

            var saveButton = document.createElement('button');
            saveButton.innerHTML = "Update";
            saveButton.style.backgroundColor = "#2867CB";
            saveButton.addEventListener("mouseover", function () {
                saveButton.style.backgroundColor = "blue";
            });
            saveButton.addEventListener("mouseout", function () {
                saveButton.style.backgroundColor = "#2867CB";
            });
            saveButton.onclick = async function () {
                var formData = new FormData(form);
                var id = formData.get('id');
                var name = formData.get('name');
                var grade = formData.get('grade');
                if (id && name && grade) {
                    await editStudent(parseInt(id), name, parseInt(grade));
                    populateContent(await fetchStudents());
                    form.reset();
                    popup.style.display = "none"; // hide the popup form
                }
            };
            form.appendChild(saveButton);

            var cancelButton = document.createElement('button');
            cancelButton.innerHTML = "Cancel";
            cancelButton.style.backgroundColor = "gray";
            cancelButton.addEventListener("mouseover", function () {
                cancelButton.style.backgroundColor = "red";
            });
            cancelButton.addEventListener("mouseout", function () {
                cancelButton.style.backgroundColor = "gray";
            });
            cancelButton.onclick = function () {
                form.reset();
                popup.style.display = "none"; // hide the popup form
                document.body.style.overflow = "auto";
            };
            form.appendChild(cancelButton);

            var popup = document.createElement('div');
            popup.style.position = "fixed";
            popup.style.top = "50%";
            popup.style.left = "50%";
            popup.style.transform = "translate(-50%, -50%)";
            popup.style.backgroundColor = "white";
            popup.style.padding = "20px";
            popup.style.border = "1px solid black";
            popup.appendChild(form);

            document.body.appendChild(popup);
        };

        var dataEdit = document.createElement('td');
        dataEdit.style.paddingLeft = "100px";
        dataEdit.appendChild(editButton);

        // Creates delete button
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.style.backgroundColor = "transparent";
        deleteButton.style.color = "red";
        deleteButton.style.border = "2px solid red";
        deleteButton.addEventListener("mouseover", function () {
            deleteButton.style.backgroundColor = "red"; // set the background-color to darkred on hover
            deleteButton.style.color = "white";

        });

        deleteButton.addEventListener("mouseout", function () {
            deleteButton.style.backgroundColor = "transparent"; // set the background-color back to red when the mouse leaves the button
            deleteButton.style.color = "red";
        });
        deleteButton.onclick = function () {
            if (confirm("Are you sure you want to delete this student?")) {
                deleteStudent(student.id);
                fetchStudents();
            }
        };

        var dataDelete = document.createElement('td');
        dataDelete.appendChild(deleteButton);

        row.appendChild(dataId);
        row.appendChild(dataName);
        row.appendChild(dataGrade);
        row.appendChild(dataLetterGrade)
        row.appendChild(dataEdit);
        row.appendChild(dataDelete);
        table.appendChild(row);
    });

    // display the median grade
    var medianGrade = calculateMedianGrade(students);
    var medianRow = table.insertRow(-1);
    medianRow.innerHTML = '<td colspan="2"><strong>Median Grade:</strong></td><td colspan="3"><strong>' + medianGrade + '</strong></td>';
    // medianRow.innerHTML = '<td colspan="2">Median Grade:</td><td colspan="3">' + medianGrade + '</td>';

}

// The submit function

document.querySelector('form').addEventListener('submit', async (e) => {
    studentId = document.getElementById('studentId').value;
    studentName = document.getElementById('studentName').value;
    studentGrade = document.getElementById('studentGrade').value;
    if (studentId && studentName && studentGrade) {
        studentId = parseInt(studentId);
        studentGrade = parseInt(studentGrade);
        await editStudent(studentId, studentName, studentGrade); // Call the editStudent function instead of addStudent
        addStudent();
        fetchStudents();

        form.reset();
    }
    e.preventDefault();
});