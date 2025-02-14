export function leerImagenBase64(event : Event, data: {base64: string, type:string}){
  if(event.target instanceof HTMLInputElement){
    /* const preview = document.getElementById("img-preview") as HTMLImageElement;
    preview.src = ''; */
    const fileList = event.target.files;
    if(fileList && fileList.length == 1){
      if (!fileList[0].type.startsWith("image/")) {
        return;
      }
      
      data.type = fileList[0].type.split('/')[1];

      const reader = new FileReader();

      new Promise((resolve, reject) =>{
        reader.readAsArrayBuffer(fileList[0]);
        reader.onload = ()=> resolve(reader.result)
      }).then(url => {
        let imageUrl = url as string;
        data.base64 = imageUrl
        /* preview.src = imageUrl; */

      })

    }

  }
}
