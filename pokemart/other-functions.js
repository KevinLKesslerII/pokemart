// Miscellaneous Functions (not Cart-related or Name-related)


function CreatePageHeader() {
    document.getElementById("pageHeader").innerHTML = `<img src="file4.jpg" alt="PokeMart Sign" />`;
}


function CreatePageFooter() {
    document.getElementById("pageFooter").innerHTML = `<hr><p>&copy; 2024 PokeMart, Silph Co. all rights reserved<br>Javascript Coding by Kevin Kessler II</p>` 
}


function SwapImages(imgElement, newImageSrc) {
    imgElement.src = newImageSrc;
}

