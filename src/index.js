// @flow

import './style.css';
import template from './template/template.pug';

const url = "https://api.mlab.com/api/1/databases/date/collections/examp?apiKey=LIpZayMpFmauflPmAwNKDjPBT419c0ZT";

class InterviewsList {

    getList() {
        fetch("https://api.mlab.com/api/1/databases/date/collections/examp?apiKey=LIpZayMpFmauflPmAwNKDjPBT419c0ZT")
            .then(
                (response) => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }
                    response.json()
                        .then((data) => {
                            this.drawList(data);
                        });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    }

    drawList(data) {
        let interview = new InterviewPlate(data);
        interview.render();
    }
}

class InterviewPlate {

    data: Object;

    constructor(data: Object) {
        this.data = data;
    }

    render() {

        if (document.body) {
            let doc = document.body;
            doc.innerHTML = template({data: this.data})
        }

        let butAdd = document.getElementById('btn');

        if (butAdd !== null) {
            butAdd.addEventListener("click", (e: any) => {
                e.preventDefault();
                this.add();
            });
        }

        for (let i = 0; i < this.data.length; i++) {

            let formList = document.getElementsByTagName('form');
            formList[i].setAttribute('id', this.data[i]['_id']['$oid']);

            let editList = document.getElementsByClassName('butEdit');
            this.data[i].butEdit = editList[i];

            let deleteList = document.getElementsByClassName('butDelete');
            this.data[i].butDelete = deleteList[i];

            editList[i].addEventListener("click", (e: MouseEvent) => {
                e.preventDefault();
                let id = formList[i].id;
                this.edit(id);

                let saveList = document.getElementsByClassName('butSave');
                this.data[i].butSave = saveList[i];
                saveList[i].addEventListener('click', (e: MouseEvent) => {
                    e.preventDefault();
                    let id = formList[i].id;
                    this.update(id);
                });

                let closeList = document.getElementsByClassName('butClose');
                this.data[i].butClose = closeList[i];

                if (this.data[i].butEdit.form !== null) {

                    this.data[i].butEdit.style.display = 'none';
                    this.data[i].butDelete.style.display = 'none';
                    this.data[i].butSave.style.display = 'inline';
                    this.data[i].butClose.style.display = 'inline';
                }

                closeList[i].addEventListener("click", () => {
                    this.data[i].butEdit.style.display = 'inline';
                    this.data[i].butDelete.style.display = 'inline';
                    this.data[i].butSave.style.display = 'none';
                    this.data[i].butClose.style.display = 'none';
                    let id = formList[i].id;
                    this.block(id);
                });
            });

            deleteList[i].addEventListener("click", () => {
                let id = formList[i].id;
                this.destroy(id);
            });
        }
    }


    destroy(id) {
        for (let i = 0; i < this.data.length; i++) {

            if (id === this.data[i]['_id']['$oid']) {
                let isTrue = confirm("Delete it is form?");

                if (isTrue === true
                    && this.data[i].butDelete.parentNode !== null
                    && this.data[i].butDelete.parentNode !== undefined
                    && this.data[i].butDelete.parentNode.parentNode !== null
                    && this.data[i].butDelete.parentNode.parentNode !== undefined
                    && this.data[i].butDelete.form !== null) {

                    this.data[i].butDelete.parentNode.parentNode.removeChild(this.data[i].butDelete.form);
                    this.remove(id);
                }
            }
        }
    }

    remove(id) {
        for (let i = 0; i < this.data.length; i++) {
            if (id === this.data[i]['_id']['$oid']) {
                let [base, key] = url.split("?");
                let idUrl = base + "/" + this.data[i]['_id']['$oid'] + "?" + key;

                fetch(idUrl, {
                    method: "DELETE"
                })
                    .then(response => response.json())
                    .then(function () {
                        window.location.reload();
                    });
            }
        }
    }

    add() {

        let btn = (document.getElementById('btn'): any).form;
        if (btn[0].value !== "" && btn[1].value !== "" && btn[2].value !== "" && btn[3].value !== "") {
            fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: btn[0].value,
                    birthDate: btn[1].value,
                    phoneNumber: btn[2].value,
                    interviewNotes: btn[3].value
                })
            })
                .then(response => {
                    return response.json();
                })
                .then(function () {
                    window.location.reload();
                })
                .catch(error => {
                    console.log('Request failed', error);
                });
        } else {
            alert("All fields must be filled!")
        }
    }

    update(id) {
        for (let i = 0; i < this.data.length; i++) {

            if (id === this.data[i]['_id']['$oid']) {
                let [base, key] = url.split("?");
                let idUrl = base + "/" + this.data[i]['_id']['$oid'] + "?" + key;
                fetch(idUrl, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName: this.data[i].butSave.form[0].value,
                        birthDate: this.data[i].butSave.form[1].value,
                        phoneNumber: this.data[i].butSave.form[2].value,
                        interviewNotes: this.data[i].butSave.form[3].value
                    })
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(function () {
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log('Request failed', error);
                    });
            }
        }
    }

    edit(id) {
        for (let i = 0; i < this.data.length; i++) {
            if (id === this.data[i]['_id']['$oid']) {
                this.data[i].butEdit.form[0].removeAttribute("readonly");
                this.data[i].butEdit.form[1].removeAttribute("readonly");
                this.data[i].butEdit.form[2].removeAttribute("readonly");
                this.data[i].butEdit.form[3].removeAttribute("readonly");
            }
        }
    }

    block(id) {
        for (let i = 0; i < this.data.length; i++) {
            if (id === this.data[i]['_id']['$oid']) {
                this.data[i].butEdit.form[0].setAttribute("readonly", "readonly");
                this.data[i].butEdit.form[1].setAttribute('readonly', "readonly");
                this.data[i].butEdit.form[2].setAttribute('readonly', "readonly");
                this.data[i].butEdit.form[3].setAttribute('readonly', "readonly");
            }
        }
    }
}

let list = new InterviewsList();
list.getList();