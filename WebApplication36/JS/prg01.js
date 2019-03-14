const url = '../docs/ASP_NET_Core_Succinctly.pdf';
const scale = 1.5;

let container = document.getElementById('mySVG');
let pdfDoc = null;
let pageNumber = 1;

pdfjsLib.getDocument(url)
        .promise
        .then(doc =>
                    {
                        pdfDoc = doc;
                        renderPaage(pageNumber);
                    }
            );

function renderPaage(num)
{   
    pdfDoc.getPage(pageNumber)
          .then(page =>
          {
            const viewPort = page.getViewport({ scale: scale });        
            container.style.width = viewPort.width + 'px';
            container.style.height = viewPort.height + 'px';

            page.getOperatorList()
                .then(opList =>
                {
                    var svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
                    return svgGfx.getSVG(opList, viewPort);
                })
                .then(svg =>
                {
                    container.appendChild(svg);
                    if (pageNumber < pdfDoc.numPages) renderPaage(pageNumber++);
                });
          });
}