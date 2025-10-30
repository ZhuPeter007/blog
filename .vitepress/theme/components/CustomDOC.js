import cloud1 from '../../assests/cloud/clouding1.svg?raw'
import cloud2 from '../../assests/cloud/clouding2.svg?raw'
import cloud3 from '../../assests/cloud/clouding3.svg?raw'
import cloud4 from '../../assests/cloud/clouding4.svg?raw'
import cloud5 from '../../assests/cloud/clouding5.svg?raw'
import cloud6 from '../../assests/cloud/clouding6.svg?raw'
import cloud7 from '../../assests/cloud/clouding7.svg?raw'
import cloud8 from '../../assests/cloud/clouding8.svg?raw'
import cloud9 from '../../assests/cloud/clouding9.svg?raw'
import cloud10 from '../../assests/cloud/clouding10.svg?raw'
import cloud11 from '../../assests/cloud/clouding11.svg?raw'
import cloud12 from '../../assests/cloud/clouding12.svg?raw'
import cloud13 from '../../assests/cloud/clouding13.svg?raw'
import cloud14 from '../../assests/cloud/clouding14.svg?raw'

const clouds = [cloud1, cloud2, cloud3, cloud4, cloud5, cloud6, cloud7, cloud8, cloud9, cloud10, cloud11, cloud12, cloud13, cloud14]


// 给每篇文章的标题处添加图片
export const patchH1 = ()=>{
    const h1 = document.querySelector('.vp-doc h1')
    if (h1 && !h1.querySelector('span')) {
        const span = document.createElement('span')
        const index = Math.floor(Math.random() * clouds.length)
        span.innerHTML = clouds[index]
        const svg = span.firstElementChild
        svg.style.height = '1em'
        svg.style.marginLeft = '0.5em'
        h1.appendChild(span)
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
