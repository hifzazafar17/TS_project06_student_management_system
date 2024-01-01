import inquirer from 'inquirer';

class Course {
  constructor(private courseCode: string, private courseName: string) {}

  getCourseInfo(): string {
    return `${this.courseCode} - ${this.courseName}`;
  }
}

class Student {
  private static studentCount: number = 0;
  private studentID: string;
  private name: string;
  private coursesEnrolled: Course[] = [];
  private balance: number = 0;

  constructor(name: string) {
    Student.studentCount++;
    this.studentID = this.generateStudentID();
    this.name = name;
  }

  private generateStudentID(): string {
    const uniqueID = (Math.random() * 100000).toFixed(0).padStart(5, '0');
    return `S${uniqueID}`;
  }

  enroll(course: Course): void {
    this.coursesEnrolled.push(course);
    console.log(`${this.name} enrolled in ${course.getCourseInfo()}`);
  }

  viewBalance(): void {
    console.log(`${this.name}'s Balance: $${this.balance}`);
  }

  payTuitionFees(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      console.log(`${this.name} paid $${amount} towards tuition fees.`);
      this.viewBalance();
    } else {
      console.log('Invalid payment amount.');
    }
  }

  showStatus(): void {
    console.log(`Student ID: ${this.studentID}`);
    console.log(`Name: ${this.name}`);
    console.log('Courses Enrolled:');
    this.coursesEnrolled.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.getCourseInfo()}`);
    });
    this.viewBalance();
  }

  getStudentID(): string {
    return this.studentID;
  }

  getCoursesEnrolled(): Course[] {
    return this.coursesEnrolled;
  }

  getName(): string {
    return this.name;
  }
}

class StudentManagementSystem {
  private students: Student[] = [];

  async addStudentInteractive(): Promise<void> {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'name', message: 'Enter student name:' },
      { type: 'input', name: 'courseCode', message: 'Enter course code:' },
      { type: 'input', name: 'courseName', message: 'Enter course name:' },
    ]);

    const course = new Course(answers.courseCode, answers.courseName);
    const student = new Student(answers.name);
    student.enroll(course);
    student.showStatus();
    this.students.push(student);
  }

  viewListOfStudents(): void {
    console.log('List of Enrolled Students:');
    this.students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.getName()} - Student ID: ${student.getStudentID()}`);
    });
  }

  async viewStudentDetailsInteractive(): Promise<void> {
    const { studentIndex } = await inquirer.prompt({
      type: 'list',
      name: 'studentIndex',
      message: 'Choose a student:',
      choices: this.students.map((student, index) => `${index + 1}. ${student.getName()}`),
    });

    const selectedStudent = this.students[studentIndex - 1];
    if (selectedStudent) {
      selectedStudent.showStatus();
    } else {
      console.log('Error: Selected student not found.');
    }
  }

  async makePaymentInteractive(): Promise<void> {
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
    } else {
      console.log('Error: Selected student not found.');
    }
  }

  async removeCourseInteractive(): Promise<void> {
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
    console.log(`${selectedStudent.getName} removed course: ${removedCourse[0].getCourseInfo()}`);
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
