
window.onload = function() {
    const form = document.getElementById("new-picture-form");
    const input_file = document.getElementById("new-picture-file");
    const input_title = document.getElementById("new-picture-title");
    const pictures = document.getElementById("pictures");
    const height = document.getElementById("height");
    const width = document.getElementById("width");

    fetch("http://197.163.22.96:3000/data")
    .then(function(jsonObj) {
        return jsonObj.json();
    })
    .then(function(obj) {
        obj.forEach(element => {
            creatingPicture(element.picture_name, element.picture_title, element.height, element.width);
        });
    })


    form.onsubmit = function(e) {
        e.preventDefault();
        
        if(!input_file.files[0]) {
            alert("Missing / Invalid File");
            return;
        }

        let maxSize =  5 * 1024 * 1024;
        if(input_file.size > maxSize) {
            alert("File is too big (max 5mb)");
            return;
        }

        if(!validateFileType(input_file))
        {
            alert("Only jpeg, png, jpg and gif files are allowed!");
            return;
        }

        if(!input_title.value) {
            alert("MISSING TITLE");
            return;
        }
        if(input_title.value.length > 20) {
            alert("Title Length longer than 20 Characters!");
            input_title.maxLength = 20;
            return;
        }


        if(height.value.length == 0 && width.value.length == 0) {
            height.value = 300;
            width.value = 300;
        }

        else if(+height.value < 4 || +width.value < 4 || +height.value > 1600 || +width.value > 1600) {
            alert("Width or height can only be as small as 4 px and as big as 1600px. If no width or height input is given, they will be 300px big.")
            return;
        }
 
        else if(height.value.length !== 0 && width.value.length !== 0) {

        }

        else {
            alert("Either height or width were wrong. Either both, or none of them need to be present. They cannot be smaller than 4px and cannot be bigger than 1600px. If no input is given, the size will be 300px for width and height.");
            return;
        }
        
        form.submit()
    }


    function validateFileType(file) {
        const fileName = file.value;
        const idxDot = fileName.lastIndexOf(".") + 1;
        const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile == "jpeg" ||extFile == "jpg" || extFile == "png" || extFile == "gif"){
            return true;
        }
        else {
            return false;
        } 
    }

    function creatingPicture(img_name, title, height, width) {
        let picture_div = document.createElement("div");
        picture_div.style.maxHeight = `${height + height / 4}px`;
        picture_div.style.maxWidth = `${width + width / 4}px`;
        picture_div.classList.add("picture-div");

        let img_el = document.createElement("img");
        img_el.classList.add("picture-img");
        console.log(height);
        console.log(width);
        img_el.style.height = `${height}px`;
        img_el.style.width = `${width}px`;
        img_el.src = `http://197.163.22.96:3000/pictures/${img_name}`;

        let img_title_el = document.createElement("input");
        img_title_el.setAttribute("readonly", true);
        img_title_el.classList.add("picture-title");
        img_title_el.maxLength = 20;
        img_title_el.type = "text";
        img_title_el.value = title;

        let actions = document.createElement("div");
        actions.classList.add("actions");

        let delete_el = document.createElement("button");
        delete_el.classList.add("delete");
        delete_el.value = "delete";
        delete_el.style.backgroundImage = "url(http://197.163.22.96:3000/pictures/garbage.png)";

        let edit_el = document.createElement("button");
        edit_el.value = "edit";
        edit_el.classList.add("edit");
        edit_el.style.backgroundImage = "url(http://197.163.22.96:3000/pictures/pencil.png)";

        actions.appendChild(delete_el);
        actions.appendChild(edit_el);

        picture_div.appendChild(img_el);
        picture_div.appendChild(img_title_el);
        picture_div.appendChild(actions);
        pictures.appendChild(picture_div);

        let currentFirstPicture = pictures.firstChild;
        pictures.insertBefore(picture_div, currentFirstPicture);
        const imgName = img_name;

        edit_el.onclick = function() {
            if(edit_el.value.toLowerCase() == "edit") {
                img_title_el.removeAttribute("readonly");
                img_title_el.focus();
                edit_el.style.backgroundImage = "url(http://197.163.22.96:3000/pictures/save.png)";
                edit_el.value = "save";
            }
            else if(edit_el.value.toLowerCase() == "save") {
                img_title_el.setAttribute("readonly", true);
                edit_el.value = "edit";
                edit_el.style.backgroundImage = "url(http://197.163.22.96:3000/pictures/pencil.png)";
                
                const data = { newInput: img_title_el.value, fileName: imgName };
                fetch("http://197.163.22.96:3000/update", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
            }

        }

        delete_el.onclick = function() {
            if(delete_el.value.toLowerCase() == "delete") {
                delete_el.style.backgroundImage = "url(http://197.163.22.96:3000/pictures/garbageRed.png)"
                delete_el.value = "sure";
            }
            
            else if(delete_el.value.toLowerCase() == "sure") {
                const data = { title: img_title_el.value, fileName: imgName };
                fetch("http://197.163.22.96:3000/delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
            },
            
            location.reload())
            .catch(function(error) {
                console.log(error);
                return;
            })
            }
        }
    }
}



  