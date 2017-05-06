window.onload = createHeader();

// Create the header
function createHeader(){
    var url = window.location.href;
    var loc = ""; // If we are not in root directory this is set to "../"
    if(url.charAt( url.length - 1 ) === "#"){
        loc = "../";
    }
    console.log(loc);
    document.getElementById("ovoMenu").innerHTML="<a href=\"index.html\">Home</a>"
        + "<a href=\"" + loc  + "about.html\">About</a>"
        + "<a href=\"" + loc  + "projects.html\">Projects</a>"
        + "<a href=\"" + loc  + "contact.html\">Contact Me</a>"
        + "<a href=\"" + loc  + "documents/resume.pdf\" target=\"_blank\">Resume</a>";
}
