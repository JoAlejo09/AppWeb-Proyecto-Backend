const API_URL ="https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0" //direccion del modelo
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY
async function generateAvatar(prompt) {
    const response = await fetch(API_URL,{
        headers:{
            Authorization: `Bearer ${API_KEY}`,
            "Content-type":"application/json",
        },
        method: "POST",
        body: JSON.stringify({"inputs":prompt}),
    })
    return await response.blob()
}

const convertBlobToBase64 = (blob)=>{
    return new Promise((resolve,reject)=>{
        const reader = new FileReader()
        reader.onloadend = ()=>resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}
export{
    generateAvatar,
    convertBlobToBase64
}