// Define technical keywords and related interview questions
const TECHNICAL_QUESTIONS = {
    "Java": "What are the key features of Java?",
    "Python": "What are Python's advantages over other languages?",
    "C++": "Explain the difference between C++ and Java.",
    "JavaScript": "What is the difference between let, const, and var?",
    "Spring": "How does Spring Boot simplify application development?",
    "React": "What are React Hooks?",
    "Node.js": "How does Node.js handle asynchronous operations?",
    "SQL": "What is normalization in SQL databases?",
    "Docker": "What is containerization in Docker?",
    "AWS": "What are the benefits of using AWS over traditional hosting?",
    "Cloud": "Explain cloud computing models: IaaS, PaaS, and SaaS.",
    "Machine Learning": "What is the difference between supervised and unsupervised learning?",
    "AI": "What are some real-world applications of AI?",
    "TensorFlow": "What are the advantages of TensorFlow for deep learning?"
};

// Function to extract text from the uploaded PDF
function extractTextFromPDF(file) {
    let reader = new FileReader();
    reader.onload = function () {
        let typedarray = new Uint8Array(reader.result);

        pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
            let textContent = "";
            let pagePromises = [];

            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                pagePromises.push(pdf.getPage(i).then(page => {
                    return page.getTextContent().then(text => {
                        return text.items.map(item => item.str).join(" ");
                    });
                }));
            }

            // Process all pages
            Promise.all(pagePromises).then(pages => {
                textContent = pages.join(" ");
                analyzeText(textContent);
            });
        });
    };
    reader.readAsArrayBuffer(file);
}

// Function to analyze text, extract keywords, and generate questions
function analyzeText(text) {
    let foundKeywords = [];
    let interviewQuestions = [];

    // Check for keywords in the resume text
    Object.keys(TECHNICAL_QUESTIONS).forEach(keyword => {
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
            interviewQuestions.push(TECHNICAL_QUESTIONS[keyword]);
        }
    });

    // Display extracted keywords and questions
    document.getElementById("keywords").innerHTML = foundKeywords.length ? foundKeywords.join(", ") : "No keywords detected";
    document.getElementById("questions").innerHTML = interviewQuestions.length ? interviewQuestions.join("<br>") : "No questions generated";
}

// Function to handle file upload and process the resume
function processResume() {
    let fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) {
        alert("Please upload a PDF file.");
        return;
    }

    let file = fileInput.files[0];
    if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
    }

    extractTextFromPDF(file);
}
