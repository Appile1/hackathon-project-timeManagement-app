// "use client";

// import { useState } from "react";
// import { format } from "date-fns";

// export default function SimplePlanner() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [tasks, setTasks] = useState([
//     {
//       id: 1,
//       title: "Complete Math Assignment",
//       priority: "high",
//       dueDate: new Date(2024, 2, 15),
//       course: "Mathematics",
//       completed: false,
//     },
//     {
//       id: 2,
//       title: "Read Chapter 5",
//       priority: "medium",
//       dueDate: new Date(2024, 2, 20),
//       course: "Literature",
//       completed: true,
//     },
//     {
//       id: 3,
//       title: "Prepare for Physics Quiz",
//       priority: "low",
//       dueDate: new Date(2024, 2, 25),
//       course: "Physics",
//       completed: false,
//     },
//   ]);
//   const [newTask, setNewTask] = useState("");
//   const [newTaskPriority, setNewTaskPriority] = useState("medium");
//   const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());
//   const [newTaskCourse, setNewTaskCourse] = useState("");
//   const [filter, setFilter] = useState({ priority: "all", course: "all" });
//   const [sortBy, setSortBy] = useState("dueDate");

//   const addTask = () => {
//     if (newTask.trim() !== "" && newTaskCourse.trim() !== "") {
//       setTasks([
//         ...tasks,
//         {
//           id: Date.now(),
//           title: newTask,
//           priority: newTaskPriority,
//           dueDate: newTaskDueDate,
//           course: newTaskCourse,
//           completed: false,
//         },
//       ]);
//       setNewTask("");
//       setNewTaskPriority("medium");
//       setNewTaskDueDate(new Date());
//       setNewTaskCourse("");
//     }
//   };

//   const deleteTask = (id) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   const toggleTaskCompletion = (id) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, completed: !task.completed } : task
//       )
//     );
//   };

//   const filteredAndSortedTasks = tasks
//     .filter(
//       (task) =>
//         (filter.priority === "all" || task.priority === filter.priority) &&
//         (filter.course === "all" || task.course === filter.course)
//     )
//     .sort((a, b) => {
//       if (sortBy === "dueDate") {
//         return a.dueDate.getTime() - b.dueDate.getTime();
//       } else if (sortBy === "priority") {
//         const priorityOrder = { high: 0, medium: 1, low: 2 };
//         return priorityOrder[a.priority] - priorityOrder[b.priority];
//       }
//       return 0;
//     });

//   const priorityColors = {
//     high: "bg-red-500",
//     medium: "bg-yellow-500",
//     low: "bg-green-500",
//   };

//   const uniqueCourses = Array.from(new Set(tasks.map((task) => task.course)));

//   return (
//     <div
//       className={`min-h-screen p-8 transition-colors duration-200 ${
//         darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"
//       }`}
//     >
//       <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//           <h1 className="text-2xl font-bold">Simple Planner</h1>
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
//           >
//             {darkMode ? "🌞" : "🌙"}
//           </button>
//         </div>
//         <div className="p-6 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label htmlFor="new-task" className="block text-sm font-medium">
//                 New Task
//               </label>
//               <input
//                 id="new-task"
//                 type="text"
//                 placeholder="Add a new task"
//                 value={newTask}
//                 onChange={(e) => setNewTask(e.target.value)}
//                 className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//               />
//             </div>
//             <div className="space-y-2">
//               <label
//                 htmlFor="new-task-priority"
//                 className="block text-sm font-medium"
//               >
//                 Priority
//               </label>
//               <select
//                 id="new-task-priority"
//                 value={newTaskPriority}
//                 onChange={(e) => setNewTaskPriority(e.target.value)}
//                 className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//               >
//                 <option value="high">High</option>
//                 <option value="medium">Medium</option>
//                 <option value="low">Low</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label
//                 htmlFor="new-task-course"
//                 className="block text-sm font-medium"
//               >
//                 Course
//               </label>
//               <input
//                 id="new-task-course"
//                 type="text"
//                 placeholder="Enter course name"
//                 value={newTaskCourse}
//                 onChange={(e) => setNewTaskCourse(e.target.value)}
//                 className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//               />
//             </div>
//             <div className="space-y-2">
//               <label
//                 htmlFor="new-task-due-date"
//                 className="block text-sm font-medium"
//               >
//                 Due Date
//               </label>
//               <input
//                 id="new-task-due-date"
//                 type="date"
//                 value={format(newTaskDueDate, "yyyy-MM-dd")}
//                 onChange={(e) => setNewTaskDueDate(new Date(e.target.value))}
//                 className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//               />
//             </div>
//           </div>
//           <button
//             onClick={addTask}
//             className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
//           >
//             Add Task
//           </button>
//           <div className="flex flex-wrap gap-4">
//             <div className="flex-1 min-w-[200px] space-y-2">
//               <label
//                 htmlFor="priority-filter"
//                 className="block text-sm font-medium"
//               >
//                 Filter by priority:
//               </label>
//               <select
//                 id="priority-filter"
//                 value={filter.priority}
//                 onChange={(e) =>
//                   setFilter({ ...filter, priority: e.target.value })
//                 }
//                 className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//               >
//                 <option value="all">All</option>
//                 <option value="high">High</option>
//                 <option value="medium">Medium</option>
//                 <option value="low">Low</option>
//               </select>
//             </div>
//             <div className="flex-1 min-w-[200px] space-y-2">
//               <label
//                 htmlFor="course-filter"
//                 className="block text-sm font-medium"
//               >
//                 Filter by course:
//               </label>
//               <select
//                 id="course-filter"
//                 value={filter.course}
//                 onChange={(e) =>
//                   setFilter({ ...filter, course: e.target.value })
//                 }
//                 className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//               >
//                 <option value="all">All</option>
//                 {uniqueCourses.map((course) => (
//                   <option key={course} value={course}>
//                     {course}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex-1 min-w-[200px] space-y-2">
//               <label htmlFor="sort-by" className="block text-sm font-medium">
//                 Sort by:
//               </label>
//               <select
//                 id="sort-by"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//               >
//                 <option value="dueDate">Due Date</option>
//                 <option value="priority">Priority</option>
//               </select>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {uniqueCourses.map((course) => (
//               <div
//                 key={course}
//                 className="p-2 text-center border rounded-md dark:border-gray-600"
//               >
//                 {course}
//               </div>
//             ))}
//           </div>
//           <ul className="space-y-3">
//             {filteredAndSortedTasks.map((task) => (
//               <li
//                 key={task.id}
//                 className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
//               >
//                 <div className="flex items-center space-x-3 mb-2 sm:mb-0">
//                   <input
//                     type="checkbox"
//                     checked={task.completed}
//                     onChange={() => toggleTaskCompletion(task.id)}
//                     className="w-4 h-4"
//                   />
//                   <div className="flex flex-col">
//                     <div className="flex items-center space-x-2">
//                       <span
//                         className={`w-2 h-2 rounded-full ${
//                           priorityColors[task.priority]
//                         }`}
//                       />
//                       <span
//                         className={`font-medium ${
//                           task.completed ? "line-through text-gray-500" : ""
//                         }`}
//                       >
//                         {task.title}
//                       </span>
//                     </div>
//                     <div className="flex items-center mt-1 space-x-2 text-sm text-gray-500 dark:text-gray-400">
//                       <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs">
//                         {task.course}
//                       </span>
//                       <span>Due: {format(task.dueDate, "MMM d, yyyy")}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-semibold
//                     ${
//                       task.priority === "high"
//                         ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
//                         : task.priority === "medium"
//                         ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
//                         : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
//                     }`}
//                   >
//                     {task.priority}
//                   </span>
//                   <button
//                     onClick={() => deleteTask(task.id)}
//                     className="p-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
//                   >
//                     🗑️
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
