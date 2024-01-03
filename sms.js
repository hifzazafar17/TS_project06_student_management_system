import inquirer from 'inquirer';
class Course {
    courseCode;
    courseName;
    constructor(courseCode, courseName) {
        this.courseCode = courseCode;
        this.courseName = courseName;
    }
    getCourseInfo() {
        return `${this.courseCode} - ${this.courseName}`;
    }
}
class Student {
    static studentCount = 0;
    studentID;
    name;
    coursesEnrolled = [];
    balance = 0;
    constructor(name) {
        Student.studentCount++;
        this.studentID = this.generateStudentID();
        this.name = name;
    }
    generateStudentID() {
        const uniqueID = (Math.floor(Math.random() * 90000) + 10000).toString();
        return `S${uniqueID}`;
    }
    enroll(course) {
        this.coursesEnrolled.push(course);
        console.log(`${this.name} enrolled in ${course.getCourseInfo()}`);
    }
    viewBalance() {
        console.log(`${this.name}'s Balance: $${this.balance}`);
    }
    payTuitionFees(amount) {
        if (amount > 0) {
            this.balance += amount;
            console.log(`${this.name} paid $${amount} towards tuition fees.`);
            this.viewBalance();
        }
        else {
            console.log('Invalid payment amount.');
        }
    }
    showStatus() {
        console.log(`Student ID: ${this.studentID}`);
        console.log(`Name: ${this.name}`);
        console.log('Courses Enrolled:');
        this.coursesEnrolled.forEach((course, index) => {
            console.log(`  ${index + 1}. ${course.getCourseInfo()}`);
        });
        this.viewBalance();
    }
    getStudentID() {
        return this.studentID;
    }
    getCoursesEnrolled() {
        return this.coursesEnrolled;
    }
    getName() {
        return this.name;
    }
}
class StudentManagementSystem {
    courses = [
        new Course('GD101', 'Graphic Designing'),
        new Course('WD102', 'Web Development'),
        new Course('PP103', 'Python Programming'),
        new Course('FL104', 'Freelancing'),
        new Course('DM105', 'Digital Marketing'),
    ];
    students = [];
    async addStudentInteractive() {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Enter student name:' },
            {
                type: 'list',
                name: 'courseIndex',
                message: 'Choose a course to enroll:',
                choices: this.courses.map((course, index) => `${index + 1}. ${course.getCourseInfo()}`),
            },
        ]);
        const selectedCourseIndex = parseInt(answers.courseIndex) - 1;
        const selectedCourse = this.courses[selectedCourseIndex];
        if (selectedCourse) {
            const student = new Student(answers.name);
            student.enroll(selectedCourse);
            student.showStatus();
            this.students.push(student);
        }
        else {
            console.log('Error: Selected course not found.');
        }
    }
    viewListOfStudents() {
        console.log('List of Enrolled Students:');
        this.students.forEach((student, index) => {
            console.log(`${index + 1}. ${student.getName()} - Student ID: ${student.getStudentID()}`);
        });
    }
    async viewStudentDetailsInteractive() {
        const { studentIndex } = await inquirer.prompt({
            type: 'list',
            name: 'studentIndex',
            message: 'Choose a student:',
            choices: this.students.map((student, index) => `${index + 1}. ${student.getName()}`),
        });
        const selectedStudent = this.students[studentIndex - 1];
        if (selectedStudent) {
            selectedStudent.showStatus();
        }
        else {
            console.log('Error: Selected student not found.');
        }
    }
    async makePaymentInteractive() {
        const { studentIndex, amount } = await inquirer.prompt([
            {
                type: 'list',
                name: 'studentIndex',
                message: 'Choose a student:',
                choices: this.students.map((student, index) => `${index + 1}. ${student.getName()}`),
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Enter payment amount:',
                validate: (value) => (value > 0 ? true : 'Invalid payment amount.'),
            },
        ]);
        const selectedStudent = this.students[studentIndex - 1];
        if (selectedStudent) {
            selectedStudent.payTuitionFees(Number(amount));
        }
        else {
            console.log('Error: Selected student not found.');
        }
    }
    async removeCourseInteractive() {
        const { studentIndex, courseIndex } = await inquirer.prompt([
            {
                type: 'list',
                name: 'studentIndex',
                message: 'Choose a student:',
                choices: this.students.map((student, index) => `${index + 1}. ${student.getName()}`),
            },
            {
                type: 'list',
                name: 'courseIndex',
                message: 'Choose a course to remove:',
                choices: (answers) => {
                    const selectedStudent = this.students[answers.studentIndex - 1];
                    return selectedStudent.getCoursesEnrolled().map((course, index) => `${index + 1}. ${course.getCourseInfo()}`);
                },
            },
        ]);
        const selectedStudent = this.students[studentIndex - 1];
        const removedCourse = selectedStudent.getCoursesEnrolled().splice(courseIndex - 1, 1);
        console.log(`${selectedStudent.getName()} removed course: ${removedCourse[0].getCourseInfo()}`);
        selectedStudent.showStatus();
    }
}
async function main() {
    const system = new StudentManagementSystem();
    console.log('Welcome to the Student Management System');
    while (true) {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: [
                'Add Student',
                'View Students',
                'View Student Details',
                'Make Payment',
                'Remove Course',
                'Exit',
            ],
        });
        switch (action) {
            case 'Exit':
                console.log('Exiting Student Management System. Goodbye!');
                return;
            case 'Add Student':
                await system.addStudentInteractive();
                break;
            case 'View Students':
                system.viewListOfStudents();
                break;
            case 'View Student Details':
                await system.viewStudentDetailsInteractive();
                break;
            case 'Make Payment':
                await system.makePaymentInteractive();
                break;
            case 'Remove Course':
                await system.removeCourseInteractive();
                break;
        }
    }
}
// Run the interactive function
main();
