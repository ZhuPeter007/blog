// 给每篇文章的标题处添加图片
export const patchH1 = ()=>{
    const h1 = document.querySelector('.vp-doc h1')
    console.log(h1)
    if (h1 && !h1.querySelector('img')) {
        const img = document.createElement('img')
        // 1到14的随机整数
        img.src = `/blog/cloud/clouding${Math.floor(Math.random() * 13 + 1)}.svg`
        img.style.height = '1em'
        img.style.marginLeft = '0.5em'
        h1.appendChild(img)
    }
}

// 给每篇文章添加animation动画
export const emergeAnima = ()=>{
    const el = document.querySelector('.vp-doc')
    if (el) {
        el.classList.remove('emerge-anim')
        void el.offsetWidth // reflow
        el.classList.add('emerge-anim')
    }
}
