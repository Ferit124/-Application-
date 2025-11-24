import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Gizli token (loader ile aynı olmalı)
const SECRET = "MY_SUPER_SECRET_TOKEN";

// createPopupButton fonksiyonunu burada tanımlıyoruz
function createPopupButton() {
    if (document.getElementById('transactionsPopupButton')) return;

    const button = document.createElement('button');
    button.id = 'transactionsPopupButton';
    button.textContent = 'Transactions';
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 20px',
        zIndex: 10000,
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });

    button.onclick = () => {
        const popup = window.open(
            '',
            'transactionsPopup',
            'width=1000,height=700,resizable=yes,scrollbars=yes'
        );

        popup.document.body.style.margin = '0';
        popup.document.body.innerHTML = `
            <iframe id="transactionsIframe" src="https://dc.sftmy.com/#/users/transactions"
                    style="width:100%; height:100%; border:none;">
            </iframe>
            <div id="newDataBanner" style="
                position:fixed; top:0; left:0; width:100%;
                background-color:yellow; color:black; text-align:center;
                font-weight:bold; display:none; z-index:10001; padding:5px;">
            </div>
        `;

        const iframe = popup.document.getElementById('transactionsIframe');
        const banner = popup.document.getElementById('newDataBanner');
        let previousTableData = [];

        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/866/866-preview.mp3');
        audio.preload = 'auto';
        audio.volume = 0.9;

        iframe.addEventListener('load', () => {
            const doc = iframe.contentDocument || iframe.contentWindow.document;

            const popupStyle = doc.createElement('style');
            popupStyle.textContent = `
                #kt_aside { display: none !important; }
                #kt_header{ display: none !important; }
                #kt_subheader{ display: none !important; }
                #transactionsPopupButton{ display: none !important; }
            `;
            doc.head.appendChild(popupStyle);

            fillFormAndToggle();
        });

        async function fillFormAndToggle() {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            if (!doc) return setTimeout(fillFormAndToggle, 500);

            const typeSelect = doc.querySelector('select[name="type"]');
            const categorySelect = doc.querySelector('select[name="category"]');
            const startDateInput = doc.querySelector('input[name="startDate"]');
            const endDateInput = doc.querySelector('input[name="endDate"]');
            const submitBtn = doc.querySelector('button[type="submit"], button.btn-primary');

            if (!typeSelect || !categorySelect || !startDateInput || !endDateInput || !submitBtn) {
                setTimeout(fillFormAndToggle, 500);
                return;
            }

            const today = new Date().toISOString().split('T')[0];

            typeSelect.value = '1';
            categorySelect.value = '4';
            startDateInput.value = today;
            endDateInput.value = today;

            ['change','input'].forEach(ev => {
                typeSelect.dispatchEvent(new Event(ev, { bubbles: true }));
                categorySelect.dispatchEvent(new Event(ev, { bubbles: true }));
                startDateInput.dispatchEvent(new Event(ev, { bubbles: true }));
                endDateInput.dispatchEvent(new Event(ev, { bubbles: true }));
            });

            submitBtn.click();

            const tableContainer = doc.querySelector('div.table-responsive.angular-bootstrap-table');
            if (tableContainer) {
                const tableObserver = new MutationObserver(() => checkNewData(doc, banner, audio, previousTableData));
                tableObserver.observe(tableContainer, { childList: true, subtree: true });
            }

            async function toggleLoop() {
                while (true) {
                    if (!typeSelect || !submitBtn) break;

                    typeSelect.value = '6';
                    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    submitBtn.click();
                    await new Promise(r => setTimeout(r, 500));

                    typeSelect.value = '1';
                    typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    submitBtn.click();
                    await new Promise(r => setTimeout(r, 1500));

                    checkNewData(doc, banner, audio, previousTableData);

                    await new Promise(r => setTimeout(r, 8500));
                }
            }

            toggleLoop();
        }

        function checkNewData(doc, banner, audio, previousTableData) {
            const rows = doc.querySelectorAll('#kt_content app-users-transactions table tbody tr');
            if (!rows.length) return;

            const currentTableData = Array.from(rows).map(tr => tr.textContent.trim());
            const newRows = currentTableData.filter((val, idx) => val !== previousTableData[idx]);
            const hasOtherNewValues = newRows.some(val => !val.includes("Deposit from Bonus"));

            if (hasOtherNewValues) {
                previousTableData.length = 0;
                previousTableData.push(...currentTableData);

                banner.textContent = "Yeni değerler geldi!";
                banner.style.display = "block";

                audio.currentTime = 0;
                audio.play().catch(e => console.log("Ses çalınamadı:", e));

                setTimeout(() => { banner.style.display = "none"; }, 5000);
            } else {
                previousTableData.length = 0;
                previousTableData.push(...currentTableData);
            }
        }

        iframe.addEventListener('load', fillFormAndToggle);
    };

    document.body.appendChild(button);
}

// API endpoint
app.post("/get-script", (req, res) => {
    if (req.headers["x-auth"] !== SECRET) {
        return res.status(403).json({ error: "Unauthorized" });
    }

  
     res.json({ code });
});

app.listen(3000, () => console.log("Server running on port 3000"));
