document.addEventListener('DOMContentLoaded', () => {
    const scroller = new Scroller();
    document.addEventListener('wheel', event => scroller.listenScroll(event))
    document.addEventListener('swipeUp', () => scroller.scroll(1))
    document.addEventListener('swipeDown', () => scroller.scroll(-1))
    document.addEventListener('keydown', (e) => {
      switch ((e.keyCode)) {
        case 40:
          return scroller.scroll(1);
        case 38:
          return scroller.scroll(-1);
        default:
          return;
      }
    })
  })

  
class Scroller {
    constructor() {
      const main = document.querySelector('#container');
      this.sections = document.querySelectorAll('section');
      const sectionsArr = [...this.sections];
      const currentSectionIndex = sectionsArr.findIndex(this.isScrolledIntoView);
      this.currentSectionIndex = currentSectionIndex < 0 ? 0 : currentSectionIndex;
      this.isThrottled = false;
      this.drawNavigation();
      this.listenClick();
    }
  
    isScrolledIntoView(element) {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = Math.floor(rect.bottom);
      const isVissible = (elementTop >= 0) && (elementBottom <= window.innerHeight)
      return isVissible;
  
    }
    listenClick(e){
      const linkClick = document.querySelectorAll('li a');
      const linkClickItem = linkClick.forEach( item =>{
        
        item.addEventListener('click', ()=>{
          this.currentSectionIndex = item.dataset.index * 1;
          this.scrollToCurrentSection();
        
        })
        
      })

    }

    listenScroll(e) {
      if (this.isThrottled) return;
      this.isThrottled = true;
      setTimeout(() => {
        this.isThrottled = false;
      }, 1000);
  
      const direction = e.deltaY > 0 ? 1 : -1;
  
      this.scroll(direction);
    }
    scroll(direction) {
      if (direction === 1) {
        const isLastSection = this.currentSectionIndex === this.sections.length - 1;
        if (isLastSection) return;
      } else if (direction === -1) {
        const firstSection = this.currentSectionIndex === 0;
        if (firstSection) return;
      }
      this.currentSectionIndex = this.currentSectionIndex + direction;
  
      this.scrollToCurrentSection();
    }
  
    scrollToCurrentSection() {
      this.selectActiveNavItem();
      this.sections[this.currentSectionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  
    drawNavigation() {
  
      this.navigationContainer = document.createElement('asaid');
      this.navigationContainer.setAttribute('class', 'scroller__navigation');
      const list = document.createElement('ul');
  
      this.sections.forEach((section, index) => {
        const listItem = document.createElement('li');
        listItem.addEventListener('click', () => {
          this.currentSectionIndex = index;
          this.scrollToCurrentSection();
        })
        list.appendChild(listItem);
      })
  
      this.navigationContainer.appendChild(list);
      document.body.appendChild(this.navigationContainer);
      this.selectActiveNavItem();
    }
  
    selectActiveNavItem() {
      if (this.navigationContainer) {
        const navigationItems = this.navigationContainer.querySelectorAll('li');
        navigationItems.forEach((item, index) => {
          if (index === this.currentSectionIndex) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        })
      }
    }
  }
  

  class Swiper {
    constructor() {
      this.initialY = null;
      this.initialX = null;
      document.addEventListener('touchstart', event => this.startTouch(event))
      document.addEventListener('touchmove', event => this.moveTouch(event))
  
      this.events = {
        swipeUp: new Event('swipeUp'),
        swipeDown: new Event('swipeDown'),
        swipeLeft: new Event('swipeLeft'),
        swipeRight: new Event('swipeRight'),
  
      }
    }
    startTouch(event) {
      event.preventDefault();
      this.initialY = event.touches[0].clientY;
      this.initialX = event.touches[0].clientX;
    }
    moveTouch(event) {
      if (!this.initialX || !this.initialY) return;
  
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
  
      const diffX = this.initialX - currentX;
      const diffY = this.initialY - currentY;
  
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          document.dispatchEvent(this.events.swipeLeft)
        } else {
          document.dispatchEvent(this.events.swipeRight)
        }
      } else {
        if (diffY > 0) {
          document.dispatchEvent(this.events.swipeUp)
        } else {
          document.dispatchEvent(this.events.swipeDown)
        }
      }
      this.initialX = null;
      this.initialY = null;
    }
  }
  new Swiper();