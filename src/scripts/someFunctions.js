// Export the function
export const sampleFunction = () => {
    alert('Hello From Separate Functions!');
};

// Attach the event listener when the module is loaded
document.getElementById('myButton').addEventListener('click', sampleFunction);
