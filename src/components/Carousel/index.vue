<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="carousel in list" :key="carousel.id">
        <img :src="carousel.imgUrl">
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
export default {
  name:'Carousel',
  props:['list'],
  watch: {
        list: {
            //立即监听:不管你数据有没有变化，上来立即监听一次
            //为什么watch监听不到list? 因为这个数据从来没有发生变化
            immediate: true,
            handler() {
                this.$nextTick(() => {
                    var mySwiper = new Swiper(
                        this.$refs.cur,
                        {
                            loop: true, // 循环模式选项

                            // 如果需要分页器
                            pagination: {
                                el: '.swiper-pagination',
                                //点击小圆圈的时候也切换图片
                                clickable: true
                            },

                            // 如果需要前进后退按钮
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                        }
                    );
                })
            }
        }
    }
}
</script>