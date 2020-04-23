const db = firebase.firestore();

const noteList = document.querySelector('#noteList');
function swap(){
    var login = document.getElementById("login-div");
    var reg = document.getElementById("register-div");

    login.style.display = (
        login.style.display == "none" ? "block" : "none");
    reg.style.display = (
        reg.style.display == "none" ? "block" : "none");

}

function register() {
    var email = document.getElementById("email_field2").value;
    var password = document.getElementById("password_field2").value;
    console.log(email);
    console.log(password);
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
            console.log(email);
            var errorCode = error.code;
            console.log(errorCode);
            var errorMessage = error.message;
            console.log(errorMessage);

            window.alert("Error : " + errorMessage);
        });
}

function login() {
    console.log("something");
    var email = document.getElementById("email_field").value;
    var password = document.getElementById("password_field").value;
    console.log("something2");
    console.log(email);
    console.log(password);
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user){
             window.location = "home.html";
        })
        .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        console.log(errorCode);
        var errorMessage = error.message;
        console.log(errorMessage);

        // window.alert("Error : " + errorMessage);
        window.alert(firebase.auth().currentUser);
        // ...
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.

        document.getElementById("noteList").style.display = "block";
        document.getElementById("post-note").style.display = "block";

        var user = firebase.auth().currentUser;



    } else {
        // No user is signed in.

        document.getElementById("noteList").style.display = "none";
        document.getElementById("post-note").style.display = "none";

    }
});

function logout(){
    firebase.auth().signOut();
    window.location = "index.html";
}


function renderNote(doc){
    let li = document.createElement('li');
    let a = document.createElement('a');
    let content = document.createElement('span');
    let title = document.createElement('span');
    li.setAttribute('data-id', doc.id);
    content.textContent = doc.data().content;
    title.textContent = doc.data().title;
    let p = document.createElement('p');
    let h2 = document.createElement('h2');
    p.appendChild(content);
    h2.appendChild(title);
    a.appendChild(h2);
    a.appendChild(p);
    li.appendChild(a);
    var button = document.createElement("button");
    button.setAttribute("id", "delete-note-button");
    button.onclick = function(){
        button.parentElement.remove();
        deleteNoteBtnClicked(doc.id);
    };
    button.innerHTML = "x";
    li.appendChild(button);

    return li;
}

db.collection('notes').get().then((snapshot) => {
    let ul = document.createElement('ul');

    snapshot.docs.forEach(doc =>{
        let li = renderNote(doc);
        ul.appendChild(li);
    })
    noteList.appendChild(ul);
})

const addNoteBtnUI = document.getElementById("post-note-btn");
addNoteBtnUI.addEventListener("click", addNoteBtnClicked);

function addNoteBtnClicked() {
    console.log('Button clicked');
    const addUserInputsUI = document.getElementsByClassName("user-input");

    let newNote ={};
    for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

        let key = addUserInputsUI[i].getAttribute('data-key');
        newNote[key] = addUserInputsUI[i].value;
    }

    return db.collection('notes').
    add({title: newNote['title'], content: newNote['content']}).
    then(ref => {
        console.log('Added document with ID', ref.id);
        location.reload();

    })
}

function deleteNoteBtnClicked(id){
    console.log('deletebtn clicked');
    return db.collection('notes').
        doc(id).
        delete();
}