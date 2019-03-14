const url = '../docs/ASP_NET_Core_Succinctly.pdf',
    scale = 1.5,
    canvas = document.querySelector('#pdf-render'),
    context = canvas.getContext('2d');

let pdfDoc = null,
    pageNumber = 1,
    pageNumberIsPending = null,    
    isPageRendering = false
    ;

const renderPaage = num => {
    isPageRendering = true;
    pdfDoc.getPage(pageNumber).then(page => {
        console.log(page);

        const viewPort = page.getViewport({ scale: scale });
        canvas.height = viewPort.height;
        canvas.width = viewPort.width;

        const renderCdx = {
            canvasContext: context,
            viewport: viewPort
        };


        page.render(renderCdx).promise.then(() => {


            isPageRendering = false;
            if (pageNumberIsPending !== null) {
                renderPaage(pageNumberIsPending);
                pageNumberIsPending = null;
            }

        });

        document.querySelector('#PageNo').textContent = num;
    });
    
};  

const queueRenderPage = num => {
    if (isPageRendering) {
        pageNumberIsPending = num;
    } else {
        renderPaage(num);
    }
};

const ShowPrevPage = () => {
    console.log("Prev Page");
    if (pageNumber <= 1) {
        return;
    }
    pageNumber--;
    queueRenderPage(pageNumber);
};

const ShowNextPage = () => {
    console.log("Next Page");
    if (pageNumber >= pdfDoc.numPages) {
        return;
    }
    pageNumber++;
    queueRenderPage(pageNumber);
};

pdfjsLib.getDocument(url).promise.then(doc => {
    pdfDoc = doc;    
    console.log(pdfDoc);

    document.querySelector('#PageNo').textContent = pageNumber;
    document.querySelector('#PageCount').textContent = pdfDoc.numPages;

    renderPaage(pageNumber);
});

document.querySelector('#prev-page').addEventListener('click', ShowPrevPage);
document.querySelector('#next-page').addEventListener('click', ShowNextPage);