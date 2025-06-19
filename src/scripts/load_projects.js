const allProjects = [
  {
    projectImg: {
      src: "./src/assets/images/project_images/project1.png",
      altText: "Img of a ImgStore Project",
    },
    projectDetails: {
      id: 0,  
      projectName: "ImgStore",
      title: "Image Store or Gallery",
      description:
        "ImgStore is a modern, visually engaging web application that showcases a collection of nature-themed images with smooth, animated transitions.",
    },
    technologies: {
        techImg: [
            "./src/assets/images/skill_images/html5.svg",
            "./src/assets/images/skill_images/css3.svg",
            "./src/assets/images/skill_images/javascript.svg",
            "./src/assets/images/skill_images/gsap.svg",
          ],
          techAltText: ["HTML", "CSS", "JavaScript","GSAP"],
        },
    links: {
      liveSite: "https://abhi-zero.github.io/ImgStore/",
      code: "https://github.com/abhi-zero/ImgStore",
    },
    textBgCssColor: "hsl(180, 100%, 25%)",
  },
  {
    projectImg: {
      src: "./src/assets/images/project_images/ZapQuiz.png",
      altText: "Img of a ZapQuiz Project",
    },
    projectDetails: {
        id: 0,  
      projectName: "ZapQuiz",
      title: "ZapQuiz, Test our brain",
      description:
        "ZapQuiz is an interactive web-based quiz application designed to test your knowledge.",
    },
    technologies: {
      techImg: [
        "./src/assets/images/skill_images/html5.svg",
        "./src/assets/images/skill_images/css3.svg",
        "./src/assets/images/skill_images/javascript.svg",
        "./src/assets/images/skill_images/gsap.svg",
        "./src/assets/images/skill_images/locoMotive.png",
      ],
      techAltText: ["HTML", "CSS", "JavaScript", "GSAP", "Loco Motive"],
    },
    links: {
      liveSite: "https://abhi-zero.github.io/ZapQuiz/",
      code: "https://github.com/abhi-zero/ZapQuiz",
    },
    textBgCssColor: "hsl(240, 4%, 16%)",
  },
  {
    projectImg: {
      src: "./src/assets/images/project_images/Daily-Quote-App.png",
      altText: "Img of a Daily Quote  Project",
    },
    projectDetails: {
        id: 0,  
      projectName: "Daily Quote App",
      title: "Daily Quote App",
      description:
        "Daily Quote App delivers a fresh, inspiring quote every day. Quotes are automatically generated and beautifully presented to motivate and uplift you.",
    },
    technologies: {
      techImg: [
        "./src/assets/images/skill_images/html5.svg",
        "./src/assets/images/skill_images/css3.svg",
        "./src/assets/images/skill_images/javascript.svg",
        "./src/assets/images/skill_images/gsap.svg",
      ],
      techAltText: ["HTML", "CSS", "JavaScript", "GSAP"],
    },
    links: {
      liveSite: "https://abhi-zero.github.io/daily-quote-app/",
      code: "https://github.com/abhi-zero/daily-quote-app",
    },
    textBgCssColor: " hsl(240, 100%, 6%)",
  },
];

// Get the root element
let  r = document.querySelector(':root');

// Create a function for getting a variable value
function myFunction_get() {
  // Get the styles (properties and values) for the root
  let rs = getComputedStyle(r);
  // Alert the value of the --gradient-color variable
  alert("The value of --gradient-color is: " + rs.getPropertyValue('--gradient-color'));
}

// Create a function for setting a variable value
function myFunction_set(color) {
  // Set the value of variable --blue to another value (in this case "lightblue")
  r.style.setProperty('--gradient-color', color);
}

function createElem(elem, elemClass){
    const createdElem = document.createElement(elem);
    createdElem.classList.add(elemClass);
    return createdElem;
}



function generatedProjectCard(project) {
    const projectsContainer = document.querySelector(".projects-content");
    const projectContainer = createElem("div", "project");

    // Project Image
    const projectImg = createElem("img", "projectImg");
    projectImg.src = project.projectImg.src;
    projectImg.alt = project.projectImg.altText;

    // Project Text Content
    const projectTextContainer = createElem("div", "project-textcontent");
    projectTextContainer.classList.add("bg");

    // Title
    const projectTitle = createElem("h2", "project-title");
    projectTitle.textContent = project.projectDetails.title;

    // Description
    const projectDescription = createElem("p", "project-description");
    projectDescription.textContent = project.projectDetails.description;

    // Technologies
    const projectTechs = createElem("div", "project-techs");
    const techImgs = project.technologies.techImg;
    const techAltTexts = project.technologies.techAltText || [];
    techImgs.forEach((src, i) => {
        const techImg = document.createElement("img");
        techImg.src = src;
        techImg.alt = techAltTexts[i] || "";
        techImg.title = techAltTexts[i] || "";
        projectTechs.appendChild(techImg);
    });

    // Links
    const projectLinks = createElem("div", "links");
    const anchorViewLive = createElem("a", "button");
    anchorViewLive.classList.add("primary-cta");
    anchorViewLive.href = project.links.liveSite;
    anchorViewLive.textContent = "View Live";
    anchorViewLive.target = "_blank";

    const anchorViewCode = createElem("a", "button");
    anchorViewCode.classList.add("secondary-cta");
    anchorViewCode.href = project.links.code;
    anchorViewCode.textContent = "View Code";
    anchorViewCode.target = "_blank";

    projectLinks.appendChild(anchorViewLive);
    projectLinks.appendChild(anchorViewCode);

    // Assemble
    projectTextContainer.appendChild(projectTitle);
    projectTextContainer.appendChild(projectDescription);
    projectTextContainer.appendChild(projectTechs);
    projectTextContainer.appendChild(projectLinks);

    projectContainer.appendChild(projectImg);
    projectContainer.appendChild(projectTextContainer);

    projectsContainer.appendChild(projectContainer);


    const bgColor = project.textBgCssColor 
    myFunction_set(bgColor);

}
const projectList = document.querySelector("#projectList");

function generateList(project,idx){
    const list = createElem("li", "list");
    const listHeading4 = createElem("h4", "project-heading");
    listHeading4.textContent = project.projectDetails.projectName
    listHeading4.setAttribute("data-id", idx)

    list.appendChild(listHeading4);
    projectList.appendChild(list);
    console.log(listHeading4);
    
}

// Loop through all projects and generate cards
allProjects.forEach((project, idx) => {
    generateList(project, idx);
    if(idx == 0){
        generatedProjectCard(project)
        const li = document.querySelector("#projectList .list");
        li.classList.add("active");
    }
});

projectList.addEventListener("click", (event) => {
    // Find the closest h4 with a data-id attribute (handles clicks on child elements)
    const heading = event.target.closest("h4[data-id]");
    if (!heading) return;

    const clickedId = heading.dataset.id;
    // Remove 'active' class from all list items, add to the clicked one for visual feedback
    const allLists = document.querySelectorAll("#projectList .list")
    allLists.forEach(li => li.classList.remove("active"));
    heading.parentElement.classList.add("active");

    // Optionally clear previous project content before rendering new one
    const projectsContainer = document.querySelector(".projects-content");
    if (projectsContainer) {
        projectsContainer.innerHTML = "";
    }

    // Find the project by index (since generateList uses idx as data-id)
    const project = allProjects[clickedId];
    console.log(project);
    
    if (project) {
        generatedProjectCard(project);
    }
});