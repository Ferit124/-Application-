// ==UserScript==
// @name         Complate(NEW)(Dark Mode) Balance+Withdraw Same Pop-Up
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description
// @author
// @match        https://dc.sftmy.com/
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    function createUnifiedPopup() {
        if (document.getElementById('openUnifiedPopup')) return;

        const btn = document.createElement('button');
        btn.id = 'openUnifiedPopup';
        btn.textContent = "X Pop-Up";

        Object.assign(btn.style, {
           position: 'fixed',
            top: '3px',
            right: '501px',
            zIndex: '999999',
            padding: '10px 15px',
            backgroundColor: '#0050a2',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '10px'
        });

        btn.addEventListener('click', () => {
            if (window.unifiedPopup && !window.unifiedPopup.closed) {
                window.unifiedPopup.focus();
                return;
            }

            const url1 = window.location.href;
            const url2 = window.location.href;

            const popup = window.open('', 'unifiedPopup', 'width=360,height=470,resizable=yes,scrollbars=no');
            window.unifiedPopup = popup;

            const popupHTML = `<!DOCTYPE html>
<html lang="tr">
<head>
<title>Unified Iframe Pop-Up</title>
<style>
html, body { margin:0; padding:0; height:100%; background:#181a1b; font-family: Arial, sans-serif; display:flex; flex-direction: column; gap:5px; }
iframe { width:100%; border:none; display:block; background:#181a1b; }
#iframe1 { flex:1; }
#iframe2 { height: 175px; }
#activeAlert {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #28a745;
    color: white;
    font-weight: bold;
    padding: 6px 15px;
    border-radius: 5px;
    z-index: 1000001;
    opacity: 0;
    pointer-events: auto;
    transition: opacity 1s ease;
    cursor: pointer;
}
#activeAlert {
    position: fixed;
    top: 46px;
    right: 300px;
    background: #28a745;
    color: white;
    font-weight: bold;
    padding: 6px 15px;
    border-radius: 5px;
    z-index: 1000001;
    opacity: 0;
    pointer-events: auto;
    transition: opacity 1s ease;
    cursor: pointer;
}
#activeAlert.visible { opacity: 1; }
@keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
#activeAlert.blinking { animation: blink 1s infinite; }

#alertMenu {
    position: fixed;
    top: 45px;  /* alert kutusunun hemen altı */
    right: 300px;
    background: #28a745;
    color: white;
    padding: 3px;
    border-radius: 5px;
    display: none;
    flex-direction: column;
    z-index: 1000002;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    min-width: 61px;
}

#alertMenu.show { display: flex; }
#alertMenu button {
    background: transparent;
    color: white;
    border: none;
    padding: 6px 6px;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
}

#alertMenu button:hover {
    background: rgba(255,255,255,0.2);
}
</style>
</head>
<body>
<iframe id="iframe1" src="${url1}"></iframe>
<iframe id="iframe2" src="${url2}"></iframe>

<div id="activeAlert">Aktif</div>
<div id="alertMenu">
    <button id="blinkMode">Blinking</button>
    <button id="solidMode">Sabit</button>
</div>

<script>
const activeAlert = document.getElementById('activeAlert');
const alertMenu = document.getElementById('alertMenu');
const blinkModeBtn = document.getElementById('blinkMode');
const solidModeBtn = document.getElementById('solidMode');

let isBlinking = true;
let isAlertActive = false;
let alertTimeoutId = null;

const iframe1 = document.getElementById('iframe1');
const iframe1Control = { previousValue:null, lastAlertValue:null, isChecking:true };


activeAlert.addEventListener('click', () => {
    if (isAlertActive) {
        alertMenu.classList.toggle('show');
    }
});


blinkModeBtn.addEventListener('click', () => {
    isBlinking = true;
    activeAlert.classList.add('blinking');
    alertMenu.classList.remove('show');
});
solidModeBtn.addEventListener('click', () => {
    isBlinking = false;
    activeAlert.classList.remove('blinking');
    alertMenu.classList.remove('show');
});

function showActiveAlert() {
    if (isAlertActive) return;
    isAlertActive = true;

    activeAlert.style.opacity = '0';
    activeAlert.classList.remove('visible', 'blinking');

    setTimeout(() => {
        activeAlert.classList.add('visible');
        activeAlert.style.opacity = '1';

        setTimeout(() => {
            if (isBlinking) {
                activeAlert.classList.add('blinking');
            } else {
                activeAlert.classList.remove('blinking');
            }
        }, 500);
    }, 10);

    clearTimeout(alertTimeoutId);
    alertTimeoutId = setTimeout(() => {
        activeAlert.classList.remove('blinking');
        activeAlert.style.opacity = '0';
        alertMenu.classList.remove('show');
        setTimeout(() => {
            activeAlert.classList.remove('visible');
            isAlertActive = false;
        }, 1000);
    }, 30000);
}

function valueCheckLoop() {
    try {
        const doc1 = iframe1.contentDocument || iframe1.contentWindow.document;
        if (doc1) {
            const elem = doc1.querySelector("#kt_content > div > div > app-users > app-user-profile > div > div > app-personal-information > div > app-users-transactions > div > div.card-body > div.table-responsive.angular-bootstrap-table > table > tbody > tr:nth-child(1) > td:nth-child(7)");
            if (elem) {
                const currentValue = elem.textContent.trim();
                if (iframe1Control.previousValue !== null && currentValue !== iframe1Control.previousValue && currentValue !== iframe1Control.lastAlertValue) {
                    showActiveAlert(currentValue);
                }
                iframe1Control.previousValue = currentValue;
            }
        }
    } catch (e) {
        console.error('Value check error:', e);
    }

    setTimeout(valueCheckLoop, 1300);
}

iframe1.onload = () => {
    const doc1 = iframe1.contentDocument || iframe1.contentWindow.document;

const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = year + '-' + month + '-' + day;


    function waitForInputElement() {
        const inputElement = doc1.querySelector("input[name='startDate']");


        if (inputElement) {
            console.log("Input element bulundu!");


            inputElement.value = formattedDate;


            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);


            const ngControl = doc1.querySelector("input[formcontrolname='startDate']");
            if (ngControl) {
                ngControl.value = formattedDate;
                ngControl.dispatchEvent(event);
                console.log("Angular form kontrolüne tarih gönderildi.");
            }
        } else {
            console.log("Input elementi bulunamadı, tekrar kontrol ediliyor...");
        }
    }




    const intervalId = setInterval(() => {
        waitForInputElement();


        if (doc1.querySelector("input[name='startDate']")) {
            clearInterval(intervalId);
        }
    }, 1000);


   function waitForEndDateInput() {
            const startDateInput = doc1.querySelector("input[name='startDate']");
            const endDateInput = doc1.querySelector("input[name='endDate']");


            if (endDateInput) {
                if (startDateInput && startDateInput.value) {
                    const startDate = new Date(startDateInput.value);
                    if (!isNaN(startDate)) {
                        startDate.setFullYear(startDate.getFullYear() + 1);
                        const year = startDate.getFullYear();
                        const month = String(startDate.getMonth() + 1).padStart(2, '0');
                        const day = String(startDate.getDate()).padStart(2, '0');
                        const formattedEndDate = year + '-' + month + '-' + day;


                        endDateInput.value = formattedEndDate;


                        const ngControlEndDate = doc1.querySelector("input[formcontrolname='endDate']");
                        if (ngControlEndDate) {
                            ngControlEndDate.value = formattedEndDate;
                            ngControlEndDate.dispatchEvent(new Event('input', { bubbles: true }));
                            console.log("EndDate Angular form kontrolüne tarih gönderildi.");
                        }

                       console.log("Input elementi bulunamadı, tekrar kontrol ediliyor...");
                    }
                }
            } else {
                console.log("EndDate input bulunamadı, tekrar deneniyor...");
            }
        }


        const intervalIdEndDate = setInterval(() => {
            waitForEndDateInput();


            if (doc1.querySelector("input[name='endDate']")) {
                clearInterval(intervalIdEndDate);
            }
        }, 1000);



    // === CSS Inject ===
    try {
        const style1 = doc1.createElement('style');
        style1.textContent = \`
            html, body { margin:0; padding:0; height:100%; background:#181a1b; }
            body {
    background: #181a1b;
}

   .col-xxl, .col-xxl-auto, .col-xxl-12, .col-xxl-11, .col-xxl-10, .col-xxl-9, .col-xxl-8, .col-xxl-7, .col-xxl-6, .col-xxl-5, .col-xxl-4, .col-xxl-3, .col-xxl-2, .col-xxl-1, .col-xl, .col-xl-auto, .col-xl-12, .col-xl-11, .col-xl-10, .col-xl-9, .col-xl-8, .col-xl-7, .col-xl-6, .col-xl-5, .col-xl-4, .col-xl-3, .col-xl-2, .col-xl-1, .col-lg, .col-lg-auto, .col-lg-12, .col-lg-11, .col-lg-10, .col-lg-9, .col-lg-8, .col-lg-7, .col-lg-6, .col-lg-5, .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md, .col-md-auto, .col-md-12, .col-md-11, .col-md-10, .col-md-9, .col-md-8, .col-md-7, .col-md-6, .col-md-5, .col-md-4, .col-md-3, .col-md-2, .col-md-1, .col-sm, .col-sm-auto, .col-sm-12, .col-sm-11, .col-sm-10, .col-sm-9, .col-sm-8, .col-sm-7, .col-sm-6, .col-sm-5, .col-sm-4, .col-sm-3, .col-sm-2, .col-sm-1, .col, .col-auto, .col-12, .col-11, .col-10, .col-9, .col-8, .col-7, .col-6, .col-5, .col-4, .col-3, .col-2, .col-1 {
    position: relative;
    width: 100%;
    padding-right: 12.5px;
    padding-left: 12.5px;
    top: 450px;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.form.form-label-right
	> div
	> div
	> div:nth-child(1)
	> div:nth-child(1)
	> select {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.form.form-label-right
	> div
	> div
	> div:nth-child(1)
	> div:nth-child(1)
	> small {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(1)
	> td:nth-child(7)
	> span {
		font-size: 21px;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div:nth-child(1)
	> div:nth-child(1)
	> div
	> table
	> tbody
	> tr {
	visibility: hidden !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> app-paginator {
	visibility: hidden !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody {
	margin-top: 10px !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.form.form-label-right
	> div
	> div
	> div:nth-child(1)
	> div.col-md-2 {
	visibility: hidden !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.form.form-label-right
	> div
	> div
	> div:nth-child(1)
	> div:nth-child(2) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.form.form-label-right
	> div
	> div
	> div:nth-child(1)
	> div.col-lg-2.ng-untouched.ng-pristine.ng-valid {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.form.form-label-right
	> div
	> div
	> div.row.mt-3.mb-3.ng-untouched.ng-dirty.ng-valid {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.form.form-label-right
	> div
	> div
	> div:nth-child(3) {
	display: none !important;
}



#transactionsPopupButton{
display: none !important;
}

#kt_content > app-subheader-wrapper{
display: none !important;
}

.btn.btn-light i {
    color: var(--darkreader-text-7e8299, #9f978a);
}

#kt_content > div > div > app-users > app-user-profile > div > div > app-personal-information > div > app-users-transactions > div > div.card-body > app-paginator > div.d-flex.align-items-center.py-3 > span{
    color: var(--darkreader-text-3f4254, #bab4ab);
}

.form-control {
    color: var(--darkreader-text-495057,  #bab4ab);
    background-color: var(--darkreader-background-ffffff, #181a1b);
    border-top-color: var(--darkreader-border-ced4da, #3c4144);
    border-right-color: var(--darkreader-border-ced4da, #3c4144);
    border-bottom-color: var(--darkreader-border-ced4da, #3c4144);
    border-left-color: var(--darkreader-border-ced4da, #3c4144);
}

.bg-light {
    background-color: var(--darkreader-background-f3f6f9, #1d2021) !important;
}

.btn.btn-hover-primary:not(:disabled):not(.disabled):active:not(.btn-text), .btn.btn-hover-primary:not(:disabled):not(.disabled).active, .show > .btn.btn-hover-primary.dropdown-toggle, .show .btn.btn-hover-primary.btn-dropdown {
    color: var(--darkreader-text-ffffff, #e8e6e3) !important;
    background-color: var(--darkreader-background-3699ff, #0055ac) !important;
    border-top-color: var(--darkreader-border-3699ff, #0050a2) !important;
    border-right-color: var(--darkreader-border-3699ff, #0050a2) !important;
    border-bottom-color: var(--darkreader-border-3699ff, #0050a2) !important;
    border-left-color: var(--darkreader-border-3699ff, #0050a2) !important;
}

.btn.btn-light {
    color: var(--darkreader-text-7e8299, #9f978a);
    background-color: var(--darkreader-background-f3f6f9, #1d2021);
    border-top-color: var(--darkreader-border-f3f6f9, #243648);
    border-right-color: var(--darkreader-border-f3f6f9, #243648);
    border-bottom-color: var(--darkreader-border-f3f6f9, #243648);
    border-left-color: var(--darkreader-border-f3f6f9, #243648);
}

.btn.btn-light.disabled i, .btn.btn-light:disabled i {
    color: var(--darkreader-text-7e8299, #9f978a);
}

.btn.btn-light.disabled, .btn.btn-light:disabled {
    color: var(--darkreader-text-7e8299, #9f978a);
    background-color: var(--darkreader-background-f3f6f9, #1d2021);
    border-top-color: var(--darkreader-border-f3f6f9, #243648);
    border-right-color: var(--darkreader-border-f3f6f9, #243648);
    border-left-color: var(--darkreader-border-f3f6f9, #243648);
    border-bottom-color: var(--darkreader-border-f3f6f9, #243648);
}

.header-fixed.subheader-fixed .subheader {
    box-shadow: var(--darkreader-background-523f6914, rgba(66, 50, 84, 0.08)) 0px 10px 30px;
    background-color: var(--darkreader-background-ffffff, #181a1b);
    border-top-color: var(--darkreader-border-ebedf3, #2a3146);
}

#kt_subheader > div {
    box-shadow: var(--darkreader-background-523f6914, rgba(66, 50, 84, 0.08)) 0px 10px 30px;
    background-color: var(--darkreader-background-ffffff, #181a1b);
    border-top-color: var(--darkreader-border-ebedf3, #2a3146);
}

.label {
    background-color: var(--darkreader-background-ebedf3, #212425);
    color: var(--darkreader-text-3f4254, #bab4ab);
}

.label.label-light-danger {
    color: var(--darkreader-text-f64e60, #f65364);
    background-color: var(--darkreader-background-ffe2e5, #440007);
}

.label.label-light-success {
    color: var(--darkreader-text-1bc5bd, #48e6df);
    background-color: var(--darkreader-background-c9f7f5, #0b4d4b);
}

.table th, .table td {
    border-top-color: var(--darkreader-border-ebedf3, #2a3146);
}

.nav .show>.nav-link, .nav .nav-link:hover:not(.disabled), .nav .nav-link.active {
    color: #181a1b; !important;
}

#kt_content > div > div > app-users > app-user-profile > div > div > app-personal-information > div > div.row > div:nth-child(1) > div > table > tbody > tr > td:nth-child(5){
    color: #bab4ab;
}

.table {
    color: #bab4ab52;
    background-color: transparent;
}

.card {
    background-color: #181a1b;
    border-top-color: #2a3146;
    border-right-color: #2a3146;
    border-bottom-color: #2a3146;
    border-left-color: #2a3146;
}







                   #kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-user-finance
	> div {
	display: none !important;
}

///.table th, .table td {
   /// padding: .1rem;
///}



#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-user-finance {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(7) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(7)
	> a {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> thead
	> th:nth-child(1) {
	display: none;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> tbody
	> tr
	> td:nth-child(1) {
	display: none;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> thead
	> th:nth-child(3) {
	display: none;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> thead
	> th:nth-child(4) {
	display: none;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> tbody
	> tr
	> td:nth-child(3) {
	display: none;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> tbody
	> tr
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(2) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(3) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-header {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> thead {
	display: none !important;
}



#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> tbody
	> tr
	> td:nth-child(5) {
	font-size: 45px;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(1)
	> td:nth-child(1) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(2)
	> td:nth-child(1) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(3)
	> td:nth-child(1) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(4)
	> td:nth-child(1) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(1)
	> td:nth-child(5) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(2)
	> td:nth-child(5) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(3)
	> td:nth-child(5) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(4)
	> td:nth-child(5) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(5)
	> td:nth-child(5) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(6)
	> td:nth-child(5) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(7)
	> td:nth-child(5) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(8)
	> td:nth-child(5) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(9)
	> td:nth-child(5) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(10)
	> td:nth-child(5) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(1)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(2)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(3)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(4)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(5)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(6)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(7)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(8)
	> td:nth-child(2) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(9)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(10)
	> td:nth-child(2) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(5)
	> td:nth-child(1) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(6)
	> td:nth-child(1) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(7)
	> td:nth-child(1) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(8)
	> td:nth-child(1) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(9)
	> td:nth-child(1) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(10)
	> td:nth-child(1) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(1)
	> td:nth-child(4) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(2)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(3)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(4)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(5)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(6)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(7)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(8)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(9)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(10)
	> td:nth-child(4) {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(4)
	> a {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(5)
	> a {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(9)
	> a {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(11)
	> a {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> thead
	> th:nth-child(2) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> thead
	> th:nth-child(5) {
	display: none !important;
}


#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> tbody
	> tr
	> td:nth-child(2) {
	display: none !important;
}


#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div.col-lg-12
	> label {
	display: none !important;
}


#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(2)
	> div {
	display: none !important;
}


#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(2)
	> label {
	display: none !important;
}


#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(1)
	> label {
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(12) {
	display: none;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(6) {
	display: none;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul
	> li:nth-child(1) {
	display: none;
}



#kt_content > div > div > app-users > app-user-profile > div > div > app-personal-information > div > div.card.card-custom.card-stretch.pt-4.pb-4 > ul > li:nth-child(10){
	display: none !important;
}


#kt_content > div > div > app-users > app-user-profile > div > div > app-personal-information > div > div.card.card-custom.card-stretch.pt-4.pb-4 > ul > li:nth-child(8){
	display: none !important;
}

#kt_header > div{
	display: none !important;
}


#kt_header_mobile{
	display: none !important;
}

#kt_footer > div > div {
	display: none !important;
}

#kt_dashboard_daterangepicker{
	display: none !important;
}

::-webkit-scrollbar {
	display: none !important;
}

#splash-screen {
	display: none !important;
}

///#kt_subheader{
	///display: none !important;
///}

#kt_header{
	display: none !important;
}

#kt_footer{
	display: none !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-user-finance
	> div
	> div.card-body {
	margin-top: 55px;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.card.card-custom.card-stretch.pt-4.pb-4
	> ul {
	margin-top: -100px;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row {
	padding: 50px;
	margin-top: -20px;
}

.card.card-custom > .card-body {
	padding: 0.1rem 2.25rem;
	margin-top: -585px; //-231px
}

#kt_content > div > div > app-users > app-user-profile > div {
	margin-top: -157px;
}

.nav-tabs {
	border-bottom: 0px solid #e4e6ef;
}

.form-group {
	margin-bottom: -0.1rem;
}

.row {
	text-align: middle;
}

.modal-open .modal {
	overflow-x: visible;
	overflow-y: visible;
}

.modal {
	top: -20px;
	left: 8px;
	width: 100%;
	height: 1%;
}

.modal-footer {
	align-items: center;
	justify-content: center;
	margin-top: -50px;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(1)
	> input {
	margin-top: -45px;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div.col-lg-12
	> input {
	margin-top: 4px;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.modal-footer {
	margin-top: -30px;
	border: 0px solid;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.modal-header {
	border: 0px solid;
}


.header-fixed.subheader-fixed .subheader {
        position: fixed;
        height: 54px;
        top: 90px;
        left: 40px;
        right: 40px;
        transition: top .3s ease;
        z-index: 95;
        box-shadow: 0 10px 30px #523f6914;
        background-color: #fff;
        border-top: 1px solid #EBEDF3;
        margin: 0;
    }

#kt_subheader {
        position: fixed !important;
        top: -25px !important;
        left: 0;
        width: 100% !important;
        z-index: 9999;
        background-color: #181a1b;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      body {
        padding-top: 60px !important;
      }

.mr-5, .mx-5 {
    margin-right: 0.25rem !important;
}

.pt-2, .py-2 {
    padding-top: 2.5rem !important;
}

.text-dark {
    color: #7e829970 !important;
}

.nav.nav-tabs.nav-tabs-line .nav-link {
    margin: 0 6rem;
}

.nav.nav-tabs.nav-tabs-line .nav-link:hover:not(.disabled),
.nav.nav-tabs.nav-tabs-line .nav-link.active,
.nav.nav-tabs.nav-tabs-line .show > .nav-link {
	border-bottom: 0px solid #3699ff;
}


#kt_subheader > div > div.d-flex.align-items-center.flex-wrap.mr-1 > div > h5 > span{
	display: none !important;
}

.container,
.container-fluid,
.container-sm,
.container-md,
.container-lg,
.container-xl,
.container-xxl {
	max-width: none;
	padding: 0 0px;
}


.flex-wrap {
    margin-right: -70px;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> div.row
	> div:nth-child(1)
	> div
	> table
	> tbody
	> tr
	> td:nth-child(5) {
	padding-left: 50px !important;
}

#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(1)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(2)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(3)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(3)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(4)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(5)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(6)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(7)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(8)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(9)
	> td:nth-child(9),
#kt_content
	> div
	> div
	> app-users
	> app-user-profile
	> div
	> div
	> app-personal-information
	> div
	> app-users-transactions
	> div
	> div.card-body
	> div.table-responsive.angular-bootstrap-table
	> table
	> tbody
	> tr:nth-child(10)
	> td:nth-child(9) {
	visibility: hidden !important;
}

        \`;
        doc1.head.appendChild(style1);
    } catch(e){ console.error('Style inject error:', e); }

    try {
        const elem = doc1.querySelector("#kt_content > div > div > app-users > app-user-profile > div > div > app-personal-information > div > app-users-transactions > div > div.card-body > div.table-responsive.angular-bootstrap-table > table > tbody > tr:nth-child(1) > td:nth-child(7) > span");
        if(elem) iframe1Control.previousValue = elem.textContent.trim();
    } catch(e){ console.error(e); }

     iframe1Control.isChecking = true;
    requestAnimationFrame(valueCheckLoop);

function clickButtonEvery2Seconds() {
        setInterval(() => {
            try {
                const button = doc1.evaluate('//*[@id="kt_content"]/div/div/app-users/app-user-profile/div/div/app-personal-information/div/app-users-transactions/div/div[2]/div[1]/div/div/div[2]/div[2]/ngb-timepicker/fieldset/div/div[5]/button[2]/span[1]', doc1, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (button) {
                    button.click();
                    console.log('Button clicked!');
                }
            } catch (e) {
                console.error('Error clicking the button:', e);
            }
        }, 1000);
    }


    clickButtonEvery2Seconds();

    function selectTodayIfInTransactions() {
        const activeTab = doc1.querySelector('a[role="tab"].active');
        if (activeTab && activeTab.textContent.trim() === 'Transactions') {
            const select = doc1.querySelector('select[name="period"][formcontrolname="period"]');
            if (select && select.value !== '1') {
                //select.value = '1'; // Today
                select.dispatchEvent(new Event('change', { bubbles: true }));
                select.dispatchEvent(new Event('input', { bubbles: true }));
            }

 const typeSelect = doc1.querySelector('select[name="type"][formcontrolname="type"]');
            if (typeSelect) {
                let toggle = false;
                if(window.typeToggleInterval) clearInterval(window.typeToggleInterval);

                window.typeToggleInterval = setInterval(() => {
                    toggle = !toggle;
                    typeSelect.value = toggle ? '6' : ''; // 6 = Rollback, '' = All
                    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    typeSelect.dispatchEvent(new Event('input', { bubbles: true }));
                }, 130000000000);
            }
        } else {
            if(window.typeToggleInterval){
                clearInterval(window.typeToggleInterval);
                window.typeToggleInterval = null;
            }
        }
    }

    const observer1 = new MutationObserver(() => {
        const tabLink = Array.from(doc1.querySelectorAll('a[role="tab"]')).find(el => el.textContent.trim() === 'Transactions');
        if(tabLink && !tabLink.classList.contains('active')) tabLink.click();

        selectTodayIfInTransactions();

        const dateHeader = Array.from(doc1.querySelectorAll('th.sortable')).find(th => th.textContent.trim().includes('DATE'));
        if(dateHeader){
            const sortIcon = dateHeader.querySelector('app-sort-icon, .svg-icon');
            const svgPath = sortIcon?.querySelector('path');
            if(!svgPath?.getAttribute('d')?.includes('12.7071068') && sortIcon) sortIcon.click();
            observer1.disconnect();
        }
    });
    observer1.observe(doc1, { childList:true, subtree:true });

};




        const iframe2 = document.getElementById('iframe2');
        iframe2.onload = () => {
            const doc2 = iframe2.contentDocument || iframe2.contentWindow.document;

            // CSS inject
            const style2 = doc2.createElement('style');
            style2.textContent = \`
                #example-modal-sizes-title-lg{
    color: #7e829970 !important;
}

#transactionsPopupButton{
display: none !important;
}

.text-dark {
    color: #7e829970 !important;
}

.modal-content input[name="amount"]::placeholder {
  color: transparent !important;
}

.modal-content input[name="note"]::placeholder {
  color: #bab4ab52 !important;
}


.form-control.form-control-solid {
    background-color: var(--darkreader-background-f3f6f9, #1d2021);
    border-top-color: var(--darkreader-border-f3f6f9, #2a3146);
    border-right-color: var(--darkreader-border-f3f6f9, #2a3146);
    border-bottom-color: var(--darkreader-border-f3f6f9, #2a3146);
    border-left-color: var(--darkreader-border-f3f6f9, #2a3146);
    color: var(--darkreader-text-3f4254, #bab4ab);
}

.form-control.form-control-solid:active, .form-control.form-control-solid.active, .form-control.form-control-solid:focus, .form-control.form-control-solid.focus {
    background-color: var(--darkreader-background-ebedf3, #212425);
    border-top-color: var(--darkreader-border-ebedf3, #2a3146);
    border-right-color: var(--darkreader-border-ebedf3, #2a3146);
    border-bottom-color: var(--darkreader-border-ebedf3, #2a3146);
    border-left-color: var(--darkreader-border-ebedf3, #2a3146);
    color: var(--darkreader-text-3f4254, #bab4ab);
}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #181a1b;
    background-clip: padding-box;
    border: 0 solid rgba(0,0,0,.2);
    border-radius: .42rem;
    box-shadow: 0 .25rem .5rem #0000001a;
    outline: 0;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div.col-lg-12
	> label {
	display: none !important;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(2)
	> div {
	display: none !important;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(2)
	> label {
	display: none !important;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(1)
	> label {
	display: none !important;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.modal-footer
	> button.btn.btn-light.btn-elevate.mr-2 {
	display: none !important;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(1)
	> div {
	display: none !important;
}

::-webkit-scrollbar {
          display: none;
        }

body {
    background: #181a1b
}

#kt_body > app-layout {
    opacity: -1;
}

.modal-backdrop.show {
    opacity: 0;
    display: none;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.modal-footer
	> button.btn.btn-primary.btn-elevate {
    margin-right: 25px;
    padding-left: 30px;
    padding-right: 30px;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(1)
	> input {
	margin-top: -45px;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div.col-lg-12
	> input {
	margin-top: 4px;
    width: 166px;
    margin-left: 172px;
    margin-top: -41px;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div.col-lg-12
	> div {
	display: none;
}


.form .form-group {
    margin-bottom: 0;
    padding-top: 15px;
    padding-bottom: 0px;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(2)
	> select {
    width: 167px
}


#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.modal-footer {
	margin-top: -21px;
	border: 0px solid;
    margin-right: 75px;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.modal-header {
	border: 0px solid;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> div
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(1)
	> input {
	padding: .825rem 3.42rem;
}

.modal-content {
    box-shadow: 0 .0rem 0rem #0000001a;
}

.modal-body {
    padding: 0.5rem;
}

input[name="amount"] {
    text-align: center;
}

.modal-title {
    margin-bottom: 18px;
    line-height: 0.9;
}

.modal-content {
    margin-top: -6px;
}

.mat-snack-bar-container {
  visibility: hidden !important;
  pointer-events: none !important;
}

#kt_body
	> ngb-modal-window
	> div
	> div
	> app-transfer-user-modal
	> divdiv.form.form-label-right
	> div.overlay.overlay-block.cursor-default.modal-body
	> form
	> div
	> div:nth-child(2)
	> select{
 color: #bab4ab52;
}

.modal-title {
    margin-left: 50px;
    margin-bottom: 18px;
    line-height: 0.9;
}

            \`;
            doc2.head.appendChild(style2);

            // JS inject
            const script2 = doc2.createElement('script');
    script2.textContent = \`
        (function() {
            'use strict';

            if (!sessionStorage.getItem('lastAmountActive')) {
                sessionStorage.setItem('lastAmountActive', 'true');
            }

            function clickFinanceTab(callback) {
                const financeTab = Array.from(document.querySelectorAll('a.nav-link, button'))
                    .find(el => el.textContent?.trim().toLowerCase().includes('finance'));
                if (financeTab) {
                    financeTab.click();
                    setTimeout(callback, 1000);
                } else {
                    setTimeout(() => clickFinanceTab(callback), 500);
                }
            }

            function waitForOpenModalBtn(callback) {
                const btn = document.querySelector(
                    '#kt_content > div > div > app-users > app-user-profile > div > div > app-personal-information > div > app-user-finance > div > div.card-header > div.card-toolbar > button'
                );
                if (btn) {
                    const style = window.getComputedStyle(btn);
                    if (style.display === 'none' || style.visibility === 'hidden') {
                        btn.style.display = 'block';
                        btn.style.visibility = 'visible';
                    }
                    callback(btn);
                } else {
                    setTimeout(() => waitForOpenModalBtn(callback), 500);
                }
            }

           function setupTitleCopy() {
    const observer = new MutationObserver((mutations, obs) => {
        const textDiv = document.getElementById('example-modal-sizes-title-lg');
        if (textDiv) {

            const match = textDiv.textContent.match(/'([^']+)'/);
            if (match) {
                const innerText = match[1];
                textDiv.textContent = innerText;
            }

            textDiv.style.cursor = 'pointer';
            textDiv.addEventListener('click', () => {
                try {

                    const popupUrl = window.location.href;
                    navigator.clipboard.writeText(popupUrl).then(() => {
                        textDiv.style.transform = 'scale(1.05)';
                        textDiv.style.boxShadow = '0 0 10px rgba(179, 215, 255, 0.5)';
                        textDiv.style.backgroundColor = '#2d3133';
                        setTimeout(() => {
                            textDiv.style.transform = 'scale(1)';
                            textDiv.style.boxShadow = 'none';
                            textDiv.style.backgroundColor = 'transparent';
                        }, 200);
                    });
                } catch(e){ console.log('Clipboard exception:', e); }
            });
                        obs.disconnect();
                    }
                });

                observer.observe(document.body, { childList:true, subtree:true });
            }

            function manageModal(modal) {
                const select = modal.querySelector('select[formcontrolname="type"]');
                if (select && select.value !== '71') {
                    select.value = '71';
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    select.dispatchEvent(new Event('input', { bubbles: true }));
                }

                const amountInput = modal.querySelector('input[formcontrolname="amount"]');
                if (amountInput) {
                    const lastAmountActive = sessionStorage.getItem('lastAmountActive') === 'true';
                    const saved = sessionStorage.getItem('lastAmount');
                    if (lastAmountActive && saved && !amountInput.value) {
                        amountInput.value = saved;
                        amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }

                    amountInput.addEventListener('input', e => {
                        if (sessionStorage.getItem('lastAmountActive') === 'true') {
                            sessionStorage.setItem('lastAmount', e.target.value);
                        }
                    });
                }

                if (!document.getElementById('toggleLastAmountBtn')) {
                    const toggleBtn = document.createElement('button');
                    toggleBtn.id = 'toggleLastAmountBtn';
                    toggleBtn.style.cssText = 'position:absolute; top:39px; right:12.8px; z-index:9999; min-width:35px; padding:12.2px 5px; font-size:10px; border:none; border-radius:4px; cursor:pointer; text-align:center;';
                    function updateButton() {
                        const active = sessionStorage.getItem('lastAmountActive') === 'true';
                        toggleBtn.textContent = active ? 'ON' : 'OFF';
                        toggleBtn.style.backgroundColor = '#181a1b';
                        toggleBtn.style.color = '#3f425473';
                        toggleBtn.style.boxShadow = active ? '0 0 10px rgba(24,26,27,0.5)' : 'none';
                        toggleBtn.style.transform = 'scale(1)';
                    }
                    toggleBtn.addEventListener('click', () => {
                        const current = sessionStorage.getItem('lastAmountActive') === 'true';
                        sessionStorage.setItem('lastAmountActive', current ? 'false' : 'true');
                        updateButton();
                    });
                    updateButton();
                    modal.appendChild(toggleBtn);
                }

                setupTitleCopy();
            }

            clickFinanceTab(() => {
                waitForOpenModalBtn(openModalBtn => {
                    const observer = new MutationObserver(() => {
                        const modal = document.querySelector('ngb-modal-window');
                        if (modal) {
                            modal.style.overflow = 'hidden';
                            const modalBody = modal.querySelector('.modal-body, .modal-content');
                            if (modalBody) modalBody.style.overflow = 'hidden';
                            manageModal(modal);
                        } else {
                            if (openModalBtn) openModalBtn.click();
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true });

                    if (openModalBtn) openModalBtn.click();

                    setInterval(() => {
                        const modal = document.querySelector('ngb-modal-window');
                        if (!modal && openModalBtn) {
                            openModalBtn.click();
                        }
                    }, 1000);
                });
            });

        })();
    \`;
    doc2.body.appendChild(script2);
};
    <\/script>
</body>
</html>`;

            popup.document.write(popupHTML);
            popup.document.close();
        });

        const observer = new MutationObserver(() => {
            if (!document.getElementById('openUnifiedPopup')) {
                document.body.appendChild(btn);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        document.body.appendChild(btn);
    }

    window.addEventListener('load', createUnifiedPopup);
})();







