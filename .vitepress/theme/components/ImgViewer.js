import { nextTick } from 'vue'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

// 查找图像之前最近的标题
const findNearestHeading = (imgElement) => {
    let currentElement = imgElement
    while (currentElement && currentElement !== document.body) {
        let previousSibling = currentElement.previousElementSibling
        while (previousSibling) {
            if (previousSibling.tagName.match(/^H[1-6]$/)) {
                return previousSibling.textContent.replace(/\u200B/g, '').trim()
            }
            previousSibling = previousSibling.previousElementSibling
        }
        currentElement = currentElement.parentElement
    }
    return ''
}

export const bindFancybox = async () => {
    await nextTick()
    const { Fancybox } = await import('@fancyapps/ui')
    const imgs = document.querySelectorAll('.vp-doc img')
    imgs.forEach(img => {
        if (!img.hasAttribute('data-fancybox')) {
            img.setAttribute('data-fancybox', 'gallery')
        }
        if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
            const heading = findNearestHeading(img)
            img.setAttribute('alt', heading)
        }
        const altString = img.getAttribute('alt') || ''
        img.setAttribute('data-caption', altString)
    })

    Fancybox.bind('[data-fancybox="gallery"]', {
        Hash: false,
        caption: false,
        Thumbs: {
            type: 'classic',
            showOnStart: false
        },
        Images: {
            Panzoom: {
                maxScale: 4
            }
        },
        Carousel: {
            transition: 'slide'
        },
        Toolbar: {
            display: {
                left: ['infobar'],
                middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY'],
                right: ['slideshow', 'thumbs', 'close']
            }
        }
    })
}

export const destroyFancybox = async () => {
    const { Fancybox } = await import('@fancyapps/ui')
    Fancybox.destroy()
}
